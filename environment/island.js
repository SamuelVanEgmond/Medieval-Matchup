/* global THREE */
/* global AFRAME */
/* global GrainCreator */

AFRAME.registerComponent("island", {
    schema: {
        size: { default: 25 },
        height: { default: 10 },
        color: { type: 'color', default: '#080' }
    },

    init: function (data) {
      // The height of an equilateral triangle with sides of length 1.
      var zsize = 1; // Should be Math.sqrt(3.0) / 2.0, but you can't tell the difference

      // Generate all vertices horizonally from far (-z) to near (+z)
      // Vertices and faces for size = 2
      //     0 ----- 1 ----- 2
      //   / 1 \ 2 / 3 \ 4 /
      //  3 ---- 4 ----- 5
      //   \ 5 / 6 \ 7 / 8 \
      //     7 ----- 8 ----- 9

      let position = [];
      let uv = [];      
      let color = [];
      let size = this.data.size;
      let height = this.data.height;
      let offsetz = -size / 2.0;
      let grainSize = 10;
      
      // Generate all vertices with uv coordinates
      for (let z = 0; z <= size; z++) {
        let offsetx = -size / 2.0 + 0.25 - ((z % 2 === 1) ? 0.5 : 0);
        for (let x = 0; x <= size; x++) {
          let y = this.getHeight((x + offsetx) / size, ((z + offsetz) * zsize) / size) * height;
          position.push(x + offsetx, y, (z + offsetz) * zsize);
          uv.push((x + offsetx)/grainSize, ((z + offsetz) * zsize)/grainSize);

          if (y>1.75) {
            // Rock
            let r = Math.random()*0.1+0.1;
            color.push(Math.random()*0.1, Math.random()*0.1+0.1, 0);
          }
          else if (y>0.75) {
            // Grass
            color.push(Math.random()*0.1, Math.random()*0.3+0.2, 0);
          }
          else {
            // Beach
            color.push(Math.random()*0.1+0.4, Math.random()*0.1+0.4, 0);
          }
        }
      }

      // Generate all faces
      let index = [];
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          let row0 = (z + 0) * (size + 1);
          let row1 = (z + 1) * (size + 1);

          if ((z % 2) === 0) {
            // Face 1
            index.push(row1 + x + 1, row0 + x, row1 + x);

            // Face 2
            index.push(row0 + x, row1 + x + 1, row0 + x + 1);
          }
          else {
            // Face 1
            index.push(row0 + x, row1 + x, row0 + x + 1);

            // Face 2
            index.push(row1 + x + 1, row0 + x + 1, row1 + x);
          }
        }
      }

      let geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(position, 3) );
      geometry.setAttribute( 'color'   , new THREE.Float32BufferAttribute(color,    3) );
      geometry.setAttribute( 'uv'      , new THREE.Float32BufferAttribute(uv,       2) );
      geometry.uvsNeedUpdate = true;
      geometry.setIndex(index);
      geometry.addGroup(0, index.length, 0);
      geometry.computeVertexNormals();
      geometry.computeBoundingBox(); 

      let material = new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
        side: THREE.FrontSide,
        fog: true,
        vertexColors: true,
        color: new THREE.Color(1, 1, 1),
        wireframe: false,
        map: new THREE.CanvasTexture(GrainCreator.create(), THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping)
      });
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.el.setObject3D('mesh', this.mesh);
    },

    getHeight: function (x, z) {
        // x & z are between -0.5 and 0.5
        let dist = Math.sqrt(x*x + z*z);
        return (0.5-Math.min(0.5, dist))*(1+(Math.sin(x*12+4))*(Math.sin(z*12+4))/2)/1.5;
    }
});
