/* global THREE */
/* global PatternCreator */

class StoneMaterial {
   
  static getMaterial(patternIndex) {

    if (!StoneMaterial.getMaterial.originalMaterial) {
      
      // Create all maps using the Pattern Creator
      this._createPatterns();      

      // Create the original material from which all others are cloned in getMaterial()
      this._createOriginalMaterial();
    }
    let originalMaterial = StoneMaterial.getMaterial.originalMaterial;
    
    let cellx = 0.125 * (patternIndex & 7);
    let celly = 0.125 * (Math.floor(patternIndex/8) % 8);
        
    let newMaterial = originalMaterial.clone();
    newMaterial.emissive = new THREE.Color(1, 1, 1),
    newMaterial.color    = new THREE.Color(1, 1, 1),    
      
    newMaterial.map = originalMaterial.map.clone();
    newMaterial.map.offset = new THREE.Vector2(cellx, celly);
    
    // The other maps seem to take over the map.offset, so no need to clone them
    //newMaterial.emissiveMap = originalMaterial.emissiveMap.clone();
    //newMaterial.emissiveMap.offset = new THREE.Vector2(cellx, celly);
    //
    //newMaterial.roughnessMap.offset = new THREE.Vector2(cellx, celly);
    //newMaterial.roughnessMap = originalMaterial.roughnessMap.clone();
    //
    //newMaterial.normalMap.offset = new THREE.Vector2(cellx, celly);
    //newMaterial.normalMap = originalMaterial.normalMap.clone();
    
    return newMaterial;
  }
  
  static _createOriginalMaterial() {
    
    StoneMaterial.getMaterial.originalMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 1,
      emissive: new THREE.Color(1, 1, 1),
      emissiveIntensity: 0.25,      
      map: StoneMaterial.stonePatterns,
      emissiveMap: StoneMaterial.stoneEmissive,
      roughnessMap: StoneMaterial.stoneRoughness,
      normalMap: StoneMaterial.stoneNormals
    });
  }
 
  static _createPatterns() {
    
    // Recreate the PatternCreator to create a separate canvas each
    let patternCreator = new PatternCreator();    
    patternCreator.create("rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)");
    patternCreator.createBorders(2, 3, "rgba(255, 255, 255, 1)");
    StoneMaterial.stonePatterns  = new THREE.CanvasTexture(patternCreator.getCanvas());
    StoneMaterial.stonePatterns.repeat.set(0.125, 0.125);
    
    patternCreator = new PatternCreator();    
    patternCreator.create("rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 1)");
    patternCreator.createBorders(2, 3, "rgba(128, 128, 128, 1)");
    StoneMaterial.stoneEmissive  = new THREE.CanvasTexture(patternCreator.getCanvas());
    StoneMaterial.stoneEmissive.repeat.set(0.125, 0.125);

    patternCreator = new PatternCreator();    
    patternCreator.create("rgba(0, 0, 0, 1)", "rgba(128, 128, 128, 1)");
    StoneMaterial.stoneRoughness = new THREE.CanvasTexture(patternCreator.getCanvas());
    StoneMaterial.stoneRoughness.repeat.set(0.125, 0.125);
       
    patternCreator = new PatternCreator();    
    patternCreator.create("rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)");
    patternCreator.createNormalMap(3, 0, -1);
    StoneMaterial.stoneNormals   = new THREE.CanvasTexture(patternCreator.getCanvas());
    StoneMaterial.stoneNormals.repeat.set(0.125, 0.125);
  }  
  
  _loadTexture(url) {
    const texture = new THREE.Texture()
    const loader = new THREE.ImageLoader()
    loader.load(url, (image) => {
        texture.source = new THREE.Source(image)
    })
    return texture
  }    

}