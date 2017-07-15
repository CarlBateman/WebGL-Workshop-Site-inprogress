var makeAdapter = function () {
  // talk to UI
  // talk to renderer

  var engines = [];
  var currentEngine = null;


  // return functions
  return {
    render: function () {
    // handle any changes after render (update) e.g. camera position
      var sceneState = currentEngine.render();
      for (var i in engines) {
        if (engines[i] !== currentEngine) {
          engines[i].updateScene(sceneState);
        }
      }
    },
    addEngine: function (name, engine) { engines[name] = engine; },

    setEngine: function (name) {
      if (name in engines) {
        if(currentEngine)
          currentEngine.display("none");
        currentEngine = engines[name];
        currentEngine.display("block");
      }
    },

    setScene: function (scene) { currentEngine.setScene(scene); },
    getScene: function () { return currentEngine.getScene(); },
    clearAll: function () { currentEngine.clearAll(); },

    add: function (type) { return currentEngine.add(type); },
    set: function (id, property, value) { currentEngine.set(id, property, value); },
    remove: function (id) { currentEngine.remove(id); },
    replace: function (id, type) { currentEngine.replace(id, type); },
  }
}