import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Ghost from '../models/ghost';
import Pac from '../models/pac';
import GridInfo from '../mixins/grid-info';

export default Ember.Component.extend(KeyboardShortcuts, GridInfo, {
  grid: Ember.inject.service(),

  score: 0,
  ghosts: [],
  lives: 3,
  level: 1,
  pac: null,

  didInsertElement() {
    this.get('grid').reset()
    this.start();
  },

  start() {
    let grid = this.get('grid')
    let pac = Pac.create({grid: grid})
    this.set('pac', pac)
    var ghost = Ghost.create({pac: pac, grid: grid})
    this.get('ghosts').pushObject(ghost)
    this.get('ghosts').pushObject(Ghost.create({pac: pac, grid: grid, color: '#A3A'}))
    this.get('ghosts').forEach(function(ghost){
      ghost.loop();
    })
    this.get('pac').loop();
    this.mainLoop();
  },

  drawGrid() {
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');
    this.get('grid.layout').forEach((row, i)=>{
      row.forEach((block, j)=>{
        if(block === 1){
          ctx.fillStyle = '#000';
          ctx.fillRect(j * squareSize,
                       i * squareSize,
                       squareSize,
                       squareSize)
        } else if (block === 2){
          ctx.fillStyle = '#000';
          ctx.beginPath()
          ctx.arc((j + 1/2) * squareSize,
                  (i + 1/2) * squareSize,
                  squareSize / 6,
                  0,
                  Math.PI * 2,
                  false);
          ctx.closePath()
          ctx.fill()
        } else if (block === 3){
          ctx.fillStyle = '#090';
          ctx.beginPath()
          ctx.arc((j + 1/2) * squareSize,
                  (i + 1/2) * squareSize,
                  squareSize / 4,
                  0,
                  Math.PI * 2,
                  false);
          ctx.closePath()
          ctx.fill()
        }
      })
    })
  },

  mainLoop() {
    this.draw();
    this.eatPellets();

    if(this.didCollide()){
      this.decrementProperty('lives')
      this.restart();
    } else if(this.levelComplete()) {
      this.get('grid').reset();
      this.incrementProperty('level')
      this.restart();
    } else {
      Ember.run.later(this, this.mainLoop, 1000/60)
    }
  },

  restart() {
    if(this.get('lives') <= 0){
      this.set('score', 0);
      this.set('level', 1);
      this.get('grid').reset();
      this.set('lives', 3);
    }
    this.set('ghosts', []);
    this.start();
  },

  eatPellets() {
    let nextCellType = this.get('pac').cellTypeInDirection('stopped')
    if(nextCellType === 2){
      this.incrementProperty('score');
    } else if (nextCellType === 3){
      this.set('pac.powerPelletTime', this.get('pac.maxPowerPelletTime'));
    }
    this.get('grid.layout')[this.get('pac.y')][this.get('pac.x')] = 0;
  },

  didCollide() {
    let collided = false;
    let pac = this.get('pac');
    this.get('ghosts').forEach((ghost)=>{
      if(pac.get('x') == ghost.get('x') &&
         pac.get('y') == ghost.get('y')){
        collided = true
      }
    });
    return collided;
  },

  draw() {
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('grid.pixelWidth'), this.get('grid.pixelHeight') * this.get('squareSize'))
    this.drawGrid()
    this.get('pac').draw()
    this.get('ghosts').forEach(function(ghost){
      ghost.draw();
    })
  },

  keyboardShortcuts: {
    up() { this.set('pac.intent', 'up')},
    down() { this.set('pac.intent', 'down')},
    left() { this.set('pac.intent', 'left')},
    right() { this.set('pac.intent', 'right')},
  },

  levelComplete() {
    let hasPelletsLeft = false;
    this.get('grid.layout').forEach((row)=>{
      let rowHasPellets = row.any((cell)=>{
        return cell == 2
      })
      if(rowHasPellets){
        hasPelletsLeft = true
      }
    })
    return !hasPelletsLeft;
  },
});
