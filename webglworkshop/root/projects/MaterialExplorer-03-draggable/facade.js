var makeAdapter = function () {
  // talk to UI
  // talk to renderer

  var engines = [];
  var currentEngine = null;


  // return functions
  return {
    render: function () { currentEngine.render(); },
    addEngine: function (name, engine) { engines[name] = engine; },

    setEngine: function (name) {
      if (name in engines) {
        if(currentEngine)
          currentEngine.display("none");
        currentEngine = engines[name];
        currentEngine.display("block");
      }
    },

    add: function (type) { return currentEngine.add(type); },
    set: function (id, property, value) { currentEngine.set(id, property, value); },
    remove: function (id) { currentEngine.remove(id); },
    replace: function (id, type) { currentEngine.replace(id, type); },

  }
}