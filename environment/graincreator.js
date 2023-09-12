// A simple class to create a noise image for use on the island
class GrainCreator {
  
  static create() {
    let canvas = document.createElement('canvas');
    canvas.width  = 256;
    canvas.height = 256;
    let ctx = canvas.getContext("2d");
    
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
      let r = 255 - Math.floor(Math.random()*64);
      data[i+0] = r;
      data[i+1] = r;
      data[i+2] = r;
      data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
  }
}  
  
