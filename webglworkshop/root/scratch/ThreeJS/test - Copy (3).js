/// <reference path="../../libs/three-r84/three.js" />
"use strict"
window.addEventListener('DOMContentLoaded', function () {
  var gui01 = new dat.GUI();

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.z = 2.5;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  var numSegs = new THREE.Vector3(12, 12, 12);
  var size = new THREE.Vector3(1,1, 1);

  var radius = 0.5;
  var offset = size.clone().divideScalar(2).subScalar(radius);

  // width, height and depth don't matter here as they're over-ridden later
  // use 2 as it's easy to work with
  //var geometry = new THREE.BoxGeometry(2, 2, 2, numSegs.x, numSegs.y, numSegs.z);
  var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, numSegs.x, numSegs.y, numSegs.z);
  //var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, 1,1,1);
  //var geometry = new THREE.BoxGeometry(2, 2, 2, 1,1,1);

  //var err = 

  //var g;
  //for (var i = 0; i < geometry.faceVertexUvs[0].length; i++) {
  //  g = geometry.faceVertexUvs[0][i];
  //}

  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    v.normalize().multiplyScalar(radius);
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }
  assignUVs(geometry, size);

  var loader = new THREE.TextureLoader();
  var texture = loader.load("homer.gif");

  var cubeMaterials = [];
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff3333 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff8800 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x3333ff }));
  //cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xffff33 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x33ff33 }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture }));
  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x8833ff }));

  for (var i = 0; i < 6; i++) {
    //cubeMaterials[i].wireframe = true;
  }

  var material = new THREE.MultiMaterial(cubeMaterials);
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  (function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  })();

  // modified version from
  // http://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
  function assignUVs(geometry, offset) {
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function (face) {
      var components = ['x', 'y', 'z'].sort(function (a, b) {
        return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
      });

      var v1 = geometry.vertices[face.a];
      var v2 = geometry.vertices[face.b];
      var v3 = geometry.vertices[face.c];

      var scale = new THREE.Vector2(offset[components[0]], offset[components[1]]);

      var s = 1.025;

      var t1 = new THREE.Vector2(v1[components[0]], v1[components[1]]);
      t1.divide(scale).multiplyScalar(s).addScalar(.5);

      var t2 = new THREE.Vector2(v2[components[0]], v2[components[1]]);
      t2.divide(scale).multiplyScalar(s).addScalar(.5);

      var t3 = new THREE.Vector2(v3[components[0]], v3[components[1]]);
      t3.divide(scale).multiplyScalar(s).addScalar(.5);

      geometry.faceVertexUvs[0].push([
          new THREE.Vector2(t1.x, t1.y),
          new THREE.Vector2(t2.x, t2.y),
          new THREE.Vector2(t3.x, t3.y),
      ]);
    });
  }
});