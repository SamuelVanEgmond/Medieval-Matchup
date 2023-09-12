/* global THREE */ 
/* global AFRAME */ 

// Handles the rotation of the model on the different environments
// Smoothness could be improved!
AFRAME.registerComponent('rotator', {
  schema: {},
  init: function () {
    this.state = 'nodrag';
    document.addEventListener( 'mousedown',  this._onMouseDown.bind(this) );
    document.addEventListener( 'mousemove',  this._onMouseMove.bind(this) );
    document.addEventListener( 'mouseup',    this._onMouseUp.bind(this) );
    
    document.addEventListener( 'touchstart', this._onMouseDown.bind(this) );
    document.addEventListener( 'touchmove',  this._onMouseMove.bind(this) );
    document.addEventListener( 'touchend',   this._onMouseUp.bind(this) );
    
    document.getElementById('controllerGo').addEventListener("axismove", this._onAxisMove.bind(this));
    document.getElementById('controllerLeft').addEventListener("thumbstickmoved", this._onThumbstickMoved.bind(this));
    document.getElementById('controllerRight').addEventListener("thumbstickmoved", this._onThumbstickMoved.bind(this));
  },

  update: function () {},
  
  tick: function () {
  },

	_onMouseDown: function( event )  {
    if (!isNaN(event.button) || event.type === 'touchstart') {
      if(event.type === 'touchstart'){
        event = event.touches[0]; // Contains clientX and clientY for touch
      }
      this.state = 'dragstart';
      this.pointerX = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.pointerY = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    else
      this.state = 'nodrag';
  },
  
	_onMouseMove: function( event )  {
    if(event.type === 'touchmove'){
      event = event.touches[0]; // Contains clientX and clientY for touch
    }
    let pointerX = ( event.clientX / window.innerWidth ) * 2 - 1;
    let pointerY = - ( event.clientY / window.innerHeight ) * 2 + 1;
    let distance = Math.max(Math.abs(pointerX - this.pointerX), Math.abs(pointerY - this.pointerY));
    
    if ((this.state === 'dragstart' && distance>0.01) || this.state === 'dragging') {
      this.state = 'dragging';
      this.el.object3D.rotation.y += Math.PI * (pointerX-this.pointerX) / 2;
      this.el.object3D.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.el.object3D.rotation.x - Math.PI * (pointerY-this.pointerY) / 4));
      this.pointerX = pointerX;
      this.pointerY = pointerY;
    }
  },

	_onMouseUp: function( event )  {
    this.state = 'nodrag';
  },
  
 _onAxisMove: function(event) {
   // Oculus Go Snap Turn
   let x = event.detail.axis[0];
   let y = event.detail.axis[1];
   this._rotateOnControls(x, y);
  },

  _onThumbstickMoved: function(event) {
    // Oculus Quest Snap Turn
    let x = event.detail.x;
    let y = event.detail.y;
    this._rotateOnControls(x, y);
  }, 
  
  _rotateOnControls(x, y) {
    
     // Don't move in the middle 'dead zone'
     if (x < -0.05) 
       x = (x+0.05)/0.95;
     else if (x > 0.05) 
       x = (x-0.05)/0.95;
     else 
       x = 0;
    
     if (y < -0.05) 
       y = (y+0.05)/0.95;
     else if (y > 0.05) 
       y = (y-0.05)/0.95;
     else 
       y = 0;
    
    // Rotate the level
    this.el.object3D.rotation.y += 0.05 * x;
    //this.el.object3D.rotation.x = Math.PI/2 * y*y*y;  // Less movement in the middel, but keep the sign    
    this.el.object3D.rotation.x += 0.05 * y;  // Less movement in the middel, but keep the sign    
    this.el.object3D.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.el.object3D.rotation.x));
  },
  
  remove: function () {},
  pause: function () {},
  play: function () {}
});


