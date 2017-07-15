function makeThree() {
  var glCanvas = document.getElementById("glcanvas");

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.z = 50;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  var light = new THREE.SpotLight(0xffffff);
  scene.add(light);
  var lightTarget = new THREE.Object3D();
  lightTarget.position.set(0, 0, 0);
  scene.add(lightTarget);
  light.target = lightTarget;


  var lightControl = new THREE.TransformControls(camera, renderer.domElement);
  lightControl.attach(light);
  scene.add(lightControl);

  var targetControl = new THREE.TransformControls(camera, renderer.domElement);
  targetControl.attach(lightTarget);
  scene.add(targetControl);




  //var geometry = new THREE.TeapotBufferGeometry(2, 20, 2);
  var geometry = new THREE.TorusGeometry(10, 3, 16, 100);

  var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  function render() {
    //requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
    lightControl.update();
    targetControl.update();
  };

  var geometry = { types: [], defaults: [] };
  //geometry.types["box"] = new THREE.BoxGeometry(1, 1, 1);
  geometry.types["box"] = THREE.BoxBufferGeometry;
  geometry.defaults["box"] = [1,1,1];
  geometry.types["torus"] = THREE.TorusBufferGeometry;
  geometry.defaults["torus"] = [4, 3, 16, 10];


  var defaultMaterial = new THREE.MeshLambertMaterial({ color: 0x0f0f0f });
  function add(type) {
    if (type in geometry.types) {
      var mesh = new THREE.Mesh(new geometry.types[type](...geometry.defaults[type]), defaultMaterial);
      scene.add(mesh);
      return mesh.id;
    }
  }

  function set(id, property, value) { }
  function remove(id) { }
  function replace(id, type) { }

  return { render: render, add:add };
}