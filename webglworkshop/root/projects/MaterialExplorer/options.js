var optionsController = {
  options: {
    Renderer : "Three.js",
  },

  //options: new HandleChanges(),

  gui: new dat.GUI({ autoPlace: false, /*width: 30, closeOnTop: true */ }),

  //setEngine: function () { },

  adapter: null,

  initialise: function () {
    var self = this;
    document.getElementById('controls').appendChild(this.gui.domElement)

    this.gui.add(this.options, 'Renderer', ['Three.js', 'Babylon.js']).onFinishChange(function () {
      //self.setEngine(self.options.Renderer);
      self.adapter.setEngine(self.options.Renderer);
    });


  },
}
