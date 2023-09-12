/* global THREE */ 
/* global AFRAME */ 

// Handles clicking on the different target environments
// Should be abstracted more so it is reusable (e.g. the menu now contains a lot of copied code)
AFRAME.registerComponent('clicker', {
  schema: {},
  init: function () {
    this.raycasterScreen = new THREE.Raycaster();
    
    this.pointer = new THREE.Vector2();
    document.addEventListener( 'click', this._onClickScreen.bind(this) );
    document.getElementById('controllerLeft').addEventListener('triggerup', this._onClickLeft.bind(this));
    document.getElementById('controllerRight').addEventListener('triggerup', this._onClickRight.bind(this));
    document.getElementById('controllerGo').addEventListener('triggerup', this._onClickGo.bind(this));    
  },

  update: function () {},
  
  tick: function () {
  },

	_onClickScreen: function( event )  {
    if (!this.camera) {
      this.camera = document.getElementById("camera").getObject3D('camera');
      if (!this.camera) {
        return
      }
    }

    this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    this.raycasterScreen.setFromCamera( this.pointer, this.camera );
    this._checkRaycaster(this.raycasterScreen);
  },
  
  _onClickLeft() {
    let raycaster = document.getElementById("raycasterLeft").components["raycaster"].raycaster;
    this._checkRaycaster(raycaster);
  },

  _onClickRight() {
    let raycaster = document.getElementById("raycasterRight").components["raycaster"].raycaster;
    this._checkRaycaster(raycaster);
  },

  _onClickGo() {
    let raycaster = document.getElementById("raycasterGo").components["raycaster"].raycaster;
    this._checkRaycaster(raycaster);
  },

  _checkRaycaster(raycaster) {
    if (!this.stones) {
      this.stones = this.el;
      if (!this.stones) {
        return
      }
      this.stones = this.stones.object3D.children;
    }
    const intersects = raycaster.intersectObjects( this.stones, false );

    if ( intersects.length > 0 ) {
      let object     = intersects[0].object;
      let instanceId = intersects[0].instanceId;
      this.el.emit('onObjectSelected', { object, instanceId });
    }    
  },  
  
  remove: function () {},
  pause: function () {},
  play: function () {}
});


