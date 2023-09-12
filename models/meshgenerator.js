/* global THREE */

// Vertex numbering per side. 
// The shared vertices for side nx (negative x) and pz (positive z) indicated as example:
//
//           --------
//           |1    2|
//           |  py  |
//           |0    3|
//    -----------------------------
//    |1   [2|1]   2|1    2|1    2|    nx shares vertext 2 & 3 
//    |  nx  |  pz  |  px  |  nz  |
//    |0   [3|0]   3|0    3|0    3|    with vertex 1 & 0 of pz
//    -----------------------------
//           |1    2|
//           |  ny  |
//           |0    3|
//           --------

// Generates a mesh for a voxel model
// Including a bit of randomization of colors and cheap ambient occlusion
class MeshGenerator {
  
  static generate(name, size, voxelString, yoffset) {
    voxelString = voxelString.replaceAll(/[\r\n\t ]/gm, '');
    //console.log(voxelString);

    //console.log(`Level ${name}: ${voxelString.replaceAll('-','').length}`);  

    let col;
    let i = 0;
    this.voxels = [];
    for (let z=0; z<size.z; z++) {
      let yArray = [];
      this.voxels.push(yArray);
      for (let y=0; y<size.y; y++) {
        let xArray = [];
        yArray.push(xArray);
        for (let x=0; x<size.x; x++) {
          let v = voxelString[i++];
          switch (v) {
            case 'R': xArray.push( { x, y, z, col:{ id:'R', r:1, g:0,   b:0 } } ); break;
            case 'G': xArray.push( { x, y, z, col:{ id:'G', r:0, g:1,   b:0 } } ); break;
            case 'B': xArray.push( { x, y, z, col:{ id:'B', r:0, g:0,   b:1   } } ); break;
            case 'Y': xArray.push( { x, y, z, col:{ id:'Y', r:1, g:0.7, b:0 } } ); break;
            default:  xArray.push( null ); break;
          }
        }
      }
    }

    let position = [];
    let color    = [];
    let normal   = [];
    let index    = [];
    i            = 0;

    const oX = -(size.x)/2;
    const oY = -(size.y)*yoffset;
    const oZ = -(size.z)/2;

    const normals = [-0.25,-0.25,0.75,  -0.25,0.25,0.75,  0.25,0.25,0.75,  0.25,-0.25,0.75];

    // I tried simplification (combining multiple consecutive faces of the same color together) that reduced the faces by (only) 60%.
    // but that made ambient occlusion look less nice, and fps are ok anyway (except on go) so I went for aestethics.

    // nx face
    for (let y=0; y<size.y; y++) {
      for (let x=0; x<size.x; x++) {
        for (let z=0; z<size.z; z++) {
          let voxel = this.voxels[z][y][x];
          if (voxel && !this.voxels[z]?.[y]?.[x-1]) {
            this._setPosition(position,
                              x+oX, y+oY,   z+oZ-1, 
                              x+oX, y+oY+1, z+oZ-1,
                              x+oX, y+oY+1, z+oZ,
                              x+oX, y+oY,   z+oZ);
            //normal.push(-1,0,0,  -1,0,0,  -1,0,0,  -1,0,0); 
            normal.push(-0.8,-0.4,-0.4,  -0.8,0.4,-0.4,  -0.8,0.4,0.4,  -0.8,-0.4,0.4); 
            this._setColors(color, voxel.col, x-1, y, z-1, x-1, y+1, z, x-1, y, z+1, x-1, y-1, z);
            index.push(i+1,i+0,i+2,  i+3, i+2, i+0);
            i += 4;   
          }
        }
      }
    }

    // px face
    for (let y=0; y<size.y; y++) {
      for (let x=0; x<size.x; x++) {
        for (let z=0; z<size.z; z++) {
          let voxel = this.voxels[z][y][x];
          if (voxel && !this.voxels[z]?.[y]?.[x+1]) {
            this._setPosition(position,
                              x+oX+1, y+oY,   z+oZ, 
                              x+oX+1, y+oY+1, z+oZ,
                              x+oX+1, y+oY+1, z+oZ-1,
                              x+oX+1, y+oY,   z+oZ-1);
            normal.push(0.8,-0.4,0.4,  0.8,0.4,0.4,  0.8,0.4,-0.4,  0.8,-0.4,-0.4); 
            this._setColors(color, voxel.col, x+1, y, z+1, x+1, y+1, z, x+1, y, z-1, x+1, y-1, z);
            index.push(i+1,i+0,i+2,  i+3, i+2, i+0);
            i += 4;        
          }
        }
      }
    }

    // ny face
    for (let y=0; y<size.y; y++) {
      for (let x=0; x<size.x; x++) {
        for (let z=0; z<size.z; z++) {
          let voxel = this.voxels[z][y][x];
          if (voxel && !this.voxels[z]?.[y-1]?.[x]) {
            this._setPosition(position,
                              x+oX,   y+oY, z+oZ-1, 
                              x+oX,   y+oY, z+oZ,
                              x+oX+1, y+oY, z+oZ,
                              x+oX+1, y+oY, z+oZ-1);
            normal.push(-0.4,-0.8,-0.4,  -0.4,-0.8,0.4,  0.4,-0.8,0.4,  0.4,-0.8,-0.4); 
            this._setColors(color, voxel.col, x-1, y-1, z, x, y-1, z+1, x+1, y-1, z, x, y-1, z-1);
            index.push(i+1,i+0,i+2,  i+3, i+2, i+0);
            i += 4;        
          }
        }
      }
    }


    // py face
    for (let y=0; y<size.y; y++) {
      for (let x=0; x<size.x; x++) {
        for (let z=0; z<size.z; z++) {
          let voxel = this.voxels[z][y][x];
          if (voxel && !this.voxels[z]?.[y+1]?.[x]) {
            this._setPosition(position,
                              x+oX,   y+oY+1, z+oZ, 
                              x+oX,   y+oY+1, z+oZ-1,
                              x+oX+1, y+oY+1, z+oZ-1,
                              x+oX+1, y+oY+1, z+oZ);
            normal.push(-0.4,0.8,0.4,  -0.4,0.8,-0.4,  0.4,0.8,-0.4,  0.4,0.8,0.4); 
            this._setColors(color, voxel.col, x-1, y+1, z, x, y+1, z-1, x+1, y+1, z, x, y+1, z+1);
            index.push(i+1,i+0,i+2,  i+3, i+2, i+0);
            i += 4; 
          }
        }
      }
    }

    // nz face
    for (let y=0; y<size.y; y++) {
      for (let z=0; z<size.z; z++) {
        for (let x=0; x<size.x; x++) {
          let voxel = this.voxels[z][y][x];
          if (voxel && !this.voxels[z-1]?.[y]?.[x]) {
            this._setPosition(position,
                              x+oX+1, y+oY,   z+oZ-1, 
                              x+oX+1, y+oY+1, z+oZ-1,
                              x+oX,   y+oY+1, z+oZ-1,
                              x+oX,   y+oY,   z+oZ-1);
            normal.push(0.4,-0.4,-0.8,  0.4,0.4,-0.8,  -0.4,0.4,-0.8,  -0.4,-0.4,-0.8); 
            this._setColors(color, voxel.col, x+1, y, z-1, x, y+1, z-1, x-1, y, z-1, x, y-1, z-1);
            index.push(i+1,i+0,i+2,  i+3, i+2, i+0);
            i += 4; 
          }
        }
      }
    }    

    // pz face
    for (let y=0; y<size.y; y++) {
      for (let z=0; z<size.z; z++) {
        for (let x=0; x<size.x; x++) {
          let voxel = this.voxels[z][y][x];
          if (voxel && !this.voxels[z+1]?.[y]?.[x]) {
            this._setPosition(position,
                              x+oX,   y+oY,   z+oZ, 
                              x+oX,   y+oY+1, z+oZ,
                              x+oX+1, y+oY+1, z+oZ,
                              x+oX+1, y+oY,   z+oZ);
            normal.push(-0.4,-0.4,0.8,  -0.4,0.4,0.8,  0.4,0.4,0.8,  0.4,-0.4,0.8); 
            this._setColors(color, voxel.col, x-1, y, z+1, x, y+1, z+1, x+1, y, z+1, x, y-1, z+1, x, y, z)
            index.push(i+1,i+0,i+2,  i+3, i+2, i+0);
            i += 4;
          }
        }
      }
    }  

    let SCALE = 0.25;
    for (let p = 0; p < position.length; p++) {
      position[p] *= SCALE;
    }

    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(position, 3) );
    geometry.setAttribute( 'normal'  , new THREE.Float32BufferAttribute(normal,   3) );
    geometry.setAttribute( 'color'   , new THREE.Float32BufferAttribute(color,    3) );
    //geometry.setAttribute( 'uv'      , new THREE.Float32BufferAttribute(uv,       2) );
    geometry.setIndex(index);
    geometry.uvsNeedUpdate = true;

