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
    camera.zoom = 15;
    camera.updateProjectionMatrix();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    //var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var material = createMaterial()

    var light1 = new THREE.DirectionalLight(0xddddff, .5);
    var light2 = new THREE.DirectionalLight(0xffffdd, .5);
    var amb = new THREE.AmbientLight(0x404040);
    var d = 100;

    light1.position.set(d, d, d);
    light1.position.set(-d, d, d);
    scene.add(light1);
    scene.add(light2);
    scene.add(amb);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    var loader = new THREE.OBJLoader();
    loader.load('craneo.obj', function (data) {
      data.children[0].material = material;
      scene.add(data);
    });

    var render = function () {
      requestAnimationFrame(render);

      material.uniforms.time.value += 0.005;

      orbitControls.update();

      renderer.render(scene, camera);
    };

    render();
  })();

  function createMaterial() {
    var shaderMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0.2 },
        scale: { type: 'f', value: 0.02 },
        alpha: { type: 'f', value: 0.06 },
        resolution: { type: "v2", value: new THREE.Vector2(.5, .5) }
      },
      //attributes: {},
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });

    return shaderMaterial;
  }


}