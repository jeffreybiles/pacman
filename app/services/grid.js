import Ember from 'ember';
import GridInfo from '../mixins/grid-info';

export default Ember.Service.extend(GridInfo, {
  //0- empty
  //1- wall
  //2- pellet
  //3- power pellet
  //4- jail (coming soon)
  defaultLayout: [
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 1, 2, 1],
    [1, 2, 2, 1, 2, 1, 1, 2, 1],
    [1, 1, 2, 3, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
  ],
  layout: Ember.computed.reads('defaultLayout'),

  pixelWidth: Ember.computed(function(){
    if(this.get('layout')){
      return this.get('layout')[0].length * this.get('squareSize')
    }
  }),
  pixelHeight: Ember.computed(function(){
    return this.get('layout.length') * this.get('squareSize')
  }),

  reset(){
    console.log('resetting grid')
    var newLayout = jQuery.extend(true, [], this.get('defaultLayout'));
    console.log('new grid', newLayout)
    this.set('layout', newLayout);
    console.log('grid', this.get('layout'))
  },





})
