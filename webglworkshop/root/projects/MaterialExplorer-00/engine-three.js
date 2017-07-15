/// <reference path="../../libs/three-r84/three.js" />

function makeThree(stage) {
  var geometrya = { types: [], defaults: [] };
  geometrya.types["box"] = THREE.BoxBufferGeometry;
  geometrya.defaults["box"] = [1, 1, 1];
  geometrya.types["torus"] = THREE.TorusBufferGeometry;
  geometrya.defaults["torus"] = [10, 3, 16, 100];

  var lux = { types: [], defaults: [] };
  lux.types["spot"] = THREE.SpotLight;
  lux.defaults["spot"] = [0xffffff];
  lux.types["point"] = THREE.PointLight;
  lux.defaults["point"] = [0xffffff];

  //if ("spot" in lux.types) console.log("qqq");
  //if ("point" in lux.types) console.log("www");

  ///////////////////////////////////////////////////////////////////////

  var renderer = new THREE.WebGLRenderer({ alpha: true });

  var glCanvas = renderer.domElement;
  document.getElementById("view").insertBefore(glCanvas, document.getElementById("view").firstChild);
  //document.body.appendChild(glCanvas);

  renderer.setSize(glCanvas.clientWidth, glCanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, glCanvas.clientWidth / glCanvas.clientHeight, 0.1, 1000);
  camera.position.z = 50;
  ///////////////////////////////////////////////////////////////////////


  //var geometry = new THREE.TeapotBufferGeometry(2, 20, 2);
  //var geometry = new THREE.TorusGeometry(10, 3, 16, 100);

  //var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  function render() {
    //requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
    //lightControl.update();
    //targetControl.update();
  };


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  var defaultMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff0f });
  function add(type) {
    if (type in geometrya.types) {
      var mesh = new THREE.Mesh(new geometrya.types[type](...geometrya.defaults[type]), defaultMaterial);
      scene.add(mesh);
      return mesh.id;
    }

    if (type in lux.types) {
      var lighta = new lux.types[type](...lux.defaults[type]);
      scene.add(lighta);
      return lighta.id;
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

  glCanvas.style.display = "none";

  return { render: render, add: add, display: display, set: set };
}