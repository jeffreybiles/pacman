import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Ghost from '../models/ghost';

export default Ember.Component.extend(KeyboardShortcuts, {
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),
  frameCycle: 0, 
  x: 0,
  y: 3,
  direction: 'down',
  intent: 'down',
  boardWidth: Ember.computed(function(){
    return this.get('grid')[0].length * this.get('squareSize')
  }),
  boardHeight: Ember.computed(function(){
    return this.get('grid.length') * this.get('squareSize')
  }),
  squareSize: 40,
  radius: Ember.computed('squareSize', function(){
    return this.get('squareSize')/2;
  }),
  score: 0,
  ghosts: [],

  grid: [
    [2, 2, 2, 2, 2, 1, 1, 1],
    [2, 1, 1, 1, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1],
    [2, 2, 1, 2, 2, 1, 2, 1],
    [2, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
  ],

  didInsertElement: function(){
    this.get('ghosts').pushObject(Ghost.create())
    this.get('ghosts').forEach(function(ghost){
      ghost.loop();
    })
    this.mainLoop();
  },

  drawPac: function(){
    let ctx = this.get('ctx');

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(
      this.circleCenterFor('x', this.get('direction')),
      this.circleCenterFor('y', this.get('direction')),
      this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill() 
  },

  circleCenterFor: function(coordinate, direction){
    let animationChange = this.coordinatesFor(direction)[coordinate] * this.get('frameCycle') / 20
    return (this.get(coordinate) + 1/2 + animationChange) * this.get('squareSize')
  },

  drawGrid: function(){
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

  directions: {
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
    'stopped': {x: 0, y: 0}
  },

  mainLoop: function(){
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('boardWidth'), this.get('boardHeight') * this.get('squareSize'))
    this.drawPac()
    this.drawGrid()
    this.get('ghosts').forEach(function(ghost){
      ghost.drawOn(ctx);
    })
    if(this.get('frameCycle') === 20 || this.get('direction') === 'stopped'){
      this.movePac();
      this.scoreUpdate();
      this.changePacDirection();
      this.set('frameCycle', 1);
    } else {
      this.set('frameCycle', this.get('frameCycle') + 1)
    }
    Ember.run.later(this, this.mainLoop, 1000/60)
  },

  scoreUpdate: function(){
    if(this.cellTypeInDirection('stopped') === 2){
      this.set('score', this.get('score') + 1);
      this.get('grid')[this.get('y')][this.get('x')] = 0;
    }
  },

  movePac: function(){
    this.setProperties({
      x: this.nextCoordinate(this.get('direction'), 'x'),
      y: this.nextCoordinate(this.get('direction'), 'y')
    })
  },

  changePacDirection: function(){
    let intent = this.get('intent')
    if(this.pathBlockedInDirection(intent)){
      if(this.pathBlockedInDirection(this.get('direction'))){
        this.set('direction', 'stopped')
      }
    } else {
      this.set('direction', intent)
    }
  },

  pathBlockedInDirection: function(direction){
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection: function(direction){
    let nextX = this.nextCoordinate(direction, 'x')
    let nextY = this.nextCoordinate(direction, 'y')

    if(this.get('grid')[nextY]){
      return this.get('grid')[nextY][nextX];
    }
  },

  nextCoordinate: function(direction, coordinate){
    return this.get(coordinate) + this.coordinatesFor(direction)[coordinate]
  },

  coordinatesFor: function(direction){
    return this.get(`directions.${direction}`)
  },

  keyboardShortcuts: {
    up: function(){ this.set('intent', 'up')},
    down: function(){ this.set('intent', 'down')},
    left: function(){ this.set('intent', 'left')},
    right: function(){ this.set('intent', 'right')},
  }
});
