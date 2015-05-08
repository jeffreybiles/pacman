import Ember from 'ember';

// properties with a // afterwards are exact copies
// of those same ones in pac-man component
// put into a grid mixin (GridAware?)
export default Ember.Object.extend({
  x: 0, //
  y: 0, //
  frameCycle: 0, //
  direction: 'stopped',
  squareSize: 40, //
  radius: Ember.computed('squareSize', function(){
    return this.get('squareSize')/2;
  }), //

  grid: [
    [2, 2, 2, 2, 2, 1, 1, 1],
    [2, 1, 1, 1, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1],
    [2, 2, 1, 2, 2, 1, 2, 1],
    [2, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
  ],

  directions: {
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
    'stopped': {x: 0, y: 0}
  }, //

  drawOn: function(ctx){
    ctx.fillStyle = '#3AA'
    ctx.beginPath()
    ctx.arc(
      this.circleCenterFor('x', this.get('direction')),
      this.circleCenterFor('y', this.get('direction')),
      this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill()
  }, //shows many similarities to drawPac....

  loop: function(){
     if(this.get('frameCycle') === 20 || this.get('direction') === 'stopped'){
      this.move()
      this.hunt()
      this.set('frameCycle', 1);
    } else {
      this.set('frameCycle', this.get('frameCycle') + 1)
    }
    Ember.run.later(this, this.loop, 1000/60)
  }, //shows many similarities to mainLoop....

  move: function(){
    this.setProperties({
      x: this.nextCoordinate(this.get('direction'), 'x'),
      y: this.nextCoordinate(this.get('direction'), 'y')
    })
  }, //shows many similarities to movePac....

  hunt: function(){
    // later this will take on the task of chasing pacman
    // right now it's just moving randomly
    let possibleDirections = ['left', 'right', 'up', 'down'].filter((direction)=>{
      return !this.pathBlockedInDirection(direction)
    })
    let newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
    this.set('direction', newDirection)
  },

  pathBlockedInDirection: function(direction){
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  }, //

  cellTypeInDirection: function(direction){
    let nextX = this.nextCoordinate(direction, 'x')
    let nextY = this.nextCoordinate(direction, 'y')

    if(this.get('grid')[nextY]){
      return this.get('grid')[nextY][nextX];
    }
  }, //

  nextCoordinate: function(direction, coordinate){
    return this.get(coordinate) + this.coordinatesFor(direction)[coordinate]
  }, //

  circleCenterFor: function(coordinate, direction){
    let animationChange = this.coordinatesFor(direction)[coordinate] * this.get('frameCycle') / 20
    return (this.get(coordinate) + 1/2 + animationChange) * this.get('squareSize')
  }, //

  coordinatesFor: function(direction){
    return this.get(`directions.${direction}`)
  }, //
})