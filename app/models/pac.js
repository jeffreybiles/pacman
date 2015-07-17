import Ember from 'ember';
import GridInfo from '../mixins/grid-info';
import Movement from '../mixins/movement';

export default Ember.Object.extend(GridInfo, Movement, {
  x: 1,
  y: 5,
  direction: 'stopped',
  intent: 'down',
  framesPerMovement: 20,
  timers: ['powerPelletTime'],

  color: Ember.computed('powerPelletTime', function(){
    return `#0${Math.round(this.get('powerPelletTime')/this.get('maxPowerPelletTime')*15).toString(16)}0`
  }),
  maxPowerPelletTime: 15,
  powerPelletTime: 0,
  powerMode: Ember.computed.gt('powerPelletTime', 0),

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
  },


  changeDirection() {
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
