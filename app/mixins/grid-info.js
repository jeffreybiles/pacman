import Ember from 'ember';

export default Ember.Mixin.create({
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),

  squareSize: 40, //

  coordinatesFor(direction) {
    return this.get(`directions.${direction}`)
  },

  radius: Ember.computed('squareSize', function(){
    return this.get('squareSize')/2;
  }),

  directions: {
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
    'stopped': {x: 0, y: 0},
    'paused': {x: 0, y: 0}
  },
})
