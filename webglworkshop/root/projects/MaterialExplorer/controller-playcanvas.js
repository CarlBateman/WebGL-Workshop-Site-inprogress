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

  var lightTypes = [];
  lightTypes["spot"] = "";
  lightTypes["point"] ="";
  lightTypes["hemi"] = "";
  lightTypes["dir"] =  "";

  var lightDefaults = [];
  lightDefaults["spot"] = [0xffffff];
  lightDefaults["point"] = [0xffffff];
  lightDefaults["hemi"] = [0xffffff];
  lightDefaults["dir"] = [0xffffff];

  var geometryTypes = [];
  geometryTypes["box"] = pc.createBox;
  geometryTypes["torus"] = pc.createTorus;
  geometryTypes["sphere"] = pc.createSphere;
  geometryTypes["cylinder"] = pc.createCylinder;

  var geometryDefaults = [];
  geometryDefaults["box"] = { halfExtents: [2.5, 2.5, 2.5] };
  geometryDefaults["torus"] = { tubeRadius: .25, ringRadius: 2.5, segments: 64 };
  geometryDefaults["sphere"] = [ ];
  geometryDefaults["cylinder"] = [ ];

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

    //controls = new THREE.OrbitControls(camera, renderer.domElement);

    //ambientLight = new THREE.AmbientLight(0x404040);
    //ambientLight.cb_tag = "ignore";
    //scene.add(ambientLight);
  }

  function clearAll() {
    //while (scene.children.length > 0) {
    //  scene.remove(scene.children[0]);
    //}
    //scene.add(ambientLight);
  }

  function getScene() {
    var sceneGeneric = makeScene();

    //for (var i = 0; i < scene.children.length; i++) {
    //  var item = scene.children[i];
    //  var type = item.cb_tag;//item.type.toLowerCase();

    //  if (type === "ignore") continue;

    //  if (type.includes("light")) {
    //    if (type.includes("ambient")) {
    //      sceneGeneric.ambient = item.color.toArray();
    //    } else {
    //      var light = makeLight();
    //      light.type = type.replace("light", "");
    //      light.position = item.position;
    //      light.direction = type === "spotlight" ? item.target.position : item.target.position;

    //      sceneGeneric.lights.push(light);
    //    }
    //  } else if (type.includes("mesh")) {
    //    var mesh = makeMesh();
    //    var geometry = item.geometry;
    //    mesh.type = item.cb_tag.replace("mesh", "");;//geometry.type.toLowerCase().replace("geometry", "").replace("buffer", "");
        
    //    var material = makeMaterial();

    //    sceneGeneric.meshes.push(mesh);
    //    //sceneGeneric.material.push(material);
    //  }
    //} 

    return sceneGeneric;
  }

  function setScene(sceneGeneric) {
    //camera.camera.clearColor.set(...sceneGeneric.background); ,= doesn't work
    camera.camera.clearColor = new pc.Color(...sceneGeneric.background);

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

  //function updateScene(sceneState) {
  //  camera.position.x=sceneState.x;
  //  camera.position.y=sceneState.y;
  //  camera.position.z=sceneState.z;
  //  //camera.matrixWorldNeedsUpdate = true;
  //  //camera.updateMatrixWorld();
  //}

  //var defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  function add(item) {
    var type = item.type;
    if (type in geometryTypes) {
      //var mesh1 = new pc.Entity('cube');
      //mesh1.addComponent('model', {
      //  type: 'box'//type
      //});

      //app.root.addChild(mesh1);


      var node = new pc.GraphNode();
      var mesh = geometryTypes[type](app.graphicsDevice, geometryDefaults[type]);
      var material = new pc.StandardMaterial();
      var meshInstance = new pc.MeshInstance(node, mesh, material);
      var model = new pc.Model();
      model.graph = node;
      model.meshInstances = [meshInstance];

      app.scene.addModel(model);


      mesh.cb_tag = type + "mesh";

      return mesh.id;
    }

    if (type in lightTypes) {
      var light = new pc.Entity('light');
      light.addComponent('light');
      app.root.addChild(light);

      light.cb_tag = type + "light";

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
    //updateScene: updateScene,
    render: render,
    add: add,
    display: display,
    set: set
  }
}