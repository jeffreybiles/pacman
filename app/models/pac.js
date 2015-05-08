import Ember from 'ember';
import GridAware from '../mixins/grid-aware';
import Movement from '../mixins/movement';

export default Ember.Object.extend(GridAware, Movement, {
  x: 0,
  y: 3,
  direction: 'down',
  intent: 'down',
  framesPerMovement: 20,

  draw: function(){
    let ctx = this.get('ctx');

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(
      this.centerFor('x', this.get('direction')),
      this.centerFor('y', this.get('direction')),
      this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill()
  },


  changeDirection: function(){
    let intent = this.get('intent')
    if(this.pathBlockedInDirection(intent)){
      if(this.pathBlockedInDirection(this.get('direction'))){
        this.set('direction', 'stopped')
      }
    } else {
      this.set('direction', intent)
    }
  },
})