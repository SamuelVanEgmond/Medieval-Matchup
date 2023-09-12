/* global AFRAME */
/* global THREE */
/* global MeshGenerator */
/* global MMU */

// One static voxel model
AFRAME.registerComponent("model", {
  schema: { 
    level:   { type:'string', default:'0' },
    yoffset: { type:'float', default:0 },
  },

  dependencies: [ ],

  init: function () {
    if (!this.init.meshes) {
      this.init.meshes = [];
    }
    
    if (!this.init.meshes[this.data.level]) {
      let level = MMU.models[this.data.level];   
      this.init.meshes[this.data.level] = MeshGenerator.generate(level.name, level.size, level.model, this.data.yoffset);
    }
    
    let mesh = this.init.meshes[this.data.level];
    mesh = new THREE.Mesh(mesh.geometry, mesh.material);
    this.el.setObject3D('mesh', mesh);
  }   
});