    geometry.addGroup(0, i, 0);
    geometry.computeBoundingBox(); 

    return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      vertexColors: true
    }));
  }
  
  static _setPosition(position, v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z ) {
    position.push(v0x+0*Math.sin(v0y/3)*0.5, v0y, v0z+0*Math.cos(v0y/3)*0.5, 
                  v1x+0*Math.sin(v1y/3)*0.5, v1y, v1z+0*Math.cos(v1y/3)*0.5, 
                  v2x+0*Math.sin(v2y/3)*0.5, v2y, v2z+0*Math.cos(v2y/3)*0.5, 
                  v3x+0*Math.sin(v3y/3)*0.5, v3y, v3z+0*Math.cos(v3y/3)*0.5);
  }
  
  static _setColors(color, col, leftx, lefty, leftz, topx, topy, topz, rightx, righty, rightz, bottomx, bottomy, bottomz) {
    let c0 = 1;
    let c1 = 1;
    let c2 = 1;
    let c3 = 1;
    
    // Perform simple neighbor voxel Ambient Occlusion
    if (this.voxels[leftz  ]?.[lefty  ]?.[leftx  ]) { c0*=0.3; c1*=0.3 ; }
    if (this.voxels[topz   ]?.[topy   ]?.[topx   ]) { c1*=0.3; c2*=0.3 ; }
    if (this.voxels[rightz ]?.[righty ]?.[rightx ]) { c2*=0.3; c3*=0.3 ; }
    if (this.voxels[bottomz]?.[bottomy]?.[bottomx]) { c3*=0.3; c0*=0.3 ; }
    
    // Jitter the colors to get a bit of life in the larger areas    
    let gc = this._getCol;
    color.push(gc(col.r,c0), gc(col.g,c0), gc(col.b,c0),
               gc(col.r,c1), gc(col.g,c1), gc(col.b,c1),
               gc(col.r,c2), gc(col.g,c2), gc(col.b,c2),
               gc(col.r,c3), gc(col.g,c3), gc(col.b,c3),);    
  }
  
  static _getCol(col, factor, random) {
    return Math.max(0,Math.min(1,(col + Math.random()*0.4 - 0.2) * factor)); 
  }
   
};