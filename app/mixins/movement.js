import Ember from 'ember';
//requires the grid-aware mixin as well

export default Ember.Mixin.create({
  framesPerMovement: 30,

  loop() {
    if(this.get('frameCycle') === this.get("framesPerMovement") || this.get('direction') === 'stopped'){
      this.move();
      this.changeDirection();
      this.set('frameCycle', 1);
    } else {
      this.incrementProperty('frameCycle')
    }
    Ember.run.later(this, this.loop, 1000/60)
  },

  move() {
    this.setProperties({
      x: this.nextCoordinate(this.get('direction'), 'x'),
      y: this.nextCoordinate(this.get('direction'), 'y')
    })
  },

  centerFor(coordinate, direction){
    let animationChange = this.coordinatesFor(direction)[coordinate] * this.get('frameCycle') / this.get('framesPerMovement')
    return (this.get(coordinate) + 1/2 + animationChange) * this.get('squareSize')
  },
});
