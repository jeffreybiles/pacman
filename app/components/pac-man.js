import Ember from 'ember';

export default Ember.Component.extend({
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),
  x: 100,
  y: 100,


  didInsertElement: function(){
    this.mainLoop()
  },

  drawCircle: function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let radius = 20;

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(this.get('x'), this.get('y'), radius, 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill() 
  },

  mainLoop: function(){
    var ctx = this.get('ctx');

    ctx.fillStyle = '#aaa';
    ctx.clearRect(0, 0, 800, 600)
    this.drawCircle()
    this.set('x', this.get('x') + 1);
    this.set('y', this.get('y') + 1);
    Ember.run.later(this, this.mainLoop, 1000/60)
  }
});
