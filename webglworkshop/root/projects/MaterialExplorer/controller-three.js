/// <reference path="../../libs/three-r84/three.js" />


function makeThreeController(sceneGeneric) {
  var glCanvas;
  var view;
  var renderer;
  var scene;
  var camera;
  var controls;
  var ambientLight;

  var lightTypes = [];
  lightTypes["spot"] = THREE.SpotLight;
  lightTypes["point"] = THREE.PointLight;
  lightTypes["hemi"] = THREE.HemisphericLight;
  lightTypes["dir"] = THREE.DirectionalLight;

  var lightDefaults = [];
  lightDefaults["spot"] = [0xffffff];
  lightDefaults["point"] = [0xffffff];
  lightDefaults["hemi"] = [0xffffff];
  lightDefaults["dir"] = [0xffffff];

  var geometryTypes = [];
  geometryTypes["box"] = THREE.BoxBufferGeometry;
  geometryTypes["torus"] = THREE.TorusBufferGeometry;
  geometryTypes["sphere"] = THREE.SphereBufferGeometry;
  geometryTypes["cylinder"] = THREE.CylinderBufferGeometry;

  var geometryDefaults = [];
  geometryDefaults["box"] = [5, 5, 5];
  geometryDefaults["torus"] = [2.5, 0.25, 16, 64];
  geometryDefaults["sphere"] = [ ];
  geometryDefaults["cylinder"] = [ ];

  function init() {
    renderer = new THREE.WebGLRenderer({ alpha: true });

    glCanvas = renderer.domElement;
    document.getElementById("view").insertBefore(glCanvas, document.getElementById("view").firstChild);

    renderer.setSize(glCanvas.clientWidth, glCanvas.clientHeight);
    renderer.setClearColor(0xEEEEEE, 1);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, glCanvas.clientWidth / glCanvas.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
  }

  function clearAll() {
  }

  function getScene() {
    var sceneGeneric;
    return sceneGeneric;
  }

  function setScene(sceneGeneric) {
    renderer.setClearColor(new THREE.Color(...sceneGeneric.background));
    ambientLight.color = new THREE.Color(...sceneGeneric.ambient);

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
    //requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
    //console.log(camera.position);
    //console.log(camera.getWorldPosition());
    //console.log(camera.getWorldDirection());

    //console.log(camera.setRotationFromMatrix);
    //console.log(camera.matrixWorld);

    return camera.position;

    //lightControl.update();
    //targetControl.update();
  };

  function updateScene(sceneState) {
    camera.position.x=sceneState.x;
    camera.position.y=sceneState.y;
    camera.position.z=sceneState.z;
    //camera.matrixWorldNeedsUpdate = true;
    //camera.updateMatrixWorld();
  }


  var defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  function add(item) {
    var type = item.type;
    if (type in geometryTypes) {
      var mesh = new THREE.Mesh(new geometryTypes[type](...geometryDefaults[type]), defaultMaterial);
      scene.add(mesh);
      return mesh.id;
    }

    if (type in lightTypes) {
      var light = new lightTypes[type](...lightDefaults[type]);
      scene.add(light);
      return light.id;
    }
  }

  function set(id, property, value) {
    var obj = scene.getObjectById(id);
    var prop = Object.resolve(property, obj);

    if (prop instanceof THREE.Color)
      prop.setRGB(...value);
    else
      prop.set(...value);
  }

  function remove(id) { }
  function replace(id, type) { }
  function display(value) { glCanvas.style.display = value; }

  init();
  if (sceneGeneric)
    setScene(sceneGeneric);
  glCanvas.style.display = "none";

  return { setScene: setScene, updateScene: updateScene, render: render, add: add, display: display, set: set };
}