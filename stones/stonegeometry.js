/* global THREE */

class StoneGeometry {
  
  // Manually created rounded cube
  static create() {
/*
    // Define all vertices to use in the rouded cube
    const ROUNDING = 0.1;
    let nx =   { 
      n:{ x:-1, y: 0, z: 0 }, 
      v0:{ x:-0.5, y:-0.5+ROUNDING, z:-0.5+ROUNDING, i: 0 },
      v1:{ x:-0.5, y: 0.5-ROUNDING, z:-0.5+ROUNDING, i: 2 },
      v2:{ x:-0.5, y: 0.5-ROUNDING, z: 0.5-ROUNDING, i: 4 },
      v3:{ x:-0.5, y:-0.5+ROUNDING, z: 0.5-ROUNDING, i: 6 }
    }
    let px =   { 
      n:{ x: 1, y: 0, z: 0 }, 
      v0:{ x: 0.5, y:-0.5+ROUNDING, z: 0.5-ROUNDING, i: 8 },
      v1:{ x: 0.5, y: 0.5-ROUNDING, z: 0.5-ROUNDING, i:10 },
      v2:{ x: 0.5, y: 0.5-ROUNDING, z:-0.5+ROUNDING, i:12 },
      v3:{ x: 0.5, y:-0.5+ROUNDING, z:-0.5+ROUNDING, i:14 }
    }
    let ny =   { 
      n:{ x: 0, y:-1, z: 0 }, 
      v0:{ x:-0.5+ROUNDING, y:-0.5, z:-0.5+ROUNDING, i:16 },
      v1:{ x:-0.5+ROUNDING, y:-0.5, z: 0.5-ROUNDING, i:18 },
      v2:{ x: 0.5-ROUNDING, y:-0.5, z: 0.5-ROUNDING, i:20 },
      v3:{ x: 0.5-ROUNDING, y:-0.5, z:-0.5+ROUNDING, i:22 }
    }
    let py =   { 
      n:{ x: 0, y: 1, z: 0 }, 
      v0:{ x:-0.5+ROUNDING, y: 0.5, z: 0.5-ROUNDING, i:24 },
      v1:{ x:-0.5+ROUNDING, y: 0.5, z:-0.5+ROUNDING, i:26 },
      v2:{ x: 0.5-ROUNDING, y: 0.5, z:-0.5+ROUNDING, i:28 },
      v3:{ x: 0.5-ROUNDING, y: 0.5, z: 0.5-ROUNDING, i:30 }
    }
    let nz =   { 
      n:{ x: 0, y: 0, z: -1 }, 
      v0:{ x: 0.5-ROUNDING, y:-0.5+ROUNDING, z:-0.5, i:32 },
      v1:{ x: 0.5-ROUNDING, y: 0.5-ROUNDING, z:-0.5, i:34 },
      v2:{ x:-0.5+ROUNDING, y: 0.5-ROUNDING, z:-0.5, i:36 },
      v3:{ x:-0.5+ROUNDING, y:-0.5+ROUNDING, z:-0.5, i:38 }
    }
    let pz =   { 
      n:{ x: 0, y: 0, z:  1 }, 
      v0:{ x:-0.5+ROUNDING, y:-0.5+ROUNDING, z: 0.5, i:40 },
      v1:{ x:-0.5+ROUNDING, y: 0.5-ROUNDING, z: 0.5, i:42 },
      v2:{ x: 0.5-ROUNDING, y: 0.5-ROUNDING, z: 0.5, i:44 },
      v3:{ x: 0.5-ROUNDING, y:-0.5+ROUNDING, z: 0.5, i:46 }
    }
    
    // Define the uv's for the faces
    let uv0 = { u:0, v:0 };
    let uv1 = { u:0, v:1 };
    let uv2 = { u:1, v:1 };
    let uv3 = { u:1, v:0 };

    // Create all vertices twice, once with map, once without
    let position = [
      nx.v0, nx.v0, nx.v1, nx.v1, nx.v2, nx.v2, nx.v3, nx.v3, 
      px.v0, px.v0, px.v1, px.v1, px.v2, px.v2, px.v3, px.v3, 
      ny.v0, ny.v0, ny.v1, ny.v1, ny.v2, ny.v2, ny.v3, ny.v3, 
      py.v0, py.v0, py.v1, py.v1, py.v2, py.v2, py.v3, py.v3,
      nz.v0, nz.v0, nz.v1, nz.v1, nz.v2, nz.v2, nz.v3, nz.v3, 
      pz.v0, pz.v0, pz.v1, pz.v1, pz.v2, pz.v2, pz.v3, pz.v3
    ].flatMap(v => [v.x, v.y, v.z]);

    // Create the normals
    let normal = [
      nx.n, nx.n, nx.n, nx.n, nx.n, nx.n, nx.n, nx.n, 
      px.n, px.n, px.n, px.n, px.n, px.n, px.n, px.n, 
      ny.n, ny.n, ny.n, ny.n, ny.n, ny.n, ny.n, ny.n, 
      py.n, py.n, py.n, py.n, py.n, py.n, py.n, py.n,
      nz.n, nz.n, nz.n, nz.n, nz.n, nz.n, nz.n, nz.n, 
      pz.n, pz.n, pz.n, pz.n, pz.n, pz.n, pz.n, pz.n
    ].flatMap(v => [v.x, v.y, v.z]);

    const NOMAP = { u:0.0001, v:0.0001 }

    let uv = [
      uv0, NOMAP, uv1, NOMAP, uv2, NOMAP, uv3, NOMAP,
      uv0, NOMAP, uv1, NOMAP, uv2, NOMAP, uv3, NOMAP,
      uv0, NOMAP, uv1, NOMAP, uv2, NOMAP, uv3, NOMAP,
      uv0, NOMAP, uv1, NOMAP, uv2, NOMAP, uv3, NOMAP,
      uv0, NOMAP, uv1, NOMAP, uv2, NOMAP, uv3, NOMAP,
      uv0, NOMAP, uv1, NOMAP, uv2, NOMAP, uv3, NOMAP
    ].flatMap(v => [v.u, v.v]);

    let index = [
      // The six faces
      nx.v1.i, nx.v0.i, nx.v2.i,
      nx.v3.i, nx.v2.i, nx.v0.i,
      px.v1.i, px.v0.i, px.v2.i,
      px.v3.i, px.v2.i, px.v0.i,
      ny.v1.i, ny.v0.i, ny.v2.i,
      ny.v3.i, ny.v2.i, ny.v0.i,
      py.v1.i, py.v0.i, py.v2.i,
      py.v3.i, py.v2.i, py.v0.i,
      nz.v1.i, nz.v0.i, nz.v2.i,
      nz.v3.i, nz.v2.i, nz.v0.i,
      pz.v1.i, pz.v0.i, pz.v2.i,
      pz.v3.i, pz.v2.i, pz.v0.i,
      
      // Four rounded edges at the top
      py.v0.i+1, pz.v1.i+1, py.v3.i+1, 
      pz.v2.i+1, py.v3.i+1, pz.v1.i+1,
      py.v3.i+1, px.v1.i+1, py.v2.i+1, 
      px.v2.i+1, py.v2.i+1, px.v1.i+1,
      py.v2.i+1, nz.v1.i+1, py.v1.i+1, 
      nz.v2.i+1, py.v1.i+1, nz.v1.i+1,
      py.v1.i+1, nx.v1.i+1, py.v0.i+1, 
      nx.v2.i+1, py.v0.i+1, nx.v1.i+1,

      // Four rounded corners at the top
      py.v0.i+1, nx.v2.i+1, pz.v1.i+1, 
      py.v3.i+1, pz.v2.i+1, px.v1.i+1, 
      py.v2.i+1, px.v2.i+1, nz.v1.i+1, 
      py.v1.i+1, nz.v2.i+1, nx.v1.i+1, 

      // Four rounded edges at the sides
      nx.v3.i+1, pz.v0.i+1, nx.v2.i+1, 
      pz.v1.i+1, nx.v2.i+1, pz.v0.i+1,
      pz.v3.i+1, px.v0.i+1, pz.v2.i+1, 
      px.v1.i+1, pz.v2.i+1, px.v0.i+1,
      px.v3.i+1, nz.v0.i+1, px.v2.i+1, 
      nz.v1.i+1, px.v2.i+1, nz.v0.i+1,
      nz.v3.i+1, nx.v0.i+1, nz.v2.i+1, 
      nx.v1.i+1, nz.v2.i+1, nx.v0.i+1,

      // Four rounded corners at the bottom
      ny.v1.i+1, pz.v0.i+1, nx.v3.i+1, 
      ny.v2.i+1, px.v0.i+1, pz.v3.i+1, 
      ny.v3.i+1, nz.v0.i+1, px.v3.i+1, 
      ny.v0.i+1, nx.v0.i+1, nz.v3.i+1, 

      // Four rounded edges at the bottom
      pz.v0.i+1, ny.v1.i+1, pz.v3.i+1, 
      ny.v2.i+1, pz.v3.i+1, ny.v1.i+1,
      px.v0.i+1, ny.v2.i+1, px.v3.i+1, 
      ny.v3.i+1, px.v3.i+1, ny.v2.i+1,
      nz.v0.i+1, ny.v3.i+1, nz.v3.i+1,
      ny.v0.i+1, nz.v3.i+1, ny.v3.i+1,
      nx.v0.i+1, ny.v0.i+1, nx.v3.i+1, 
      ny.v1.i+1, nx.v3.i+1, ny.v0.i+1,
      
    ];
*/
    // Run from console for each (position, normal and uv) to get these shorthand versions below
    // '['+position.toString().replaceAll('0.','.')+']'
    let position = [-.5,-.4,-.4,-.5,-.4,-.4,-.5,.4,-.4,-.5,.4,-.4,-.5,.4,.4,-.5,.4,.4,-.5,-.4,.4,-.5,-.4,.4,.5,-.4,.4,.5,-.4,.4,.5,.4,.4,.5,.4,.4,.5,.4,-.4,.5,.4,-.4,.5,-.4,-.4,.5,-.4,-.4,-.4,-.5,-.4,-.4,-.5,-.4,-.4,-.5,.4,-.4,-.5,.4,.4,-.5,.4,.4,-.5,.4,.4,-.5,-.4,.4,-.5,-.4,-.4,.5,.4,-.4,.5,.4,-.4,.5,-.4,-.4,.5,-.4,.4,.5,-.4,.4,.5,-.4,.4,.5,.4,.4,.5,.4,.4,-.4,-.5,.4,-.4,-.5,.4,.4,-.5,.4,.4,-.5,-.4,.4,-.5,-.4,.4,-.5,-.4,-.4,-.5,-.4,-.4,-.5,-.4,-.4,.5,-.4,-.4,.5,-.4,.4,.5,-.4,.4,.5,.4,.4,.5,.4,.4,.5,.4,-.4,.5,.4,-.4,.5];
    let normal   = [-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1];
    let uv       = [0,0,.0001,.0001,0,1,.0001,.0001,1,1,.0001,.0001,1,0,.0001,.0001,0,0,.0001,.0001,0,1,.0001,.0001,1,1,.0001,.0001,1,0,.0001,.0001,0,0,.0001,.0001,0,1,.0001,.0001,1,1,.0001,.0001,1,0,.0001,.0001,0,0,.0001,.0001,0,1,.0001,.0001,1,1,.0001,.0001,1,0,.0001,.0001,0,0,.0001,.0001,0,1,.0001,.0001,1,1,.0001,.0001,1,0,.0001,.0001,0,0,.0001,.0001,0,1,.0001,.0001,1,1,.0001,.0001,1,0,.0001,.0001];
    let index    = [2,0,4,6,4,0,10,8,12,14,12,8,18,16,20,22,20,16,26,24,28,30,28,24,34,32,36,38,36,32,42,40,44,46,44,40,25,43,31,45,31,43,31,11,29,13,29,11,29,35,27,37,27,35,27,3,25,5,25,3,25,5,43,31,45,11,29,13,35,27,37,3,7,41,5,43,5,41,47,9,45,11,45,9,15,33,13,35,13,33,39,1,37,3,37,1,19,41,7,21,9,47,23,33,15,17,1,39,41,19,47,21,47,19,9,21,15,23,15,21,33,23,39,17,39,23,1,17,7,19,7,17];
    
    // Set the geometry attribute buffers
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(position, 3) );
    geometry.setAttribute( 'normal'  , new THREE.Float32BufferAttribute(normal,   3) );
    geometry.setAttribute( 'uv'      , new THREE.Float32BufferAttribute(uv,       2) );
    geometry.setIndex(index);
    geometry.uvsNeedUpdate = true;

    // Add the groups for each material
    geometry.addGroup(0, 132, 0);
    
    // No need for a bounding box since we are explicitly setting frustumCulled = false in the instance mesh
    //geometry.computeBoundingBox();

    return geometry;
  } 
}