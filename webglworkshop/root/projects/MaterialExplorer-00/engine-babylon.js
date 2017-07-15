/// <reference path="../../libs/babylon/babylon.js" />

function makeBabylon(scene) {
  var geometry = { types: [], defaults: [] };
  geometry.types["box"] = BABYLON.Mesh.CreateBox;
  geometry.defaults["box"] = [1];
  geometry.types["torus"] = BABYLON.Mesh.CreateTorus;
  geometry.defaults["torus"] = [5,1,10];

  var lux = { types: [], defaults: [] };
  lux.types["spot"] = BABYLON.SpotLight;
  lux.defaults["spot"] = [0,1,0];
  //lux.defaults["spot"] = [0xffffff];

  lux.types["point"] = BABYLON.PointLight;
  lux.defaults["point"] = [0,1,0];
  //lux.defaults["point"] = [0xffffff];

  ///////////////////////////////////////////////////////////////////////
  var glCanvas = document.createElement("canvas");
  document.getElementById("view").insertBefore(glCanvas, document.getElementById("view").firstChild);
  glCanvas.id = "renderCanvas";

  var engine = new BABYLON.Engine(glCanvas, true);
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.position.z = 50;
  ///////////////////////////////////////////////////////////////////////



  // Create a light
  var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
  light0.diffuse = new BABYLON.Color3(1, 1, 1);
  light0.specular = new BABYLON.Color3(1, 1, 1);
  light0.groundColor = new BABYLON.Color3(0, 0, 0);

  var box = BABYLON.Mesh.CreateBox("box", 4.0, scene);

  // Attach the camera to the scene
  scene.activeCamera.attachControl(glCanvas);

  // Once the scene is loaded, just register a render loop to render it
  //engine.runRenderLoop(function () {
  //  scene.render();
  //});

  function render() {
    scene.render();
  }
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  function add(type) {
    if (type in geometry.types) {
      var mesh = geometry.types[type](type+"mesh", ...geometry.defaults[type], scene);
      mesh.material = new BABYLON.StandardMaterial("texture1", scene);

      return mesh.id;
    }

    if (type in lux.types) {
      //var lighta = new lux.types[type](type, new BABYLON.Vector3(...lux.defaults[type]),scene);
      var lighta = new lux.types[type](type+"light", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
      return lighta.id;
    }
  }

  function set(id, property, value) {
    var obj;
    if (id.includes("light")) {
      obj = scene.getLightByName(id);
    } else
      obj = scene.getMeshByID(id);
    var prop = Object.resolve(property, obj);

    //if (prop instanceof THREE.Color)
    //  prop.setRGB(...value);
    //else
    if (prop)
      prop.copyFromFloats(...value);
    else
      console.log("www");
  }

  function remove(id) { }
  function replace(id, type) { }

  function display(value) { glCanvas.style.display = value; }
  glCanvas.style.display = "none";

  return { render: render, add: add, display: display, set: set };
}