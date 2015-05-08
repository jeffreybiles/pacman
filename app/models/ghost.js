import Ember from 'ember';
import GridAware from '../mixins/grid-aware';

export default Ember.Object.extend(GridAware, {
  x: 0, //
  y: 0, //
  direction: 'stopped',
  color: '#3AA',

  draw: function(){
    let ctx = this.get('ctx');

    ctx.fillStyle = this.get('color')
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
  }, //this is structured differently, but shares same purpose as changePacDirection
})