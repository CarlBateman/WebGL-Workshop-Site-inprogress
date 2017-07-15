/// <reference path="../../libs/three-r84/three.js" />
"use strict"
window.addEventListener('DOMContentLoaded', function () {
  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  var numSegs = new THREE.Vector3(12, 12, 12);
  var size = new THREE.Vector3(3, 2, 1);

  var radius = 0.2;
  var offset = size.clone().divideScalar(2).subScalar(radius);

  var geometry = new THREE.BoxGeometry(offset.x, offset.y, offset.z, numSegs.x, numSegs.y, numSegs.z);

  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    v.normalize().multiplyScalar(radius);
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }

  var cubeMaterials = [];
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff3333 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff8800 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xffff33 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x33ff33 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x3333ff }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x8833ff }));

  for (var i = 0; i < 6; i++) {
    cubeMaterials[i].wireframe = true;
  }

  var material = new THREE.MultiMaterial(cubeMaterials);
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  (function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  })();
});