import Ember from 'ember';
//requires the grid-aware mixin as well

export default Ember.Mixin.create({
  framesPerMovement: 30,
  timers: [],
  frameCycle: 0,

  loop() {
    if(this.get('frameCycle') === this.get("framesPerMovement") || this.get('direction') === 'stopped'){
      this.move();
      this.get('timers').forEach((timerName)=>{
        var timer = this.get(timerName);
        if(timer > 0){
          this.set(timerName, timer - 1)
        }
      })
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

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate(direction, 'x');
    let nextY = this.nextCoordinate(direction, 'y');

    return this.get(`grid.layout.${nextY}.${nextX}`);
  },

  nextCoordinate(direction, coordinate) {
    let size = coordinate == 'x' ? this.get('grid.layout')[0].length : this.get('grid.layout').length;
    let calculatedNext = this.get(coordinate) + this.coordinatesFor(direction)[coordinate];
    return this.modulo(calculatedNext, size);
  },

  modulo(num, mod){
    return ((num + mod) % mod);
  },
});
