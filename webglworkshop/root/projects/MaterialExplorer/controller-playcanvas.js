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
  geometryTypes["cone"] = pc.createCone;

  var geometryDefaults = [];
  geometryDefaults["box"] = { halfExtents: new pc.Vec3(10, 10, 10) };
  geometryDefaults["torus"] = { tubeRadius: 2.5, ringRadius: 25, segments: 64 };
  geometryDefaults["sphere"] = { radius: 10, segments: 16 };
  geometryDefaults["capsule"] = { radius: 10, height: 30, side: 16 };
  geometryDefaults["cylinder"] = { baseRadius: 10, height: 30, capSegments: 16 };
  geometryDefaults["cone"] = { baseRadius: 10, peakRadius: 0, height: 30, capSegments: 16 };

  function init() {
    glCanvas = document.createElement("canvas");
    glCanvas.id = "playCanvas";
    document.getElementById("view").insertBefore(glCanvas, document.getElementById("view").firstChild);

    app = new pc.Application(glCanvas, {});
    app.start();

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    camera = new pc.Entity('camera');
    camera.addComponent('camera', {
      fov: 74,
      clearColor: new pc.Color(0.1, 0.1, 0.1)
    });
    app.root.addChild(camera);
  }

  function clearAll() {
    while (entities.length > 0) {
      entities.pop().destroy();
    }
  }

  function getScene() {
    var sceneGeneric = makeScene();
    sceneGeneric.ambient = app.scene.ambientLight.data;

    sceneGeneric.cameraPos = camera.position.data;// [0,0,10];
    var t = camera.rotation.getEulerAngles();
    sceneGeneric.cameraRot = [t.x, t.y, t.z];


    for (var i = 0; i < entities.length; i++) {
      var item = entities[i];
      var type = item.cb_tag;

      if (type === "ignore") continue;

      if (type.includes("light")) {
        var light = makeLight();
        light.type = type.replace("light", "");
        light.position = [...item.localPosition.data];
        //light.direction = type === "spotlight" ? item.target.position : item.target.position;

        sceneGeneric.lights.push(light);
      }

      if (type.includes("mesh")) {
        var mesh = makeMesh();
        var geometry = item.geometry;
        mesh.type = item.cb_tag.replace("mesh", "");
        
        mesh.position = [...item.localPosition.data];
        var material = makeMaterial();

        sceneGeneric.meshes.push(mesh);
        //sceneGeneric.material.push(material);
      }
    }

    return sceneGeneric;
  }

  function setScene(sceneGeneric) {
    camera.camera.clearColor = new pc.Color(...sceneGeneric.background);
    app.scene.ambientLight = new pc.Color(...sceneGeneric.ambient);

    camera.camera.fov = sceneGeneric.cameraFOV;
    camera.setPosition(...sceneGeneric.cameraPos);
    camera.setLocalEulerAngles(...sceneGeneric.cameraRot);

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
  };

  var defaultMaterial = new pc.StandardMaterial();
  function add(item) {
    var type = item.type;
    if (type in geometryTypes) {
      var mesh1 = new pc.Entity('cube');
      mesh1.addComponent('model', {
        type: 'box'//type
      });

      mesh1.cb_tag = type + "mesh";


      var node = new pc.GraphNode();
      var mesh = geometryTypes[type](app.graphicsDevice, geometryDefaults[type]);
      //var meshInstance = new pc.MeshInstance(node, mesh, defaultMaterial);
      var meshInstance = new pc.MeshInstance(mesh1.model.meshInstances[0].node, mesh, defaultMaterial);

      mesh1.model.meshInstances = [meshInstance];
      //var model = new pc.Model();
      //model.graph = node;
      //model.meshInstances = [meshInstance];
      //model.graph.setLocalPosition(...item.position);

      //app.scene.addModel(model);
      mesh1.setLocalPosition(...item.position);
      app.root.addChild(mesh1);

      entities.push(mesh1);

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