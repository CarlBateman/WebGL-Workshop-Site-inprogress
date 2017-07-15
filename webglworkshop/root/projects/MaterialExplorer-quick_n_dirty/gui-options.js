function options() {
  var gui, param = { color: '0xffffff' };

  //dat.GUI.prototype.removeFolder = function (name) {
  //  var folder = this.__folders[name];
  //  if (!folder) {
  //    return;
  //  }
  //  folder.close();
  //  this.__ul.removeChild(folder.domElement.parentNode);
  //  delete this.__folders[name];
  //  this.onResize();
  //}
  //gui.removeFolder("Material");

  function addMaterialsFolder(name, properties) {
    var folder = addFolder(name);

    for (var propertyName in properties) {
      var property = properties[propertyName];
      addColorToFolder(folder, propertyName, property.getHex(), setProperty(property));
    }

    function setProperty(propertyName) {
      return function (val) {
        propertyName.setHex(val);
        //render();
      };
    }

    function addFolder(folderName) {
      var folder = gui.addFolder(folderName);
      folder.open();
      return folder;
    }

    function addColorToFolder(folder, name, value, callback) {
      var node;
      param[name] = value;
      node = folder.addColor(param, name).onChange(function () {
        callback(param[name]);
      });
    }
  }
  options.addMaterialsFolder = addMaterialsFolder;

  function addGui(name, param, value, callback, isColor, min, max) {
    var node;
    param[name] = value;
    if (isColor) {
      node = gui.addColor(param, name).onChange(function () {
        callback(param[name]);
      });
    } else if (typeof value == 'object') {
      node = gui.add(param, name, value).onChange(function () {
        callback(param[name]);
      });
    } else {
      node = gui.add(param, name, min, max).onChange(function () {
        callback(param[name]);
      });
    }
    return node;
  }
  options.addGui = addGui;

  function buildGui(spotLight) {
    clearGui();
    addGui('light color', param, spotLight.color.getHex(), function (val) {
      spotLight.color.setHex(val);
      //render();
    }, true);
    addGui('intensity', param, spotLight.intensity, function (val) {
      spotLight.intensity = val;
      //render();
    }, false, 0, 2);
    addGui('distance', param, spotLight.distance, function (val) {
      spotLight.distance = val;
      //render();
    }, false, 0, 200);
    addGui('angle', param, spotLight.angle, function (val) {
      spotLight.angle = val;
      //render();
    }, false, 0, Math.PI / 3);
    addGui('penumbra', param, spotLight.penumbra, function (val) {
      spotLight.penumbra = val;
      //render();
    }, false, 0, 1);
    addGui('decay', param, spotLight.decay, function (val) {
      spotLight.decay = val;
      //render();
    }, false, 1, 2);
  }
  options.buildGui = buildGui;

  function clearGui() {
    if (gui) gui.destroy();
    gui = new dat.GUI();
    gui.open();
    return gui;
  }
  options.clearGui = clearGui;


}
options();