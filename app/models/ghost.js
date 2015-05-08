import Ember from 'ember';
import GridAware from '../mixins/grid-aware';
import Movement from '../mixins/movement';

export default Ember.Object.extend(GridAware, Movement, {
  x: 0, //
  y: 0, //
  direction: 'stopped',
  color: '#3AA',

  draw: function(){
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

  changeDirection: function(){
    // later this will take on the task of chasing pacman
    // right now it's just moving randomly
    let possibleDirections = ['left', 'right', 'up', 'down'].filter((direction)=>{
      return !this.pathBlockedInDirection(direction)
    })
    let newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
    this.set('direction', newDirection)
  }, //this is structured differently, but shares same purpose as changePacDirection
})