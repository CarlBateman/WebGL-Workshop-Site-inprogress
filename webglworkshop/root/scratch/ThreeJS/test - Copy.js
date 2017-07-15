/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="../../libs/datgui/dat.gui.js" />
/// <reference path="../../libs/three-r84/TransformControls.js" />

"use strict"
window.addEventListener('DOMContentLoaded', function () {
  var gui = new dat.GUI();
  var obj = { add: function () { console.log("clicked") } };

  gui.add(obj, 'add');

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  var numSegs = new THREE.Vector3(12, 12, 12);
  var size = new THREE.Vector3(2, 2, 2);

  var radius = 1;
  var radius2 = radius * 2;
  var offset = size.clone().divideScalar(2).subScalar(radius);

  var geometry = new THREE.BoxGeometry(radius2, radius2, radius2, numSegs.x, numSegs.y, numSegs.z);

  var old_vertices = [];
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    old_vertices.push(v.clone());
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }
  assignUVs(geometry, size);//offset.clone().multiplyScalar(2).addScalar(radius));//size.clone().divideScalar(2).addScalar(radius*2));//.subScalar(radius));//

  var offset = size.clone().divideScalar(2).subScalar(radius);
  geometry.vertices = old_vertices;
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    v.normalize().multiplyScalar(radius);
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }

  var loader = new THREE.TextureLoader();
  var texture = loader.load("homer.gif");
  //var texture = loader.load("jJj2cw6.png");
  //var texture = loader.load("stripes-hori.png");
  //var texture = loader.load("stripes-vert.png");
  //var texture = loader.load("check.png");

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


  //var geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  //var material = new THREE.MeshBasicMaterial({ color: 0x000000 , map: texture});
  ////material.wireframe=true;
  //var cube = new THREE.Mesh(geometry, material);
  //cube.position.x = 2;
  //scene.add(cube);


  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  (function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  })();

  function assignUVs_SPhere(geometry) {
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function (face) {
      var uvs = [];
      var ids = ['a', 'b', 'c'];
      for (var i = 0; i < ids.length; i++) {
        var vertex = geometry.vertices[face[ids[i]]].clone();

        var n = vertex.normalize();
        var yaw = .5 - Math.atan(n.z, -n.x) / (2.0 * Math.PI);
        var pitch = .5 - Math.asin(n.y) / Math.PI;

        var u = yaw,
            v = pitch;
        uvs.push(new THREE.Vector2(u, v));
      }
      geometry.faceVertexUvs[0].push(uvs);
    });
  }

  function assignUVs(geometry, scale) {
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function (face) {
      var components = ['x', 'y', 'z'].sort(function (a, b) {
        return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
      });

      var v1 = geometry.vertices[face.a];
      var v2 = geometry.vertices[face.b];
      var v3 = geometry.vertices[face.c];

      var t1 = new THREE.Vector2(v1[components[0]], v1[components[1]]);
      var t2 = new THREE.Vector2(v2[components[0]], v2[components[1]]);
      var t3 = new THREE.Vector2(v3[components[0]], v3[components[1]]);

      var s = new THREE.Vector2(scale[components[0]], scale[components[1]]);
      geometry.faceVertexUvs[0].push([
          t1.divide(s).addScalar(.5),
          t2.divide(s).addScalar(.5),
          t3.divide(s).addScalar(.5)
      ]);
    });
  }

  // modified version from
  // http://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
  function assignUVs_OLD(geometry, offset) {
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function (face) {
      var components = ['x', 'y', 'z'].sort(function (a, b) {
        return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
      });

      var v1 = geometry.vertices[face.a];
      var v2 = geometry.vertices[face.b];
      var v3 = geometry.vertices[face.c];

      var scale = new THREE.Vector2(1,1);

      var s = 1.;

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