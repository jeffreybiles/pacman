import Ember from 'ember';
import GridInfo from '../mixins/grid-info';
import Movement from '../mixins/movement';

export default Ember.Object.extend(GridInfo, Movement, {
  x: 1, //
  y: 1, //
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
      return 0;
    } else {
      let coordinates = this.coordinatesFor(direction)
      let reverseIfPowered = this.get('pac.powerMode') ? -1 : 1
      let chances = ((this.get('pac.y') - this.get('y')) * reverseIfPowered * coordinates.y) +
             ((this.get('pac.x') - this.get('x')) * reverseIfPowered * coordinates.x)
      return Math.max(chances, 0) + 0.2
    }
  },

  getRandomItem(list, weight) {
    var total_weight = weight.reduce(function (prev, cur, i, arr) {
        return prev + cur;
    });

    var random_num = Math.random() * total_weight;
    var weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        weight_sum = +weight_sum.toFixed(2);

        if (random_num < weight_sum) {
            return list[i];
        }
    }
  },

  changeDirection() {
    let directions = ['left', 'right', 'up', 'down']
    let directionWeights = directions.map((direction)=>{
      return this.chanceOfPacmanIfInDirection(direction);
    })

    let bestDirection = this.getRandomItem(directions, directionWeights);
    this.set('direction', bestDirection)
  },

  goToJail() {
    this.set('x', this.get('level.jail.x'))
    this.set('y', this.get('level.jail.y'))
    this.set('direction', 'stopped')
  }
})
