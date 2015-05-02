import Ember from 'ember';

export default Ember.Component.extend({
  // ctx: Ember.computed(function(){
  //   let canvas = document.getElementById("myCanvas");
  //   return canvas.getContext("2d");
  // }),
  // x: 100,
  // y: 100,

  didInsertElement: function(){
    this.drawCircle()
  },

  drawCircle: function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let x = 50;
    let y = 100;
    let radius = 20;

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill() 
  },

  // mainLoop: function(){
  //   var ctx = this.get('ctx'),
  //   x = this.get('x'),
  //   y = this.get('y');

  //   ctx.fillStyle = '#aaa';
  //   ctx.clearRect(0, 0, 400, 300)
  //   this.drawCircle()
  //   this.set('x', x + 1);
  //   this.set('y', y + 1);
  //   Ember.run.later(this, this.mainLoop, 1000/60)
  // }
});
