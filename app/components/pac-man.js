import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Ghost from '../models/ghost';
import Pac from '../models/pac';
import GridAware from '../mixins/grid-aware';

export default Ember.Component.extend(KeyboardShortcuts, GridAware, {
  score: 0,
  ghosts: [],

  pac: null,

  didInsertElement: function(){
    this.set('pac', Pac.create())
    this.get('ghosts').pushObject(Ghost.create())
    this.get('ghosts').pushObject(Ghost.create({color: '#A3A'}))
    this.get('ghosts').pushObject(Ghost.create({color: '#AA3'}))
    this.get('ghosts').forEach(function(ghost){
      ghost.loop();
    })
    this.get('pac').loop();
    this.mainLoop();
  },

  drawPac: function(){
  },

  drawGrid: function(){
    let ctx = this.get('ctx');
    let squareSize = this.get('squareSize');
    ctx.fillStyle = '#000';
    this.get('grid').forEach((row, i)=>{
      row.forEach((block, j)=>{
        if(block === 1){
          ctx.fillRect(j * squareSize,
                       i * squareSize,
                       squareSize,
                       squareSize)
        } else if (block === 2){
          ctx.beginPath()
          ctx.arc((j + 1/2) * squareSize, 
                  (i + 1/2) * squareSize, 
                  squareSize / 6, 
                  0, 
                  Math.PI * 2, 
                  false);
          ctx.closePath()
          ctx.fill()  
        }
      })
    })    
  },

  mainLoop: function(){
    this.draw();
    this.scoreUpdate();

    Ember.run.later(this, this.mainLoop, 1000/60)
  },
  
  scoreUpdate: function(){
    if(this.get('pac').cellTypeInDirection('stopped') === 2){
      this.set('score', this.get('score') + 1);
      this.get('grid')[this.get('pac.y')][this.get('pac.x')] = 0;
    }
  },

  draw: function(){
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('boardWidth'), this.get('boardHeight') * this.get('squareSize'))
    this.get('pac').draw()
    this.drawGrid()
    this.get('ghosts').forEach(function(ghost){
      ghost.draw();
    })
  },

  keyboardShortcuts: {
    up: function(){ this.set('pac.intent', 'up')},
    down: function(){ this.set('pac.intent', 'down')},
    left: function(){ this.set('pac.intent', 'left')},
    right: function(){ this.set('pac.intent', 'right')},
  }
});
