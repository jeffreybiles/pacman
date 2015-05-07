import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  ctx: Ember.computed(function(){
    let canvas = document.getElementById("myCanvas");
    return canvas.getContext("2d");
  }),
  x: 200,
  y: 200,
  dx: 0,
  dy: 1,
  boardWidth: 800,
  boardHeight: 600,
  squareSize: 40,
  radius: Ember.computed('squareSize', function(){
    return this.get('squareSize')/2;
  }),
  speed: 2,

  walls: [
    {x: 1, y: 1},
    {x: 10, y: 5}
  ],

  didInsertElement: function(){
    this.mainLoop();
  },

  drawCircle: function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(this.get('x'), this.get('y'), this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill() 
  },

  drawWalls: function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    ctx.fillStyle = '#000'
    this.get('walls').forEach((wall)=>{
      ctx.fillRect(wall.x * this.get('squareSize'),
                   wall.y * this.get('squareSize'),
                   this.get('squareSize'),
                   this.get('squareSize'))

    })
  },

  mainLoop: function(){
    var ctx = this.get('ctx');

    ctx.fillStyle = '#aaa';
    ctx.clearRect(0, 0, this.get('boardWidth'), this.get('boardHeight'))
    this.drawCircle()
    this.drawWalls()
    this.calculatePacMovement()
    Ember.run.later(this, this.mainLoop, 1000/60)
  },

  calculatePacMovement: function(){
    this.collisionDetection();
    this.set('x', this.get('x') + this.get('dx'));
    this.set('y', this.get('y') + this.get('dy'));
  },

  collisionDetection: function(){
    if(this.collidedWithBorder() || this.collidedWithWall()){
      this.collide();
    }
  },

  collidedWithBorder: function(){
    return this.get('x') - this.get('radius') < 0 ||
           this.get('x') + this.get('radius') > this.get('boardWidth') ||
           this.get('y') - this.get('radius') < 0 ||
           this.get('y') + this.get('radius') > this.get('boardHeight');
  },

  collidedWithWall: function(){
    return this.get('walls').any((wall)=>{
      return this.get('x') - this.get('radius') < (wall.x + 1) * this.get('squareSize') &&
             this.get('x') + this.get('radius') > wall.x * this.get('squareSize') &&
             this.get('y') - this.get('radius') < (wall.y + 1) * this.get('squareSize') &&
             this.get('y') + this.get('radius') > wall.y * this.get('squareSize');
    });
  },

  collide: function(direction){
    this.set('x', this.get('x') - this.get('dx'));
    this.set('y', this.get('y') - this.get('dy'))
    this.set('dx', 0);
    this.set('dy', 0);
  },

  keyboardShortcuts: {
    up: function(){
      this.set('dx', 0);
      this.set('dy', this.get('speed') * -1);
    },
    down: function(){
      this.set('dx', 0);
      this.set('dy', this.get('speed'));
    },
    left: function(){
      this.set('dx', this.get('speed') * -1);
      this.set('dy', 0);
    },
    right: function(){
      this.set('dx', this.get('speed'));
      this.set('dy', 0);
    },
  }
});
