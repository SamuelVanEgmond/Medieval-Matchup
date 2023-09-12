// This class creates all the patterns in different colors for different textures incl. normals.
class PatternCreator {
  
  constructor(canvas) {
    if (!canvas) {
      canvas = document.createElement('canvas');
        canvas.width  = 1024
      canvas.height = canvas.width;
    } 
    
    this.canvas = canvas;

    this.size = canvas.width/8;
    this.border = this.size/8;
    
    this.BACKGROUND  = "rgba(0, 255, 0, 0.5)";
  }
  
  create(pattern, empty) {
    this.PATTERN  = pattern  ?? "rgba(  0,   0,   0, 1)";
    this.EMPTY    = empty    ?? "rgba(255, 255, 255, 1)";    

    
    let ctx = { c:this.canvas.getContext("2d"), x:0, y:0 };
    
    ctx.c.fillStyle = this.EMPTY;
    ctx.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.bigSquares(ctx);
    this.bigCircles(ctx);
    this.cornerCircles1to3(ctx);
    this.cornerCircles4(ctx);
    this.cornerSquares1to3(ctx);
    this.cornerSquares4(ctx);
    this.sideCircles1to3(ctx);
    this.sideCircles4(ctx);
    this.triangleCorners1to3(ctx);
    this.triangleCorners4(ctx);
    this.diceCircles(ctx); 
    this.diceCirclesReversed(ctx); 
    this.diceSquaresReversed(ctx); 
    this.circleParts(ctx);
  }
  
  getCanvas() {
    return this.canvas;
  }
  
  getImageUrl() {
    return this.canvas.toDataURL();
  }
  
