window.addEventListener ?
window.addEventListener("load", earth, false) :
window.attachEvent && window.attachEvent("onload", earth);

function earth() {
  var scene = new THREE.Scene();
  var renderer;
  var camera;
  var orbitControls = null;


  window.addEventListener('resize', function (event) {
    var w = renderer.domElement.parentElement.clientWidth;
    var h = renderer.domElement.parentElement.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  (function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //var cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    var light = new THREE.DirectionalLight(0xffffff, 2);
    var amb = new THREE.AmbientLight(0x404040);
    var d = 10;

    light.position.set(d, d, -d);
    scene.add(light);
    scene.add(amb);
    //createLight();

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);


    var manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    manager.onLoad = function () {
      console.log('Loading complete!');
    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    manager.onError = function (url) {
      console.log('There was an error loading ' + url);
    };

    var gltf;
    var loader = new THREE.GLTFLoader(manager);
    loader.load('evil-skull.gltf', function (data) {
      gltf = data;
      var object = gltf.scene;
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.translateY(child.position.y - 1);
        }
      });
      object.scale.set(5, 5, 5);
      duck = object;

      var axis = new THREE.AxisHelper(1000);
      duck.add(axis);
      duck.castShadow = true;
      duck.receiveShadow = true;
      scene.add(duck);
    });

    var render = function () {
      gltf;
      requestAnimationFrame(render);

      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;
      orbitControls.update();

      renderer.render(scene, camera);
    };

    render();
  })();
}