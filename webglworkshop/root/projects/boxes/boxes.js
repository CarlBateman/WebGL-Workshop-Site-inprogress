"use strict"
window.addEventListener('DOMContentLoaded', function () {
  var propertiesFilleted = {
    radius: 0.1,
    numSegs: new THREE.Vector3(12, 12, 12),
    size: new THREE.Vector3(1, 1, 1),
    scale: new THREE.Vector3(1, 1, 1),
    texture: true,
  }

  var propertiesRounded = {
    radius: 0.65,
    numSegs: new THREE.Vector3(12, 12, 12),
    size: new THREE.Vector3(1, 1, 1),
    scale: new THREE.Vector3(1, 1, 1),
    texture: true,
    smooth: true,
  }

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.y = 2.5;
  camera.position.z = 2.5;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0x111144, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  gl

  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(15, 40, 35);
  spotLight.castShadow = true;
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.05;
  spotLight.decay = 1;
  spotLight.intensity = 1.5;
  spotLight.distance = 200;
  spotLight.shadow.mapSize.width = 2048 * 4;
  spotLight.shadow.mapSize.height = 2048 * 4;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 20;
  scene.add(spotLight);

  var light = new THREE.AmbientLight(0x404040);
  scene.add(light);


  var loader = new THREE.TextureLoader();
  var texture = loader.load("jJj2cw6.png");

  var s = THREE.SmoothShading;
  //var s = THREE.FlatShading;

  var boxMaterials = [];
  boxMaterials.push(new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shading: s }));
  boxMaterials.push(new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shading: s }));
  boxMaterials.push(new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shading: s }));
  boxMaterials.push(new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shading: s }));
  boxMaterials.push(new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shading: s }));
  boxMaterials.push(new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shading: s }));

  var boxMultiMaterial = new THREE.MultiMaterial(boxMaterials);

  var boxTextures = [];
  boxTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  boxTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  boxTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  boxTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  boxTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  boxTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));

  var boxMultiTexture = new THREE.MultiMaterial(boxTextures);

  var geos = [];


  for (var x = -5; x < 6; x++) {
    for (var z = 3; z < 10; z++) {
      var offz = z * 4 + Math.random() * 2 - 1;
      var offx = x * 2 + Math.random() * 2 - 1;
      var h = Math.ceil(Math.random() * (z)) + 1;

      for (var y = 0; y < h; y++) {
        switch (Math.floor(Math.random() * 3)) {
          case 0:
            var boxGeometry = makeBoxFilletGeometry(propertiesFilleted);
            break;
          case 1:
            var boxGeometry = makeRoundedCubeGeometry(propertiesRounded);
            break;
          case 2:
            var boxGeometry = makePunchedCubeGeometry(propertiesRounded);
        }
        var box = new THREE.Mesh(boxGeometry, boxMultiTexture);
        box.position.x = offx + Math.random() * .3 - .15;
        box.position.z = -offz + Math.random() * .3 - .15;
        box.position.y = y;

        box.rotateY(Math.random() * Math.PI);

        box.castShadow = true;
        scene.add(box);

        //if (x === 10) {
        //  renderer.render(scene, camera);

        //}
      }
    }
  }


  //for (var i = 0; i < box.material.materials.length; i++) {
  //  boxMultiTexture.materials[i].wireframe = true;
  //  boxMultiMaterial.materials[i].wireframe = true;
  //  box.material.materials[i].wireframe = true;
  //}

  var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControl.target = new THREE.Vector3(0, 2.5, -1);
  //camera.lookAt(new THREE.Vector3(0, 2.5, 100));

  render();
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    orbitControl.update();
  };
});