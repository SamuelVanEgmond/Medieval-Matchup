/* global MMU */

// The settings (current level and cleared stones)
// which are stored in local storage
class Settings {
  
  constructor() {
    this.load();
  }
  
  load() {
    this.settings = JSON.parse(localStorage.getItem("medievalmatchup"));
    //console.log('LOAD: ' + JSON.stringify(this.settings));
    if (!this.settings) {
      this.settings = { level:MMU.models.length, cleared:[] };
      this.store();
    }
  }
  
  store() {
    localStorage.setItem("medievalmatchup", JSON.stringify(this.settings));    
    //console.log('STORE: ' + JSON.stringify(this.settings));
  }
  
  nextLevel() {
    this.setLevel(this.settings.level+1);
  }
  
  setLevel(level) {
    this.settings.level = level;
    this.settings.cleared = [];
    this.store();
  }
  
  get level() {
    return this.settings.level;
  }
  
  isCleared(x,y,z) {
    // Round because matrix.decompose gives slightly different positions than went in on matrix.compose
    let xr = Math.round(x*10);
    let yr = Math.round(y*10);
    let zr = Math.round(z*10);
    return this.settings.cleared.find(s => s.x===xr && s.y===yr && s.z===zr) != null;
  }
  
  setCleared(x,y,z) {
    let xr = Math.round(x*10);
    let yr = Math.round(y*10);
    let zr = Math.round(z*10);
    this.settings.cleared.push( { x:xr, y:yr, z:zr } );
  }
}

MMU.settings = new Settings();