  // toBrightness = 0 or 255
  createNormalMap(distance, toBrightness, direction) {
    toBrightness = toBrightness ?? 255;
    direction = direction ?? 1;
    
    let ctx = this.canvas.getContext("2d");
    
    distance = distance ?? 5;
    let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let data = imageData.data;
    
    // Copy the rgb (brightness) into the alpha channel
    for (let i = 0; i < data.length; i+=4) {
      data[i+3] = data[i];
    }
  
    let width  = this.canvas.width;
    let height = this.canvas.height;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        
        // Find the nearest pattern point
        let nearest = null;
        for (let d = 0; d <= distance; d++) {
          if (nearest)
            break;
          for (let j = -d; j <= d; j++) {
            for (let i = -d; i <= d; i++) {
              if (!(i === -d || j == -d || i == d || j == d))
                continue;
              let py = Math.max(Math.min(y+j, height), 0);
              let px = Math.max(Math.min(x+i, width), 0);
              if (data[(py*width+px)*4+3] === toBrightness) {
                let l = Math.abs(i)+Math.abs(j);
                if (!nearest || (l < nearest.l)) {
                  nearest = { x:i, y:j, l };
                }
              }
            }
          }    
        }
        
        let normal = { x:0.5, y:0.5, z:1.0 };
        if (nearest) {
          // Create a normal
          normal.x = direction * nearest.x/distance;
          normal.y = direction * nearest.y/distance;
          normal.z = 1;
    
          // Normalize and divide by two (as -1 to 1 needs to fit in 0 - 255)
          let l = 2 * Math.sqrt(normal.x*normal.x + normal.y*normal.y + normal.z * normal.z)
          normal.x = normal.x/l + 0.5;
          normal.y = normal.y/l + 0.5;
          normal.z = normal.z/l + 0.5;
        }
        data[(y*width + x)*4 + 0] = Math.round(normal.x * 255.499999);
        data[(y*width + x)*4 + 1] = Math.round(normal.y * 255.499999);
        data[(y*width + x)*4 + 2] = Math.round(normal.z * 255.499999);
      }
    }
    
    // Reset the alpha channel
    for (let i = 0; i < data.length; i+=4) {
      data[i+3] = 255;
    }
    
    ctx.putImageData(imageData, 0, 0);
    ctx.filter = "blur(1.5px)";
    ctx.drawImage(this.canvas, 0, 0, width, height);
  }
  
  createBorders(from, to, color) {
    color = color  ?? "rgba(255, 255, 255, 1)"
    
    let ctx = this.canvas.getContext("2d");

    ctx.strokeStyle = color;
    ctx.lineJoin = "miter";
    ctx.lineWidth = to-from+1;
    ctx.beginPath();
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.rect(x*this.size+0.5+(from+to)/2, 
                 y*this.size+0.5+(from+to)/2,
                 this.size-1-(from+to),
                 this.size-1-(from+to));    
      }
    }
    ctx.stroke();
  }
    
  nextTile(ctx) {
    ctx.x += this.size;
    if (ctx.x === this.size * 8) {
      ctx.x = 0;
      ctx.y += this.size;
    }
  }

  bigSquares(ctx) {

    // Big sqare
    this.centerSquare(ctx, 3, this.PATTERN);
    this.nextTile(ctx);

    // Big frame
    this.centerSquare(ctx, 3, this.PATTERN);
    this.centerSquare(ctx, 2, this.EMPTY);
    this.nextTile(ctx);

    // Big square minus circle
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 3, 4, 2, this.EMPTY);
    this.nextTile(ctx);
  }

  bigCircles(ctx) {

    // Big circle
    this.circle(ctx, 1, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // Big circle minus circle
    this.circle(ctx, 1, 0, 1, this.PATTERN);
    this.circle(ctx, 3, 4, 2, this.EMPTY);
    this.nextTile(ctx);

    // Big circle minus square
    this.circle(ctx, 1, 0, 1, this.PATTERN);
    this.centerSquare(ctx, 1.66, this.EMPTY);
    this.nextTile(ctx);
  }

  cornerSquares1to3(ctx) {

    // 0 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // 0 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 3, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 3, 2, this.EMPTY);
    this.square(ctx, 4, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 3, 2, this.EMPTY);
    this.square(ctx, 4, 0, 1, this.PATTERN);
    this.square(ctx, 4, 3, 1, this.PATTERN);
    this.nextTile(ctx);

    // 0 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 15, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 15, 2, this.EMPTY);
    this.square(ctx, 4, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 15, 2, this.EMPTY);
    this.square(ctx, 4, 0, 1, this.PATTERN);
    this.square(ctx, 4, 15, 1, this.PATTERN);
    this.nextTile(ctx);
  }

  cornerSquares4(ctx) {
    // 4 of 4
    this.centerSquare(ctx, 3, this.PATTERN);
    this.square(ctx, 4, 0, 2, this.EMPTY);
    this.square(ctx, 4, 3, 2, this.EMPTY);
    this.square(ctx, 4, 12, 2, this.EMPTY);
    this.square(ctx, 4, 15, 2, this.EMPTY);
    this.square(ctx, 4, 0, 1, this.PATTERN);
    this.square(ctx, 4, 3, 1, this.PATTERN);
    this.square(ctx, 4, 12, 1, this.PATTERN);
    this.square(ctx, 4, 15, 1, this.PATTERN);
    this.nextTile(ctx);
  }

  cornerCircles1to3(ctx) {

    // 0 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // 0 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 3, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 3, 2, this.EMPTY);
    this.circle(ctx, 4, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 3, 2, this.EMPTY);
    this.circle(ctx, 4, 0, 1, this.PATTERN);
    this.circle(ctx, 4, 3, 1, this.PATTERN);
    this.nextTile(ctx);

    // 0 of 2 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 15, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 2 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 15, 2, this.EMPTY);
    this.circle(ctx, 4, 0, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 2 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 15, 2, this.EMPTY);
    this.circle(ctx, 4, 0, 1, this.PATTERN);
    this.circle(ctx, 4, 15, 1, this.PATTERN);
    this.nextTile(ctx);
  }    

  cornerCircles4(ctx) {
    // 4 of 4
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 4, 0, 2, this.EMPTY);
    this.circle(ctx, 4, 3, 2, this.EMPTY);
    this.circle(ctx, 4, 12, 2, this.EMPTY);
    this.circle(ctx, 4, 15, 2, this.EMPTY);
    this.circle(ctx, 4, 0, 1, this.PATTERN);
    this.circle(ctx, 4, 3, 1, this.PATTERN);
    this.circle(ctx, 4, 12, 1, this.PATTERN);
    this.circle(ctx, 4, 15, 1, this.PATTERN);
    this.nextTile(ctx);
  }

  sideCircles1to3(ctx) {

    // 0 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 2, 1, this.PATTERN);
    this.nextTile(ctx);

    // 0 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 14, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 14, 2, this.EMPTY);
    this.circle(ctx, 5, 2, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 2 A
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 14, 2, this.EMPTY);
    this.circle(ctx, 5, 2, 1, this.PATTERN);
    this.circle(ctx, 5, 14, 1, this.PATTERN);
    this.nextTile(ctx);

    // 0 of 2 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 22, 2, this.EMPTY);
    this.nextTile(ctx);

    // 1 of 2 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 22, 2, this.EMPTY);
    this.circle(ctx, 5, 2, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 2 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 22, 2, this.EMPTY);
    this.circle(ctx, 5, 2, 1, this.PATTERN);
    this.circle(ctx, 5, 22, 1, this.PATTERN);
    this.nextTile(ctx);
  }       

  sideCircles4(ctx) {
    // 4 of 4
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 5, 2, 2, this.EMPTY);
    this.circle(ctx, 5, 14, 2, this.EMPTY);
    this.circle(ctx, 5, 10, 2, this.EMPTY);
    this.circle(ctx, 5, 22, 2, this.EMPTY);
    this.circle(ctx, 5, 2, 1, this.PATTERN);
    this.circle(ctx, 5, 14, 1, this.PATTERN);
    this.circle(ctx, 5, 10, 1, this.PATTERN);
    this.circle(ctx, 5, 22, 1, this.PATTERN);
    this.nextTile(ctx);
  }      

  triangleCorners1to3(ctx) {
  }

  triangleCorners4(ctx) {

    // 1 of 1
    this.rotatedSquare(ctx, this.PATTERN);
    this.nextTile(ctx);

    // 1 of 4
    this.rotatedSquare(ctx, this.PATTERN);
    this.triCorner(ctx, 0, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 4 A
    this.rotatedSquare(ctx, this.PATTERN);
    this.triCorner(ctx, 0, this.PATTERN);
    this.triCorner(ctx, 1, this.PATTERN);
    this.nextTile(ctx);

    // 2 of 4 B
    this.rotatedSquare(ctx, this.PATTERN);
    this.triCorner(ctx, 0, this.PATTERN);
    this.triCorner(ctx, 2, this.PATTERN);
    this.nextTile(ctx);

    // 3 of 4
    this.rotatedSquare(ctx, this.PATTERN);
    this.triCorner(ctx, 0, this.PATTERN);
    this.triCorner(ctx, 1, this.PATTERN);
    this.triCorner(ctx, 2, this.PATTERN);
    this.nextTile(ctx);

    // 4 of 4
    this.rotatedSquare(ctx, this.PATTERN);
    this.triCorner(ctx, 0, this.PATTERN);
    this.triCorner(ctx, 1, this.PATTERN);
    this.triCorner(ctx, 2, this.PATTERN);
    this.triCorner(ctx, 3, this.PATTERN);
    this.nextTile(ctx);
  }

  diceCircles(ctx) {

    // 1 of 1
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 7, 24, 3, this.EMPTY)
    this.nextTile(ctx);

    // 2 of 2
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 9, 22, 3, this.EMPTY)
    this.circle(ctx, 9, 58, 3, this.EMPTY)
    this.nextTile(ctx);      

    // 2 of 4 B
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 9, 20, 3, this.EMPTY)
    this.circle(ctx, 9, 60, 3, this.EMPTY)
    this.nextTile(ctx);      

    // 4 of 4
    this.centerSquare(ctx, 3, this.PATTERN);
    this.circle(ctx, 9, 20, 3, this.EMPTY)
    this.circle(ctx, 9, 24, 3, this.EMPTY)
    this.circle(ctx, 9, 56, 3, this.EMPTY)
    this.circle(ctx, 9, 60, 3, this.EMPTY)
    this.nextTile(ctx);      
  }

  diceCirclesReversed(ctx) {

    // 1 of 1
    this.circle(ctx, 7, 24, 3, this.PATTERN)
    this.nextTile(ctx);

    // 2 of 2
    this.circle(ctx, 7, 10, 3, this.PATTERN)
    this.circle(ctx, 7, 38, 3, this.PATTERN)
    this.nextTile(ctx);

    // 2 of 4 B
    this.boundaryCircle(ctx, 5, 7, 2, this.PATTERN)
    this.boundaryCircle(ctx, 5, 28, 2, this.PATTERN)
    this.nextTile(ctx);

    // 4 of 4
    this.boundaryCircle(ctx, 5, 7, 2, this.PATTERN)
    this.boundaryCircle(ctx, 5, 10, 2, this.PATTERN)
    this.boundaryCircle(ctx, 5, 25, 2, this.PATTERN)
    this.boundaryCircle(ctx, 5, 28, 2, this.PATTERN)      
    this.nextTile(ctx);
  }

  diceSquaresReversed(ctx) {

    // 1 of 1
    this.square(ctx, 7, 24, 3, this.PATTERN)
    this.nextTile(ctx);

    // 2 of 2
    this.square(ctx, 7, 10, 3, this.PATTERN)
    this.square(ctx, 7, 38, 3, this.PATTERN)
    this.nextTile(ctx);

    // 2 of 4 B
    this.square(ctx, 7, 8, 3, this.PATTERN)
    this.square(ctx, 7, 40, 3, this.PATTERN)
    this.nextTile(ctx);

    // 3 of 4
    this.square(ctx, 7, 8, 3, this.PATTERN)
    this.square(ctx, 7, 12, 3, this.PATTERN)
    this.square(ctx, 7, 36, 3, this.PATTERN)
    this.square(ctx, 7, 40, 3, this.PATTERN)
    this.nextTile(ctx);

  }

  circleParts(ctx) {  

    // Half disks
    this.circle(ctx, 5, 12, 5, this.PATTERN);
    this.square(ctx, 7, 21, 1.5, this.EMPTY);
    this.square(ctx, 7, 22, 1.5, this.EMPTY);
    this.square(ctx, 7, 23, 1.5, this.EMPTY);
    this.square(ctx, 7, 24, 1.5, this.EMPTY);
    this.square(ctx, 7, 25, 1.5, this.EMPTY);
    this.square(ctx, 7, 26, 1.5, this.EMPTY);
    this.square(ctx, 7, 27, 1.5, this.EMPTY);
    this.nextTile(ctx);  

    for (let i = 0; i < 2; i++) {

      // Half circles
      this.circle(ctx, 5, 12, 5, this.PATTERN);
      this.circle(ctx, 5, 12, 3, this.EMPTY);
      this.square(ctx, 7, 21, 1.5, this.EMPTY);
      this.square(ctx, 7, 22, 1.5, this.EMPTY);
      this.square(ctx, 7, 26, 1.5, this.EMPTY);
      this.square(ctx, 7, 27, 1.5, this.EMPTY);
      if (i === 1) {
        this.circle(ctx, 5, 12, 1.5, this.PATTERN);
      }
      this.nextTile(ctx);  

      // Quart circles 1 of 4
      this.circle(ctx, 5, 12, 5, this.PATTERN);
      this.circle(ctx, 5, 12, 3, this.EMPTY);
      this.square(ctx, 2, 1, 1, this.EMPTY);
      this.square(ctx, 2, 2, 1, this.EMPTY);
      this.square(ctx, 2, 3, 1, this.EMPTY);
      if (i === 1) {
        this.circle(ctx, 5, 12, 1.5, this.PATTERN);
      }
      this.nextTile(ctx);  

      // Quart circles 2 of 4 A
      this.circle(ctx, 5, 12, 5, this.PATTERN);
      this.circle(ctx, 5, 12, 3, this.EMPTY);
      this.square(ctx, 2, 2, 1, this.EMPTY);
      this.square(ctx, 2, 3, 1, this.EMPTY);
      if (i === 1) {
        this.circle(ctx, 5, 12, 1.5, this.PATTERN);
      }
      this.nextTile(ctx);  

      // Quart circles 2 of 4 B
      this.circle(ctx, 5, 12, 5, this.PATTERN);
      this.circle(ctx, 5, 12, 3, this.EMPTY);
      this.square(ctx, 2, 1, 1, this.EMPTY);
      this.square(ctx, 2, 2, 1, this.EMPTY);
      if (i === 1) {
        this.circle(ctx, 5, 12, 1.5, this.PATTERN);
      }
      this.nextTile(ctx);  

      // Quart circles 3 of 4
      this.circle(ctx, 5, 12, 5, this.PATTERN);
      this.circle(ctx, 5, 12, 3, this.EMPTY);
      this.square(ctx, 2, 0, 1, this.EMPTY);
      if (i === 1) {
        this.circle(ctx, 5, 12, 1.5, this.PATTERN);
      }
      this.nextTile(ctx);  

      // Quart circles 4 of 4
      this.circle(ctx, 5, 12, 5, this.PATTERN);
      this.circle(ctx, 5, 12, 3, this.EMPTY);
      this.square(ctx, 7,  3, 1.5, this.EMPTY);
      this.square(ctx, 7, 10, 1.5, this.EMPTY);
      this.square(ctx, 7, 21, 1.5, this.EMPTY);
      this.square(ctx, 7, 22, 1.5, this.EMPTY);
      this.square(ctx, 7, 26, 1.5, this.EMPTY);
      this.square(ctx, 7, 27, 1.5, this.EMPTY);
      this.square(ctx, 7, 38, 1.5, this.EMPTY);
      this.square(ctx, 7, 45, 1.5, this.EMPTY);
      if (i === 1) {
        this.circle(ctx, 5, 12, 1.5, this.PATTERN);
      }
      this.nextTile(ctx);  
    }  

  }

  centerSquare(ctx, radius, color) {
    ctx.c.fillStyle = color;
    ctx.c.beginPath();
    ctx.c.fillRect(ctx.x+this.size/2-radius*this.border, 
                   ctx.y+this.size/2-radius*this.border,
                   radius*2*this.border,
                   radius*2*this.border);
  }

  rotatedSquare(ctx, color) {
    ctx.c.beginPath();
    ctx.c.fillStyle = color;
    ctx.c.moveTo(ctx.x+this.border, ctx.y+this.size/2);
    ctx.c.lineTo(ctx.x+this.size/2, ctx.y+this.border);
    ctx.c.lineTo(ctx.x+this.size-this.border, ctx.y+this.size/2);
    ctx.c.lineTo(ctx.x+this.size/2, ctx.y+this.size-this.border);
    ctx.c.closePath();
    ctx.c.fill();  
  }

  triCorner(ctx, index, color) {
    ctx.c.beginPath();
    ctx.c.fillStyle = color;
    switch (index) {
      case 0:
        ctx.c.moveTo(ctx.x+this.border, ctx.y+this.border);
        ctx.c.lineTo(ctx.x+this.size/2-this.border, ctx.y+this.border);
        ctx.c.lineTo(ctx.x+this.border, ctx.y+this.size/2-this.border);
        break;
      case 1:
        ctx.c.moveTo(ctx.x+this.size-this.border, ctx.y+this.border);
        ctx.c.lineTo(ctx.x+this.size-this.border, ctx.y+this.size/2-this.border);
        ctx.c.lineTo(ctx.x+this.size/2+this.border, ctx.y+this.border);
        break;
      case 2:
        ctx.c.moveTo(ctx.x+this.size-this.border, ctx.y+this.size-this.border);
        ctx.c.lineTo(ctx.x+this.size/2+this.border, ctx.y+this.size-this.border);
        ctx.c.lineTo(ctx.x+this.size-this.border, ctx.y+this.size/2+this.border);
        break;
      case 3:
        ctx.c.moveTo(ctx.x+this.border, ctx.y+this.size-this.border);
        ctx.c.lineTo(ctx.x+this.border, ctx.y+this.size/2+this.border);
        ctx.c.lineTo(ctx.x+this.size/2-this.border, ctx.y+this.size-this.border);
        break;
    }
    ctx.c.closePath();
    ctx.c.fill();  
  }

  square(ctx, divisions, index, radius, color) {

    let cell = (this.size - 2* this.border) / divisions;
    let x    = index % divisions;
    let y    = Math.floor(index / divisions)

    ctx.c.beginPath();
    ctx.c.fillStyle = color;
    ctx.c.fillRect(ctx.x+this.border+cell*(x+0.5-radius/2), 
                   ctx.y+this.border+cell*(y+0.5-radius/2), 
                   cell*radius, cell*radius);
    ctx.c.fill();
  }    

  circle(ctx, divisions, index, radius, color) {

    let cell = (this.size - 2* this.border) / divisions;
    let x    = index % divisions;
    let y    = Math.floor(index / divisions)

    ctx.c.beginPath();
    ctx.c.fillStyle = color;
    ctx.c.arc(ctx.x+this.border+cell*(x+0.5), 
              ctx.y+this.border+cell*(y+0.5), 
              radius*cell/2, 0, 2 * Math.PI);
    ctx.c.fill();
  }    

  boundaryCircle(ctx, divisions, index, radius, color) {

    let cell = (this.size - 2* this.border) / divisions;
    let x    = index % (divisions+1);
    let y    = Math.floor(index / (divisions+1));

    ctx.c.beginPath();
    ctx.c.fillStyle = color;
    ctx.c.arc(ctx.x+this.border+cell*(x), 
              ctx.y+this.border+cell*(y), 
              radius*cell/2, 0, 2 * Math.PI);
    ctx.c.fill();
  }    
}