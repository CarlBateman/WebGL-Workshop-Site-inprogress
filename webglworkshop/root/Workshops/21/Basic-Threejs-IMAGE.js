// adapted from http://threejs.org/examples/webgl_interactive_draggablecubes

var scene = new THREE.Scene();
var renderer;
var camera;
var container;
var raycaster;
var mouse = new THREE.Vector2();
var clock = new THREE.Clock();
var offset = new THREE.Vector3(), INTERSECTED, SELECTED;
var orbit, plane, objects = [];

window.addEventListener ?
window.addEventListener("load", init, false) :
window.attachEvent && window.attachEvent("onload", init);

window.addEventListener('resize', function (event) {
  var w = container.clientWidth;
  var h = container.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

function init() {
  container = document.getElementById("renderTarget");
  renderer = createRenderer(container);
  camera = createCamera(container);
  var shape = addShape(scene);

  orbit = new THREE.OrbitControls(camera, renderer.domElement);
  orbit.minPolarAngle = Math.PI / 3; // radians
  orbit.maxPolarAngle = 2 * Math.PI / 3; // radians
  orbit.object.position.z *= 1.25;

  var render = function () {
    orbit.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();
}

function addShape(scene) {
  //var geometry = new THREE.CylinderGeometry(5, 5, 30, 32, 100, true);
  var geometry = new THREE.PlaneGeometry(15, 15, 1, 1);
  //var material = new THREE.MeshBasicMaterial({ color: 0x888888 });
  var material = createMaterial_OLD ();
  var cylinder = new THREE.Mesh(geometry, material);
  scene.add(cylinder);
}

function createMaterial() {
  var smileyTexture = new THREE.TextureLoader().load("smiley.png");
  smileyTexture.needsUpdate = true;
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { type: "t", value: smileyTexture },
      uColour: { type: "v4", value: new THREE.Vector4(1, 0, 0, 1) },
    },
    //attributes: {},
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  return shaderMaterial;
}

function createCamera(container) {
  var w = container.clientWidth;
  var h = container.clientHeight;
  var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 30;
  return camera;
}

function createRenderer(container) {
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  renderer.setSize(container.clientWidth, container.clientHeight);
  return renderer;
}

function createMaterial_OLD() {
  var image = document.createElement('img');
  var texture = new THREE.Texture(image);
  texture.needsUpdate = true;


  //var smileyTexture = new THREE.TextureLoader().load("smiley.png");
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { type: "t", value: texture },
      uColour: { type: "v4", value: new THREE.Vector4(1, 0, 0, 1) },
    },
    //attributes: {},
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  image.onload = function () {
    texture.needsUpdate = true;
    //shaderMaterial.uniforms.texture.value = texture;
  };
  image.src = imgSmiley;

  /* 
  var image = new Image();
  image.src = imagesSource[0];
  var image = document.createElement("img"); //new Image();
  image.src = src.toDataURL("image/png");
  */
  return shaderMaterial;
}