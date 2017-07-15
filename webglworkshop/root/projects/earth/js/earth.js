var scene = new THREE.Scene();
var renderer;
var camera;

window.addEventListener ?
window.addEventListener("load", init, false) :
window.attachEvent && window.attachEvent("onload", init);

window.addEventListener('resize', function (event) {
  var w = window.innerWidth;
  var h = window.innerHeight * .3;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.setViewOffset(w * 1.6, h, w * 0, h * 0, w, h);
});

function init() {
  camera = createCamera();
  renderer = addRenderer(document.getElementById("earth"));
  var earth = addEarth(scene);
  var clouds = addClouds(scene);

  createLight(scene);

  var render = function () {
    requestAnimationFrame( render );

    earth.rotation.y += 0.001;
    clouds.rotation.y += 0.0015;

    scene.getObjectByName("sun").rotation.y+=0.001;

    renderer.render(scene, camera);
  };

  render();
}

function addEarth(scene) {
  var axialTilt = new THREE.Object3D();
  axialTilt.rotation.z = 0.41;
  scene.add(axialTilt);

  var geometry = new THREE.SphereGeometry(2.5, 32, 32);
  var material = createEarthMaterial();
  var sphere = new THREE.Mesh(geometry, material);
  sphere.name = "earth";
  axialTilt.add(sphere);
  return sphere;
}

function addClouds(scene) {
  var geometry = new THREE.SphereGeometry(2.51, 32, 32);

  var cloudsTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load("imgs/fair_clouds_1k.png", function (image) {
    cloudsTexture.image = image;
    cloudsTexture.needsUpdate = true;
  });

  var cloudsMaterial = new THREE.MeshPhongMaterial();
  cloudsMaterial.map = cloudsTexture;
  cloudsMaterial.transparent = true;

  var sphere = new THREE.Mesh(geometry, cloudsMaterial);
  sphere.name = "clouds";
  scene.add(sphere);
  return sphere;
}

function createEarthMaterial() {
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load("imgs/earthmap2k.jpg", function (image) {
    earthTexture.image = image;
    earthTexture.needsUpdate = true;
  });

  var normalTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load("imgs/earth_normalmap_flat2k.jpg", function (image) {
    normalTexture.image = image;
    normalTexture.needsUpdate = true;
  });

  var specularTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load("imgs/earthspec2k.jpg", function (image) {
    specularTexture.image = image;
    specularTexture.needsUpdate = true;
  });

  var earthMaterial = new THREE.MeshPhongMaterial();
  earthMaterial.map = earthTexture;
  earthMaterial.normalMap = normalTexture;
  earthMaterial.normalScale = new THREE.Vector2(0.7, 0.7);
  earthMaterial.specularMap = specularTexture;
  earthMaterial.specular = new THREE.Color(0x262626);

  return earthMaterial;
}

function addRenderer(container) {
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  container.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight * .3);
  renderer.name = "renderer";
  return renderer;
}

function createCamera() {
  var w = window.innerWidth;
  var h = window.innerHeight * .3;
  var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.setViewOffset(w * 1.6, h, w * 0, h * 0, w, h);
  camera.position.z = 5;
  return camera;
}

function createLight(scene) {
  var lightHolder = new THREE.Object3D();
  lightHolder.name = "sun";
  scene.add(lightHolder);

  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-10, 0, 20);
  lightHolder.add(light);

  var ambient = new THREE.AmbientLight(0x606060);
  scene.add(ambient);

}