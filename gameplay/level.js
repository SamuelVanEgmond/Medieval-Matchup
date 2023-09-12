/* global AFRAME */
/* global THREE */
/* global PatternCreator */
/* global StoneGeometry */
/* global StoneMaterial */
/* global MMU */

// This component generates the stones in the level and handles the gameplay
// To keep the framerate up, the stones are instanced meshes for each of the 64 patterns, so there are always at most 64 draw calls
AFRAME.registerComponent("level", {
  schema: { },

  dependencies: [ ],
  
  maxCount: 100,

  init: function () {
    this._createInstancedMeshes();
    this.scale = 0.25;
    
    // Handle the event emitted by the mousepointer component
    this.el.addEventListener( 'onObjectSelected', this._onStoneSelected.bind(this) );
  },
  
  play: function () {
    this._setup();  
  },
  
  pause: function () {
    this._destroy();
  },
  
  _createInstancedMeshes: function() {
    let root = this.el.object3D;
    let dummyColor = new THREE.Color();
    let geometry = StoneGeometry.create();
    let meshes = [];
    
    for (let patternIndex = 0; patternIndex < 64; patternIndex++) {
      
      // Create a new material with the correct texture offsets and color
      let material = StoneMaterial.getMaterial(patternIndex);
      
      let iMesh = new THREE.InstancedMesh(geometry, material, this.maxCount);
      iMesh.count = 0;
      iMesh.frustumCulled = false;
      iMesh.userData.patternIndex = patternIndex;
      
      // The instanceColor is not automatically created like instanceMatrix, so ensure that it is created
      iMesh.setColorAt(0, dummyColor);
      
      root.add(iMesh);
      meshes.push(iMesh);
    }
    
    this.meshes = meshes;
  },  

  _setUpLevelAndCamera() {
    let pos = this.level.pos[0];
    let rigEl = document.getElementById("rig");
    let cameraEl = document.getElementById("camera");
    let levelRigEl = document.getElementById("levelrig");
    
    // Float the level above the location where the level will be on the island
    let height = pos.y + this.level.size.y/2*this.scale + 2;
    let angle = Math.atan2(pos.x, pos.z);
    levelRigEl.object3D.position.set(pos.x, height, pos.z);
    levelRigEl.object3D.rotation.y = angle;

    // Float the camera there to
    cameraEl.object3D.position.set(0, 1.6, 0);
    cameraEl.object3D.rotation.set(0, 0, 0); 
    let distance = Math.sqrt(pos.x*pos.x + pos.z*pos.z) + Math.max(this.level.size.x, Math.max(this.level.size.y, this.level.size.z))/2*this.scale+2;
    rigEl.object3D.position.set(Math.sin(angle)*distance, height - 1.6, Math.cos(angle)*distance);
    rigEl.object3D.rotation.y = angle;
    
    // Show the level slightly rotated to prevent the ugly 'full frontal' look
    this.el.object3D.rotation.set(0.3,-0.3,0);
  },
  
  _createLevel() {
    this.stonesLeft = 0;
    
    for (let m = 0; m < this.meshes.length; m++) {
      this.meshes[m].count = 0;
    }
    
    let level = this.level;   
    
    level.model = level.model.replaceAll(/[\r\n\t ]/gm, '');
    
    let i = 0;
    let col;
    let stones = { r:[], g:[], b:[], y:[] };
    for (let z=0; z<level.size.z; z++) {
      for (let y=0; y<level.size.y; y++) {
        for (let x=0; x<level.size.x; x++) {
          let v = level.model[i++];
          switch (v) {
            case 'R': stones.r.push( { x, y, z, col:'#F22', r:Math.random() } ); break;
            case 'G': stones.g.push( { x, y, z, col:'#2F2', r:Math.random() } ); break;
            case 'B': stones.b.push( { x, y, z, col:'#22F', r:Math.random() } ); break;
            case 'Y': stones.y.push( { x, y, z, col:'#FC2', r:Math.random() } ); break;
            default: break;
          }
        }
      }
    }
  
    //console.log(`Stones: ${stones.r.length+stones.g.length+stones.b.length+stones.y.length}`);
    
    // Create the stones for each color randomizing the order in which they are created
    this._createStones('R', stones.r.sort(this._sort), level);
    this._createStones('G', stones.g.sort(this._sort), level);
    this._createStones('B', stones.b.sort(this._sort), level);
    this._createStones('Y', stones.y.sort(this._sort), level);     
  },
  
  _sort(a, b) { return a.r - b.r },

  _createStones(voxelId, stones, level) {
    //console.log(`${voxelId}: ${stones.length}`);
    
    // Randomize the indices
    let indices = Array.from(Array(64), (_,i) => ({ i, r:Math.random() })).sort(this._sort);
    let i = 0;
    let c = 0
    for (let s=0; s<stones.length; s++) {      
      let stone = stones[s];
      
      let x = (stone.x-(level.size.x-1)/2)*this.scale
      let y = (stone.y-(level.size.y-1)/2)*this.scale
      let z = (stone.z-(level.size.z-1)/2)*this.scale
            
      if (!MMU.settings.isCleared(x, y, z)) {
        let patternIndex = indices[i].i;
        if (c%2) { 
          i = (i+1)%64; 
        }
        c++;
        this._createStone(x, y, z, patternIndex, new THREE.Color(stone.col)); 
        this.stonesLeft++;
      }
    }
  },
  
  _createStone: function(x, y, z, patternIndex, color) {
    let iMesh = this.meshes[patternIndex];

    let i = iMesh.count;
    if (i === this.maxCount)
      throw(`MaxCount reached on patternIndex ${patternIndex}`);
    
    iMesh.count += 1;
    
    let position = new THREE.Vector3(x, y, z)
    let scale = new THREE.Vector3(this.scale, this.scale, this.scale);

    let angle = 0;
    let euler = new THREE.Euler(0, 0, 0, "ZYX");
    let quat = new THREE.Quaternion();
    euler.set(0, angle, 0)
    quat.setFromEuler(euler);

    let mtx = new THREE.Matrix4();
    mtx.compose(position, quat, scale);

    iMesh.setMatrixAt(i, mtx)
    iMesh.instanceMatrix.needsUpdate = true;
    iMesh.setColorAt(i, color); 
    iMesh.instanceColor.needsUpdate = true;    
  },
  
  _onStoneSelected: function(event) {
    let object     = event.detail.object;
    let instanceId = event.detail.instanceId;
    let color = new THREE.Color();
    color.fromArray(object.instanceColor.array, instanceId*3);
    
    let stoneCount = 0;
    for (let i = 0; i<object.count; i++) {
      if (object.instanceMatrix.array[i*16] !== 0 &&
          color.r === object.instanceColor.array[i*3+0] &&
          color.g === object.instanceColor.array[i*3+1] &&
          color.b === object.instanceColor.array[i*3+2]) {
        stoneCount++;
      }
    }
    
    // Decompose the instance matrix so whe get the original info back
    let instanceMatrix = new THREE.Matrix4();
    object.getMatrixAt(instanceId, instanceMatrix);
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    instanceMatrix.decompose(position, quaternion, scale);
    
    let selection = { object, instanceId, position, color, instanceMatrix, position, quaternion, scale };
    if (!this.lastSelection && stoneCount === 1) {
      // A single stone (no match exists) selected
      instanceMatrix.multiplyScalar(0);
      object.setMatrixAt(selection.instanceId, instanceMatrix);
      object.instanceMatrix.needsUpdate = true;
      
      MMU.settings.setCleared(position.x, position.y, position.z);
      MMU.settings.store();    
      
      this._ding("sine", 1300, 1);  
      this.stonesLeft--;
    }
    else if (!this.lastSelection) {
      // First stone selected
      selection.scale.set(this.scale*1.2, this.scale*1.2, this.scale*1.2);
      selection.instanceMatrix.compose(selection.position, selection.quaternion, selection.scale)
      object.setMatrixAt(selection.instanceId, selection.instanceMatrix);
      object.instanceMatrix.needsUpdate = true;
      
      this.lastSelection = selection;
      this._ding("sine", 25, 1);  
    }
    else if (this.lastSelection.object.uuid !== selection.object.uuid || this.lastSelection.instanceId === selection.instanceId || 
             this.lastSelection.color.r !== selection.color.r || this.lastSelection.color.g !== selection.color.g || this.lastSelection.color.b !== selection.color.b) {
      // It's not a match...
      this.lastSelection.scale.set(this.scale, this.scale, this.scale);
      this.lastSelection.instanceMatrix.compose(this.lastSelection.position, this.lastSelection.quaternion, this.lastSelection.scale);
      this.lastSelection.object.setMatrixAt(this.lastSelection.instanceId, this.lastSelection.instanceMatrix);
      this.lastSelection.object.instanceMatrix.needsUpdate = true;
      
      this.lastSelection = null;
      this._ding("triangle", 25, 2);  
    }
    else {
      // It's a match!
      instanceMatrix.multiplyScalar(0);
      object.setMatrixAt(this.lastSelection.instanceId, instanceMatrix);
      object.setMatrixAt(selection.instanceId, instanceMatrix);
      object.instanceMatrix.needsUpdate = true;

      MMU.settings.setCleared(this.lastSelection.position.x, this.lastSelection.position.y, this.lastSelection.position.z);
      MMU.settings.setCleared(position.x, position.y, position.z);
      MMU.settings.store();
      
      this.lastSelection = null;
      this._ding("sine", 1300, 1);  
      this.stonesLeft-=2;
    }
    
    //console.log(`Stones left: ${this.stonesLeft}`);
    if (this.stonesLeft === 0) {
      MMU.settings.nextLevel();
      document.getElementById("orchestrator").createModels();
      if (MMU.settings.level === MMU.models.length) {
        this._victory();
      }
      setTimeout(() => {
        if (MMU.settings.level < MMU.models.length) {
          document.getElementById("orchestrator").createModels();
          this._setup();
        }
        else {
          this.el.pause();
          document.getElementById("menu").play();
          document.getElementById("orchestrator").reset();
        }        
      }, 5000);      
    }
    
    //console.log(`Pattern:${object.userData.patternIndex} Instance:${instanceId}  Position:${position.x.toFixed(2)},${position.y.toFixed(2)},${position.z.toFixed(2)} Color:${color.r},${color.g},${color.b}`);    
  },
  
  _setup: function () {
    MMU.settings.load();
    this.level = MMU.models[MMU.settings.level];
    if (!this.level) {
      // At the start of the game we are at levels + 1 so no level available
      // The level is set to 0 by the Play menu item
      return;
    }

    // this.level = {pos:this.level.pos, size:this.level.size, model:"BBBGGGRRR"+"-".repeat(this.level.size.x*this.level.size.y*this.level.size.z-9) };  // DEBUG the game with tinly levels
    
    this._createLevel();
    this._setUpLevelAndCamera();    
  },
  
  _destroy() {
    for (let m = 0; m < this.meshes.length; m++) {
      this.meshes[m].count = 0;
    }    
  },
   
  // Make a sound on click / match of stones
  _ding: function(type, frequency, speed) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    let oscillator = this.audioContext.createOscillator();
    let gainNode = this.audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    oscillator.type = type;
    gainNode.connect(this.audioContext.destination);
    oscillator.start(0);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + speed);
  },
  
  _victory: function(count = 0) {
    if (count++<6) {
      setTimeout(() => {
        this._ding("sine", 100+count*count*10,3);
        this._victory(count);
      },500);
    }
  }
  
});