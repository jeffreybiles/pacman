import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),
  frameCycle: 0, 
  x: 0,
  y: 0,
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

  grid: [
    [0, 0, 0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
  ],

  didInsertElement: function(){
    this.mainLoop();
  },

  drawPac: function(){
    let ctx = this.get('ctx');
    let directionCoordinates = this.coordinatesFor(this.get('direction'));

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(
      (this.get('x') + 1/2 + (directionCoordinates.x * this.get('frameCycle') / 20)) * this.get('squareSize'),
      (this.get('y') + 1/2 + (directionCoordinates.y * this.get('frameCycle') / 20)) * this.get('squareSize'),
      this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill() 
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
    if(this.get('frameCycle') === 20 || this.get('direction') === 'stopped'){
      let intent = this.get('intent')
      this.setProperties({
        x: this.nextCoordinate(this.get('direction'), 'x'),
        y: this.nextCoordinate(this.get('direction'), 'y')
      })
      if(this.gridBlockedInDirection(intent)){
        if(this.gridBlockedInDirection(this.get('direction'))){
          this.set('direction', 'stopped')
        }
      } else {
        this.set('direction', intent)
      }
      this.set('frameCycle', 0);
    }
    this.set('frameCycle', this.get('frameCycle') + 1)
    Ember.run.later(this, this.mainLoop, 1000/60)
  },

  gridBlockedInDirection: function(direction){
    let gridInDirection = this.gridInDirection(direction);
    return Ember.isEmpty(gridInDirection) || gridInDirection === 1;
  },

  gridInDirection: function(direction){
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
