import Ember from 'ember';
import GridAware from '../mixins/grid-aware';
import Movement from '../mixins/movement';

export default Ember.Object.extend(GridAware, Movement, {
  x: 0, //
  y: 0, //
  direction: 'stopped',
  color: '#3AA',
  pac: null,

  draw() {
    let ctx = this.get('ctx');

    ctx.fillStyle = this.get('color')
    ctx.beginPath()
    ctx.arc(
      this.centerFor('x', this.get('direction')),
      this.centerFor('y', this.get('direction')),
      this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill()
  }, //shows many similarities to drawPac....

  chanceOfPacmanIfInDirection(direction) {
    if(this.pathBlockedInDirection(direction)){
      return 999999;
    } else {
      let coordinates = this.coordinatesFor(direction)
      return ((this.get('y') - this.get('pac.y')) * coordinates.y) +
             ((this.get('x') - this.get('pac.x')) * coordinates.x)
    }
  },

  changeDirection() {
    let scoredDirections = ['left', 'right', 'up', 'down'].map((direction)=>{
      return {
        direction: direction,
        score: this.chanceOfPacmanIfInDirection(direction)
      }
    })
    let sortedDirections = scoredDirections.sortBy('score')
    let bestDirection = sortedDirections[0]
    this.set('direction', bestDirection['direction'])
  },
})