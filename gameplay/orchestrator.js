/* global AFRAME */
/* global render */
/* global MMU */

// Shows the models on the island depending on how far along the player is
AFRAME.registerComponent('orchestrator', {
  schema: {},
  
  init: function () {    
    this.createModels();  
    this.el.createModels = this.createModels;
    this.el.reset = this.reset;
  },
  
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {
    this.level = document.getElementById('level');
    this.level.pause();
    this.menu = document.getElementById('menu');      
  },
  
  reset: function () {
    MMU.settings.setLevel(0);
    this.createModels();
    MMU.settings.setLevel(MMU.models.length);
    this.createModels();    
  },
  
  createModels: function () {
    this.visibleModels = document.getElementById("visiblemodels");
    
    let delay = 0;
    for (let m=0; m<MMU.models.length; m++) {
      let model = MMU.models[m];           
      for (let p=0; p<model.pos.length; p++) {
        
        let id = model.name + (p===0?'':p);
        let existingModel = document.getElementById(id);
        if (existingModel && m<MMU.settings.level) {
          // The model already exists
          continue;
        }
        else if (existingModel && m>=MMU.settings.level) {
          // The model already exists, but we reset the game, so remove it
          existingModel.remove();
          continue;
        }
        else if (m>=MMU.settings.level) {
          // The model does not exist and should not yet be shown
          continue;
        }         
        
        delay += 250;
        if (model.name === 'Windmill') {
          // Animate the windmill
          let mill = render(this.visibleModels, 'a-entity', { 
                                          id:'Windmill', model:`level:Windmill;`, 
                                          position:model.pos[p], 
                                          rotation:{ x:0, y:model.pos[p].r, z:0 }, 
                                          scale:"0 0 0", 
                                          shadow:'cast: true;',
                                          animation__scale:`property: scale; from: 0 0 0; to: 1 1 1; dur: 3000; delay:${delay};easing:easeOutElastic;` 
                                        });
          render(mill, 'a-entity', { model:`level:WindmillBlades; yoffset:0.5;`, 
                                      position: '0 2.875 0.125', 
                                      shadow:'cast: true;',
                                      animation__rotate:`property: object3D.rotation.z; from:0; to:360; loop:true; dur:3000; easing:linear;` 
                                    });
        }
        else if (model.name === 'Watermill') {
          // Animate the watermill
          let watermill = render(this.visibleModels, 'a-entity', { 
                                          id:'Watermill', model:`level:Watermill;`, 
                                          position:model.pos[p], 
                                          rotation:{ x:0, y:model.pos[p].r, z:0 }, 
                                          scale:"0 0 0", 
                                          shadow:'cast: true;',
                                          animation__scale:`property: scale; from: 0 0 0; to: 1 1 1; dur: 3000; delay:${delay};easing:easeOutElastic;` 
                                        });
          render(watermill, 'a-entity', { model:`level:WatermillWheel; yoffset:0.5;`, 
                                      position: '1.125 1.125 0', 
                                      shadow:'cast: true;',
                                      animation__rotate:`property: object3D.rotation.z; from:360; to:0; loop:true; dur:3000; easing:linear;` 
                                    });
        }
        else if (model.animation)
          // This model has an extra animation (e.g. the trees or the galleon)          
          render(this.visibleModels, 'a-entity', { id:`${id}`, model:`level:${m};`, 
                                          position:model.pos[p], 
                                          rotation:{ x:0, y:model.pos[p].r, z:0 }, 
                                          scale:"0 0 0", 
                                          shadow:'cast: true;',
                                          animation__scale:`property: scale; from: 0 0 0; to: 1 1 1; dur: 3000; delay:${delay};easing:easeOutElastic;`, 
                                          animation__extra:model.animation 
                                        });
        else
          // A static model
          render(this.visibleModels, 'a-entity', { id:`${id}`, model:`level:${m};`, 
                                          position:model.pos[p], 
                                          rotation:{ x:0, y:model.pos[p].r, z:0 }, 
                                          shadow:'cast: true;',
                                          scale:"0 0 0", 
                                          animation__scale:`property: scale; from: 0 0 0; to: 1 1 1; dur: 3000; delay:${delay};easing:easeOutElastic;` 
                                        });
      }
    }
  }
});
