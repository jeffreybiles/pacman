import Ember from 'ember';
//requires the grid-aware mixin as well

export default Ember.Mixin.create({
  framesPerMovement: 30,

  loop: function(){
    if(this.get('frameCycle') === this.get("framesPerMovement") || this.get('direction') === 'stopped'){
      this.move();
      this.changeDirection();
      this.set('frameCycle', 1);
    } else {
      this.set('frameCycle', this.get('frameCycle') + 1)
    }
    Ember.run.later(this, this.loop, 1000/60)
  },

  move: function(){
    this.setProperties({
      x: this.nextCoordinate(this.get('direction'), 'x'),
      y: this.nextCoordinate(this.get('direction'), 'y')
    })
  },

  centerFor: function(coordinate, direction){
    let animationChange = this.coordinatesFor(direction)[coordinate] * this.get('frameCycle') / this.get('framesPerMovement')
    return (this.get(coordinate) + 1/2 + animationChange) * this.get('squareSize')
  },
});
