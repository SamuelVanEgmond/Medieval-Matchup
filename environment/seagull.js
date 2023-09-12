/* global AFRAME */
/* global THREE */

/* 
The seagull is actually made with voxels and was exported as javascript from the Smooth Voxels playground (developed by me)
https://svox.glitch.me/playground.html
I manually removed all digits that were not relevant from the javascript position, normal and color below, to reduce the size.
   
This is the original model used (copy in the playground to see it there):   
model
size = 9 2 5
scale = 1
shape = box
resize = fit
origin = -y
wireframe = false
clamp = none
position = 0.5 0 0.5

material lighting = smooth, deform = 2, side = double
  colors = A:#FFF

material lighting = smooth, deform = 3 0.8, side = double
  colors =  D:#F84

material lighting = flat, deform = 1, hide = +y x z, side = double, fade = true
  colors = B:#FFF E:#000

material lighting = flat, deform = 1, skip = -y x z, side = double,
  colors = C:#FFF

material lighting = flat, hide = x y z
  colors = X:#F0F

voxels
---CCC--- ---------
----C---- X-------X
----A---- -EBBBBBE-
----A---- ---------
----D---- ---------
*/

AFRAME.registerComponent("seagull", {
  schema: {  },
  init: function () {
    if (!this.init.mesh) {
      // Cache the mesh for reuse
      this.init.mesh = this._createMesh();
      this.mesh = this.init.mesh;
    }
    else {
      // If this component is used multiple times, reuse the mesh
      this.mesh = new THREE.Mesh(this.init.mesh.geometry, this.init.mesh.material);
    }
    this.el.setObject3D('mesh', this.mesh);
  },

  _createMesh: function() {
    let material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      vertexColors: true
    });

    let geometry = new THREE.BufferGeometry();

    // Set the geometry attribute buffers
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [-100,100,-200,-50,100,-150,-50,100,-217,50,100,-217,-50,100,-50,50,100,-50,100,100,-200,50,100,-150,-50,100,50,-50,100,-50,-19,53,-6,-17,46,58,50,100,50,17,46,58,19,53,-6,50,100,-50,-350,100,-50,-250,125,-25,-250,125,25,-250,125,25,-317,133,17,-350,100,-50,-250,125,-25,-150,125,-25,-150,125,25,-250,125,25,-150,125,-25,-50,100,-50,-50,100,50,-150,125,25,150,125,25,50,100,50,50,100,-50,150,125,-25,250,125,25,150,125,25,150,125,-25,250,125,-25,317,133,17,250,125,25,250,125,-25,250,125,-25,350,100,-50,317,133,17,-18,68,143,-12,38,143,18,68,143,12,38,143,-7,57,188,-18,68,143,-12,38,143,-5,45,188,7,57,188,5,45,188,12,38,143,18,68,143].map(v=>v*.01), 3) );
    geometry.setAttribute( 'normal',   new THREE.Float32BufferAttribute( [ 0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,-.5,.3,.7,-.4,.3,-.9,-.3,-.8,-.4,-.6,-.8,-.1,.5,.4,.8,.6,-.8,0,.5,-.8,-.3,.3,.5,-.8,0,-1,.2,0,-1,.2,0,-1,.2,0,-.9,.3,0,-.9,.3,0,-.9,.3,0,-1,0,0,-1,0,0,-1,0,0,-1,0,-.2,-1,0,-.2,-1,0,-.2,-1,0,-.2,-1,0,.2,-1,0,.2,-1,0,.2,-1,0,.2,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,.2,0,-1,.2,0,-1,.2,0,-.9,.3,0,-.9,.3,0,-.9,.3,-.8,.4,.4,-.7,-.8,.1,.5,.8,.4,.7,-.7,0,-.8,.4,.4,-.8,.4,.4,-.7,-.8,.1,-.5,-.8,.3,.4,.8,.4,.8,-.5,.3,.7,-.7,0,.5,.8,.4 ], 3) );
    geometry.setAttribute( 'color',    new THREE.Float32BufferAttribute( [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,.5,.5,.5,.5,.5,.5,.5,.5,.5,0,0,0,0,0,0,.5,.5,.5,1,1,1,1,1,1,.5,.5,.5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.5,.5,.5,1,1,1,1,1,1,.5,.5,.5,0,0,0,.5,.5,.5,.5,.5,.5,.5,.5,.5,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,.2,.1,1,.2,.1,1,.2,.1,1,.2,.1,1,.2,.1,1,.2,.1,1,.2,.1,1,.2,.1 ], 3) );
    geometry.setIndex( [ 0,0,1,1,2,0,3,2,4,4,5,3,6,3,7,7,6,6,8,9,10,10,11,8,12,13,14,14,15,12,13,11,10,10,14,13,15,9,8,8,12,15,9,15,14,14,10,9,16,17,18,19,20,21,22,23,24,24,25,22,26,27,28,28,29,26,30,31,32,32,33,30,34,35,36,36,37,34,38,39,40,41,42,43,44,8,11,11,45,44,46,47,13,13,12,46,47,45,11,11,13,47,46,12,8,8,44,46,48,49,50,50,51,48,52,53,54,54,55,52,53,51,50,50,54,53,52,55,49,49,48,52,53,52,48,48,51,53 ] );

    // Add the groups for each material
    geometry.addGroup(0, 138, 0);

    geometry.computeBoundingBox();

    return new THREE.Mesh(geometry, material);
  }

});
