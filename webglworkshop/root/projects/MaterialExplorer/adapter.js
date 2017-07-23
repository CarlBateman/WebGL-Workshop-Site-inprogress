var makeAdapter = function () {
  // talk to UI
  // talk to renderer

  var engines = [];
  var logos = [];
  var currentEngine = null;


  // return functions
  return {
    render: function () {
      var sceneState = currentEngine.render();
    },
    addEngine: function (name, engine) {
      engines[name] = engine;
      logos[name] = document.getElementById(name.replace(".", "").toLowerCase() + "-logo");
    },

    setEngine: function (name) {
      if (name in engines) {
        if (currentEngine) {
          currentEngine.display("none");
        }
        currentEngine = engines[name];
        currentEngine.display("block");

        for (key in logos) {
          if (key !== name)
            logos[key].style.display = "none";
          else
            logos[key].style.display = "block";
        }
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