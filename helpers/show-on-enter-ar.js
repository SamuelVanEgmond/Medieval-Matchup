/* global AFRAME */

// A-Frame only has an hide-on-enter-ar component, so this is an adapted copy
AFRAME.registerComponent('show-on-enter-ar', {
  init: function () {
    var self = this;
    this.el.sceneEl.addEventListener('enter-vr', function () {
      if (self.el.sceneEl.is('ar-mode')) {
        self.el.object3D.visible = true;
      }
    });
    this.el.sceneEl.addEventListener('exit-vr', function () {
      self.el.object3D.visible = false;
    });
  }
});