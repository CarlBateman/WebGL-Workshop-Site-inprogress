/// <reference path="adapter.js" />

var optionsController = {
  options: {
    Renderer: "PlayCanvas.js",
  },

  //options: new HandleChanges(),

  gui: new dat.GUI({ autoPlace: false, /*width: 30, closeOnTop: true */ }),

  //setEngine: function () { },

  adapter: null,

  initialise: function () {
    var self = this;
    document.getElementById('controls').appendChild(this.gui.domElement)

    this.gui.add(this.options, 'Renderer', ['Three.js', 'Babylon.js', 'PlayCanvas.js']).onFinishChange(function () {
      //self.setEngine(self.options.Renderer);
      var adapter = self.adapter;
      var scene = adapter.getScene();
      adapter.setEngine(self.options.Renderer);
      adapter.clearAll();
      adapter.setScene(scene);
    });
  },
}
