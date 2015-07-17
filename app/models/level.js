import Ember from 'ember';
import GridInfo from '../mixins/grid-info';

export default Ember.Object.extend(GridInfo, {
  //0- empty
  //1- wall
  //2- pellet
  //3- power pellet
  //4- jail (coming soon)
  defaultGrid: [
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 1, 2, 1],
    [1, 2, 2, 1, 2, 1, 1, 2, 1],
    [1, 1, 2, 3, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
  ],
  startingPac: {x: 4, y: 1},
  startingGhosts: [{x: 1, y: 1}, {x: 1, y: 1}],

  pixelWidth: Ember.computed(function(){
    if(this.get('grid')){
      return this.get('grid')[0].length * this.get('squareSize')
    }
  }),
  pixelHeight: Ember.computed(function(){
    return this.get('grid.length') * this.get('squareSize')
  }),

  reset: function(){
    var newLayout = jQuery.extend(true, [], this.get('defaultGrid'));
    this.set('grid', newLayout);
  }.on('init'),
})
