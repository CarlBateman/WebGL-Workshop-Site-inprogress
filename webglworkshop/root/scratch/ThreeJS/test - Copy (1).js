/// <reference path="../../libs/three-r84/three.js" />
"use strict"
window.addEventListener('DOMContentLoaded', function () {

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);


  var numCurveSegs = 3, radius = 1;
  var radius = 1;
  var numSegs = new THREE.Vector3(1, 1, 1);
  var size = new THREE.Vector3(6,6,6);

  // add num curve segs to each end - start and end
  var totSegs = numSegs.clone().addScalar(numCurveSegs * 2);
  var totStepSize = size.clone().divide(totSegs.clone());//.subScalar(1));


  var geometry = new THREE.BoxGeometry(1,1,1);
  //var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, totSegs.x, totSegs.y, totSegs.z);

  // offset vertices
  var edge = size.clone().divideScalar(2);
  var innerZoneSize = edge.clone().subScalar(radius);
  var innerZoneNumPts = new THREE.Vector3(1, 1, 1);

  var innerStepSize = innerZoneSize.clone().divide(numSegs);
  var outerStepSize = radius / numCurveSegs;


  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    var vabs = new THREE.Vector3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));

    // get ordinal position
    var iv = v.clone().divide(totStepSize);//.sub(size);
    iv.x = (Math.sign(iv.x) * 0.5 + iv.x);

    //if (vabs.x > innerZoneSize.x) {
    ////if (iv.x > numSegs.x || iv.x < -numSegs.x) {
    //  // outer curve zone
    //  iv.x -= (Math.sign(iv.x) * numSegs.x);
    //  v.x = iv.x * outerStepSize + Math.sign(iv.x) * innerZoneSize.x;
    //} else {
    //  // inner flat zone
    //  v.x = iv.x * innerStepSize.x;
    //}
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