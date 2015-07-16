import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Ghost from '../models/ghost';
import Pac from '../models/pac';
import GridAware from '../mixins/grid-aware';

export default Ember.Component.extend(KeyboardShortcuts, GridAware, {
  score: 0,
  ghosts: [],

  pac: null,

  didInsertElement() {
    let pac = Pac.create()
    this.set('pac', pac)
    this.get('ghosts').pushObject(Ghost.create({pac: pac}))
    this.get('ghosts').pushObject(Ghost.create({pac: pac, color: '#A3A'}))
    this.get('ghosts').forEach(function(ghost){
      ghost.loop();
    })
    this.get('pac').loop();
    this.mainLoop();
  },

  drawGrid() {
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');
    ctx.fillStyle = '#000';
    this.get('grid').forEach((row, i)=>{
      row.forEach((block, j)=>{
        if(block === 1){
          ctx.fillRect(j * squareSize,
                       i * squareSize,
                       squareSize,
                       squareSize)
        } else if (block === 2){
          ctx.beginPath()
          ctx.arc((j + 1/2) * squareSize,
                  (i + 1/2) * squareSize,
                  squareSize / 6,
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
    this.scoreUpdate();

    Ember.run.later(this, this.mainLoop, 1000/60)
  },

  scoreUpdate() {
    if(this.get('pac').cellTypeInDirection('stopped') === 2){
      this.incrementProperty('score');
      this.get('grid')[this.get('pac.y')][this.get('pac.x')] = 0;
    }
  },

  draw() {
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('boardWidth'), this.get('boardHeight') * this.get('squareSize'))
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
  }
});
