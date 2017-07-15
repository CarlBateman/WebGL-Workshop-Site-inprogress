var optionsController = {
  options: {
    Renderer : "Three.js",

    //this.value1 = 0.8;
    //this.value2 = 10;
    //this.message = 'Pizza';
    //this.speed = 0;

    //document.getElementById("value1").innerText = this.value1;
    //document.getElementById("id2").innerText = this.value2;
    //document.getElementById("Dropdown1").innerText = this.message;
    //document.getElementById("Dropdown2").innerText = this.speed;
  },

  //options: new HandleChanges(),

  gui: new dat.GUI({ autoPlace: false, /*width: 30, closeOnTop: true */ }),

  setEngine: function () { },

  initialise: function () {
    var self = this;
    document.getElementById('controls').appendChild(this.gui.domElement)

    this.gui.add(this.options, 'Renderer', ['Three.js', 'Babylon.js']).onFinishChange(function () {
      self.setEngine(self.options.Renderer);
    });



    //this.gui.add(this.options, 'value2', -50, 50).onChange(function () {
    //  document.getElementById("id2").innerText = this.options.value2;
    //});

    //this.gui.add(this.options, 'value1', -5, 5).onFinishChange(function () {
    //  document.getElementById("id2").innerText = this.options.value1;
    //});

    //this.gui.add(this.options, 'message', ['Pizza', 'Chrome', 'Hooray']).onChange(function () {
    //  document.getElementById("Dropdown1").innerText = this.options.message;
    //});

    //this.gui.add(this.options, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 }).onFinishChange(function () {
    //  document.getElementById("Dropdown2").innerText = this.options.speed;
    //});
  },
}
