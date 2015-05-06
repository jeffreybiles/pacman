import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),
  x: 100,
  y: 100,
  dx: 0,
  dy: 1,
  boardWidth: 800,
  boardHeight: 600,


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
    ctx.clearRect(0, 0, this.get('boardWidth'), this.get('boardHeight'))
    this.drawCircle()
    this.calculatePacMovement()
    Ember.run.later(this, this.mainLoop, 1000/60)
  },

  calculatePacMovement: function(){
    this.set('x', this.get('x') + this.get('dx'));
    this.set('y', this.get('y') + this.get('dy'));
  },


  keyboardShortcuts: {
    up: function(){
      this.set('dx', 0);
      this.set('dy', -1);
    },
    down: function(){
      this.set('dx', 0);
      this.set('dy', 1);
    },
    left: function(){
      this.set('dx', -1);
      this.set('dy', 0);
    },
    right: function(){
      this.set('dx', 1);
      this.set('dy', 0);
    },
  }
});
