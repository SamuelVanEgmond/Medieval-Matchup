/* global AFRAME */

// Hide the controllers until they actually move (i.e. hides the unused controllers)
AFRAME.registerComponent('show-on-move', {
  schema: {},
  dependencies: [ "position" ],
  init: function () {
    this.originalPos = this.el.object3D.position.clone();
    this.el.object3D.visible = false;
  },
  tick: function () {
    if (!this.el.object3D.position.equals(this.originalPos)) {
      this.el.object3D.visible = true;
    }
  }
});
