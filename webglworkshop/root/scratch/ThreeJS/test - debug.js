/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="../../libs/datgui/dat.gui.js" />

"use strict"
window.addEventListener('DOMContentLoaded', function () {
  var properties = {
    smooth: true,
  }

  var gui = new dat.GUI();
  gui.add(properties, "smooth").onChange(updateCubeSmooth);


  function updateCubeSmooth() {
    var s = THREE.FlatShading;
    if (properties.smooth) s = THREE.SmoothShading;

    for (var i = 0; i < mesh.material.materials.length; i++) {

      mesh.material.materials[i].shading = s;//properties.smooth ? THREE.SmoothShading : THREE.FlatShading;
      mesh.material.materials[i].needsUpdate = true;
    }
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
  }


  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(15, 40, 35);
  spotLight.angle = Math.PI / 4;
  scene.add(spotLight);


  var geometry = new THREE.BoxGeometry(2,2,2, 20,20,20);
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    geometry.vertices[i]=v.normalize();
  }
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  //geometry.computeFlatVertexNormals();


  var cubeMaterials = [];
  var s = THREE.FlatShading;// THREE.SmoothShading ;//
  //cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xffff33, shading:s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xff3333, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xff8800, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0x3333ff, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0x33ff33, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0x8833ff, shading: s }));



  var material = new THREE.MultiMaterial(cubeMaterials);

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var vnhelper = new THREE.VertexNormalsHelper( mesh, .5, 0x00ff00, .1 );
  //scene.add(vnhelper);

  var fnhelper = new THREE.FaceNormalsHelper( mesh, .5, 0xff0000, .1 );
  //scene.add(fnhelper);

  var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

  render();
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    orbitControl.update();
  };

});