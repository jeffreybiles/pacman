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
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 1, 2, 1],
    [1, 2, 2, 1, 2, 1, 1, 2, 1],
    [1, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
  ],

  resetGrid(){
    let grid = this.get('grid')
    let height = grid.length
    let width = grid[0].length
    for(var i=0; i < height; i++){
      for(var j=0; j < width; j++){
        if(grid[i][j] == 0){
          grid[i][j] = 2
        }
      }
    }
  },

  levelComplete() {
    let hasPelletsLeft = false;
    this.get('grid').forEach((row)=>{
      let rowHasPellets = row.any((cell)=>{
        return cell == 2
      })
      if(rowHasPellets){
        hasPelletsLeft = true
      }
    })
    return !hasPelletsLeft;
  },

  directions: {
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
    'stopped': {x: 0, y: 0}
  },

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate(direction, 'x');
    let nextY = this.nextCoordinate(direction, 'y');

    return this.get(`grid.${nextY}.${nextX}`);
  },

  nextCoordinate(direction, coordinate) {
    let size = coordinate == 'x' ? this.get('grid')[0].length : this.get('grid').length;
    let calculatedNext = this.get(coordinate) + this.coordinatesFor(direction)[coordinate];
    return this.modulo(calculatedNext, size);
  },

  modulo(num, mod){
    return ((num + mod) % mod);
  },

  coordinatesFor(direction) {
    return this.get(`directions.${direction}`)
  },
});
