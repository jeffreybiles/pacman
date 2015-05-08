import Ember from 'ember';

export default Ember.Mixin.create({
  frameCycle: 0,
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),

  squareSize: 40, //
  radius: Ember.computed('squareSize', function(){
    return this.get('squareSize')/2;
  }),
  boardWidth: Ember.computed(function(){
    return this.get('grid')[0].length * this.get('squareSize')
  }),
  boardHeight: Ember.computed(function(){
    return this.get('grid.length') * this.get('squareSize')
  }),

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
});
