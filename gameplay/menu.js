/* global THREE */
/* global AFRAME */
/* global render */
/* global MMU */

// This component handles the menu
// The handling of the clicks should have been abstracted away (see clicker.js)
AFRAME.registerComponent("menu", {
  schema: {
  },
  init: function () {
    this.menuItemPlay    = render(this.el, 'a-entity', { model:`level:Play;`,
                                    position: { x:0, y:-0.1, z:-1.5 }, 
                                    animation__scale:`property: scale; from: 0 0 0; to: 0.2 0.2 0.2; dur: 1000; delay:0;easing:easeOutElastic;` 
                                  });
    this.menuItemReset   = render(this.el, 'a-entity', { model:`level:Reset;`,
                                    position: { x:0, y:-0.6, z:-1.5 }, 
                                    animation__scale:`property: scale; from: 0 0 0; to: 0.1 0.1 0.1; dur: 1000; delay:0;easing:easeOutElastic;` 
                                  });

    this.raycasterScreen = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    document.addEventListener('click', this._onClickScreen.bind(this) );
    document.getElementById('controllerLeft').addEventListener('triggerup', this._onClickLeft.bind(this));
    document.getElementById('controllerRight').addEventListener('triggerup', this._onClickRight.bind(this));
    document.getElementById('controllerGo').addEventListener('triggerup', this._onClickGo.bind(this));
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  
  pause: function () {
    this.el.setAttribute('visible','false');
    this.active = false;
  },
  
  play: function () {
    this.el.setAttribute('visible','true');
    this._setUpCamera();
    this.active = true;
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
    if (!this.active)
      return;
    
    if (!this.menuItemPlay.isMesh) {
      this.menuItemPlay = this.menuItemPlay.object3D.children[0]; 
      this.menuItemReset = this.menuItemReset.object3D.children[0]; 
    }

    const intersects = raycaster.intersectObjects( this.el.object3D.children, true );
    if ( intersects.length > 0 ) {
      let menuItem     = intersects[0].object;
      let instanceId = intersects[0].instanceId;
      this._onMenuItemSelected(menuItem);
    }    
  },
  
  _onMenuItemSelected(menuItem) {
    if (menuItem === this.menuItemPlay) {
      if (MMU.settings.level >= MMU.models.length) {
        MMU.settings.setLevel(0);
        document.getElementById("orchestrator").createModels();
      }
      this.el.pause();
      document.getElementById("level").play();
      // start the waves sound
      MMU.startWaves();
    }
    else if (menuItem === this.menuItemReset) {
      document.getElementById("orchestrator").reset();
    }
  },
  
  _setUpCamera() {
    let rigEl = document.getElementById("rig");
    let cameraEl = document.getElementById("camera");
    
    rigEl.object3D.position.set(-3, 2, 15);
    rigEl.object3D.rotation.y = 0.2;

    // Float the camera there to
    cameraEl.object3D.position.set(0, 1.6, 0);
    cameraEl.object3D.rotation.set(0, 0, 0); 
  }  
});
