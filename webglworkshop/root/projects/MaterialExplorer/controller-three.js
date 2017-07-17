/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="scene.js" />

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
    ambientLight.cb_tag = "ignore";
    scene.add(ambientLight);
  }

  function clearAll() {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    scene.add(ambientLight);
  }

  function getScene() {
    var sceneGeneric = makeScene();

    sceneGeneric.cameraPos = camera.position.toArray();

    for (var i = 0; i < scene.children.length; i++) {
      var item = scene.children[i];
      var type = item.cb_tag;//item.type.toLowerCase();

      if (type === "ignore") continue;

      if (type.includes("light")) {
        if (type.includes("ambient")) {
          sceneGeneric.ambient = item.color.toArray();
        } else {
          var light = makeLight();
          light.type = type.replace("light", "");
          light.position = item.position;
          light.direction = type === "spotlight" ? item.target.position : item.target.position;

          sceneGeneric.lights.push(light);
        }
      } else if (type.includes("mesh")) {
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
    renderer.setClearColor(new THREE.Color(...sceneGeneric.background));
    ambientLight.color = new THREE.Color(...sceneGeneric.ambient);
    camera.position.set(...sceneGeneric.cameraPos);

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

  var defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  function add(item) {
    var type = item.type;
    if (type in geometryTypes) {
      var mesh = new THREE.Mesh(new geometryTypes[type](...geometryDefaults[type]), defaultMaterial);
      scene.add(mesh);

      mesh.cb_tag = type + "mesh";

      return mesh.id;
    }

    if (type in lightTypes) {
      var light = new lightTypes[type](...lightDefaults[type]);
      scene.add(light);

      light.cb_tag = type + "light";

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