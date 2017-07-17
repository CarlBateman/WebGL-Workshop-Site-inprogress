/// <reference path="../../libs/playcanvas/playcanvas.js" />
/// <reference path="scene.js" />

function makePlayCanvasController(sceneGeneric) {
  var glCanvas;
  var app;
  var view;
  var renderer;
  var scene;
  var camera;
  var controls;
  var ambientLight;
  var entities = [];

  var lightTypes = [];
  lightTypes["spot"] = "";
  lightTypes["point"] ="";
  lightTypes["hemi"] = "";
  lightTypes["dir"] =  "";

  var lightDefaults = [];
  lightDefaults["spot"] = [1, 1, 1];
  lightDefaults["point"] = [1, 1, 1];
  lightDefaults["dir"] = [1, 1, 1];

  var geometryTypes = [];
  geometryTypes["box"] = pc.createBox;
  geometryTypes["torus"] = pc.createTorus;
  geometryTypes["sphere"] = pc.createSphere;
  geometryTypes["cylinder"] = pc.createCylinder;

  var geometryDefaults = [];
  geometryDefaults["box"] = { halfExtents: [2.5, 2.5, 2.5] };
  geometryDefaults["torus"] = { tubeRadius: .25, ringRadius: 2.5, segments: 64 };
  geometryDefaults["sphere"] = { radius: 1, segments: 16 };
  geometryDefaults["cylinder"] = { radius: 1, height: 3, capSegments: 16 };
  geometryDefaults["capsule"] = { radius: 1, height: 3, side: 16 };
  geometryDefaults["cone"] = { baseRadius: 1, peakRadius: 0, capSegments: 16 };

  function init() {
    glCanvas = document.createElement("canvas");
    glCanvas.id = "playCanvas";
    document.getElementById("view").insertBefore(glCanvas, document.getElementById("view").firstChild);

    app = new pc.Application(glCanvas, {});
    app.start();

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    //renderer.setSize(glCanvas.clientWidth, glCanvas.clientHeight);
    //renderer.setClearColor(0xEEEEEE, 1);

    camera = new pc.Entity('camera');
    camera.addComponent('camera', {
      fov: 74,
      clearColor: new pc.Color(0.1, 0.1, 0.1)
    });
    camera.setPosition(0, 0, 10);
    app.root.addChild(camera);
  }

  function clearAll() {
    //while (scene.children.length > 0) {
    //  scene.remove(scene.children[0]);
    //}
    //scene.add(ambientLight);
  }

  function getScene() {
    var sceneGeneric = makeScene();
    sceneGeneric.ambient = app.scene.ambientLight.data;

    sceneGeneric.cameraPos = camera.position.data;// [0,0,10];


    for (var i = 0; i < entities.length; i++) {
      var item = entities[i];
      var type = item.cb_tag;//item.type.toLowerCase();

      if (type === "ignore") continue;

      if (type.includes("light")) {
        var light = makeLight();
        light.type = type.replace("light", "");
        light.position = item.position;
        //light.direction = type === "spotlight" ? item.target.position : item.target.position;

        sceneGeneric.lights.push(light);
      }

      if (type.includes("mesh")) {
        var mesh = makeMesh();
        var geometry = item.geometry;
        mesh.type = item.cb_tag.replace("mesh", "");;//geometry.type.toLowerCase().replace("geometry", "").replace("buffer", "");
        
        var material = makeMaterial();

        sceneGeneric.meshes.push(mesh);
        //sceneGeneric.material.push(material);
      }
    }

    return sceneGeneric;
  }

  function setScene(sceneGeneric) {
    //camera.camera.clearColor.set(...sceneGeneric.background); <= doesn't work
    camera.camera.clearColor = new pc.Color(...sceneGeneric.background);
    app.scene.ambientLight = new pc.Color(...sceneGeneric.ambient);

    camera.setPosition(...sceneGeneric.cameraPos);

    var meshes = sceneGeneric.meshes;
    for (var i = 0; i < meshes.length; i++) {
      add(meshes[i]);
    }

    var lights = sceneGeneric.lights;
    for (var i = 0; i < lights.length; i++) {
      add(lights[i]);
    }
  }

  function render() {
    app.render();
    //controls.update();

    return null;//camera.position;
  };

  var defaultMaterial = new pc.StandardMaterial();
  function add(item) {
    var type = item.type;
    if (type in geometryTypes) {
      //var mesh1 = new pc.Entity('cube');
      //mesh1.addComponent('model', {
      //  type: 'box'//type
      //});

      //app.root.addChild(mesh1);
      //mesh1.cb_tag = type + "mesh1";


      var node = new pc.GraphNode();
      var mesh = geometryTypes[type](app.graphicsDevice, geometryDefaults[type]);
      var meshInstance = new pc.MeshInstance(node, mesh, defaultMaterial);
      var model = new pc.Model();
      model.graph = node;
      model.meshInstances = [meshInstance];

      app.scene.addModel(model);


      model.cb_tag = type + "mesh";

      entities.push(model);

      return mesh.id;
    }

    if (type in lightTypes) {
      var light = new pc.Entity('light');
      light.addComponent('light', {
        type: type,
        color: new pc.Color(...lightDefaults[type]),
        //range: 10
      });
      app.root.addChild(light);

      light.cb_tag = type + "light";

      entities.push(light);

      return light.id;
    }
  }

  function set(id, property, value) {
  }

  function remove(id) { }
  function replace(id, type) { }
  function display(value) { glCanvas.style.display = value; }

  init();
  if (sceneGeneric)
    setScene(sceneGeneric);
  glCanvas.style.display = "none";

  return {
    clearAll: clearAll,
    getScene: getScene,
    setScene: setScene,
    render: render,
    add: add,
    display: display,
    set: set
  }
}