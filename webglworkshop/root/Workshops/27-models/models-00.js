"use strict";
window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  var gui = new dat.GUI();

  var options = {
    Points: true,
    Wireframe: false,
    Solid: false
  }

  //gui.add(options, 'material', { Solid: 0, Wireframe: 1, Point: 2 }).onChange(function () {
  //  //document.getElementById("Dropdown2").innerText = options.speed;
  //});
  gui.add(options, 'Points').onChange(function () {
    boxes.children[2].visible = options.Points;
    spheres.children[2].visible = options.Points;
  });
  gui.add(options, 'Wireframe').onChange(function () {
    boxes.children[1].visible = options.Wireframe;
    spheres.children[1].visible = options.Wireframe;
  });
  gui.add(options, 'Solid').onChange(function () {
    boxes.children[0].visible = options.Solid;
    spheres.children[0].visible = options.Solid;
  });


  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.x = -15;
  camera.position.y = 50/3;
  camera.position.z = 50/3;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.shadowMap.enabled = true;

  renderer.setClearColor(0x444466, 1);
  var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);


  var light = new THREE.AmbientLight(0x202020); // soft white light
  scene.add(light);

  var spotLight = new THREE.SpotLight(0xffffff, 1, 1000, Math.PI / 8);
  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024 * 4;
  spotLight.shadow.mapSize.height = 1024 * 4;

  spotLight.penumbra = 0.05;
  spotLight.shadow.camera.near = 5;
  spotLight.shadow.camera.far = 40000;
  spotLight.shadow.camera.fov = 30;
  spotLight.position.set(60, 300, 60);
  scene.add(spotLight);

  var materials = [];
  materials[0] = new THREE.MeshPhongMaterial({ color: 0xff8000 });
  materials[1] = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

  var size = 5;
  var spheres = new THREE.Object3D();
  spheres.position.y = 4.5;
  for (var i = 0; i < materials.length; i++) {
    var model = new THREE.Mesh(
      new THREE.SphereGeometry(size, 16, 16),
      materials[i]
    );
    model.castShadow = true;
    spheres.add(model);
    size += .01;
  }

  var model = new THREE.Points(
    new THREE.SphereGeometry(5, 16, 16),
    new THREE.PointsMaterial({ size:.1, color: 0xffffff })
  );
  model.castShadow = true;
  spheres.add(model);
  spheres.children[0].visible = false;
  spheres.children[1].visible = false;
  spheres.position.x = 5;

  scene.add(spheres);



  var boxes = new THREE.Object3D();
  boxes.position.y = 4.5;
  size = 5;
  for (var i = 0; i < materials.length; i++) {
    var model = new THREE.Mesh(
      new THREE.BoxGeometry(size,size,size),
      materials[i]
    );
    model.castShadow = true;
    boxes.add(model);
    size += .01;
  }
  var model = new THREE.Points(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.PointsMaterial({ size:.1, color: 0xffffff })
  );
  model.castShadow = true;
  boxes.add(model);

  boxes.children[0].visible = false;
  boxes.children[1].visible = false;
  boxes.position.x = -5;
  scene.add(boxes);


  ////////////////////////////////////////////////////
  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshPhongMaterial({ color: 0x118811 })
  );
  floor.receiveShadow = true;
  floor.rotateX(-Math.PI / 2);
  scene.add(floor);


  render();
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    orbitControl.update();


  }
}
