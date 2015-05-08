import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Ghost from '../models/ghost';
import GridAware from '../mixins/grid-aware';

export default Ember.Component.extend(KeyboardShortcuts, GridAware, {
  x: 0,
  y: 3,
  direction: 'down',
  intent: 'down',
  score: 0,
  ghosts: [],

  didInsertElement: function(){
    this.get('ghosts').pushObject(Ghost.create())
    this.get('ghosts').pushObject(Ghost.create({color: '#A3A'}))
    this.get('ghosts').pushObject(Ghost.create({color: '#AA3'}))
    this.get('ghosts').forEach(function(ghost){
      ghost.loop();
    })
    this.mainLoop();
  },

  drawPac: function(){
    let ctx = this.get('ctx');

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(
      this.circleCenterFor('x', this.get('direction')),
      this.circleCenterFor('y', this.get('direction')),
      this.get('radius'), 0, Math.PI * 2, false);
    ctx.closePath()
    ctx.fill() 
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
    let ctx = this.get('ctx');

    ctx.clearRect(0, 0, this.get('boardWidth'), this.get('boardHeight') * this.get('squareSize'))
    this.drawPac()
    this.drawGrid()
    this.get('ghosts').forEach(function(ghost){
      ghost.draw();
    })
    if(this.get('frameCycle') === 20 || this.get('direction') === 'stopped'){
      this.movePac();
      this.scoreUpdate();
      this.changePacDirection();
      this.set('frameCycle', 1);
    } else {
      this.set('frameCycle', this.get('frameCycle') + 1)
    }
    Ember.run.later(this, this.mainLoop, 1000/60)
  },

  scoreUpdate: function(){
    if(this.cellTypeInDirection('stopped') === 2){
      this.set('score', this.get('score') + 1);
      this.get('grid')[this.get('y')][this.get('x')] = 0;
    }
  },

  movePac: function(){
    this.setProperties({
      x: this.nextCoordinate(this.get('direction'), 'x'),
      y: this.nextCoordinate(this.get('direction'), 'y')
    })
  },

  changePacDirection: function(){
    let intent = this.get('intent')
    if(this.pathBlockedInDirection(intent)){
      if(this.pathBlockedInDirection(this.get('direction'))){
        this.set('direction', 'stopped')
      }
    } else {
      this.set('direction', intent)
    }
  },

  keyboardShortcuts: {
    up: function(){ this.set('intent', 'up')},
    down: function(){ this.set('intent', 'down')},
    left: function(){ this.set('intent', 'left')},
    right: function(){ this.set('intent', 'right')},
  }
});
