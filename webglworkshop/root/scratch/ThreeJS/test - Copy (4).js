/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="../../libs/datgui/dat.gui.js" />
/// <reference path="../../libs/three-r84/TransformorbitControl.js" />

"use strict"
window.addEventListener('DOMContentLoaded', function () {
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var objects = [];
  document.addEventListener('mousedown', onDocumentMouseDown, false);

  var properties = {
    radius: 0.1,
    numSegs: new THREE.Vector3(12, 12, 12),
    size: new THREE.Vector3(2, 2, 2),
    scale: new THREE.Vector3(1, 1, 1),
    wireframe: false,
    boundingbox: true,
  }
  var gui = new dat.GUI();
  gui.add(properties, "radius", 0.01, 2).step(0.01).onChange(updateCube1);
  gui.add(properties.size, "x", 0.01, 4).name("size x").step(0.01).onChange(updateCube1);
  gui.add(properties.size, "y", 0.01, 4).name("size y").step(0.01).onChange(updateCube1);
  gui.add(properties.size, "z", 0.01, 4).name("size z").step(0.01).onChange(updateCube1);
  gui.add(properties.size, "x", 0.01, 4).name("scale x").step(0.01).onChange(updateCube1);
  gui.add(properties.size, "y", 0.01, 4).name("scale y").step(0.01).onChange(updateCube1);
  gui.add(properties.size, "z", 0.01, 4).name("scale z").step(0.01).onChange(updateCube1);
  gui.add(properties.numSegs, "x", 1, 24).name("numSegs x").step(1).onChange(updateCube1);
  gui.add(properties.numSegs, "y", 1, 24).name("numSegs y").step(1).onChange(updateCube1);
  gui.add(properties.numSegs, "z", 1, 24).name("numSegs z").step(1).onChange(updateCube1);
  gui.add(properties, "wireframe").onChange(updateCube1);
  gui.add(properties, "boundingbox").onChange(updateCube1);

  function updateCube1() {
    var scale = cube1.scale;
    var i = objects.findIndex(function (el) {
      return el === cube1;
    });
    objects.splice(i, 1);
    scene.remove(cube1);
    cube1 = diceFillet(properties);
    cube1.scale.x = scale.x;
    cube1.scale.y = scale.y;
    cube1.scale.z = scale.z;
    scene.add(cube1);
    objects.push(cube1);



    //var i = objects.findIndex(function (el) {
    //  return el === outlinegeometry;
    //});
    scene.remove(outlineCube);
    var outlinegeometry = new THREE.BoxGeometry(properties.size.x, properties.size.y, properties.size.z);
    outlinematerial.wireframe = true;
    outlineCube = new THREE.Mesh(outlinegeometry, outlinematerial);
    outlineCube.scale.x = scale.x;
    outlineCube.scale.y = scale.y;
    outlineCube.scale.z = scale.z;
    outlineCube.visible = properties.boundingbox;
    scene.add(outlineCube);
  }

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);

  function diceClip(properties) {
    var geometry = new THREE.BoxGeometry(properties.size.x, properties.size.y, properties.size.z, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);
    var cubeMaterials = [];
    cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff3333 }));
    cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xff8800 }));
    cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x3333ff }));
    //cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xffff33 }));
    cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x33ff33 }));
    cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    cubeMaterials.push(new THREE.MeshBasicMaterial({ color: 0x8833ff }));

    for (var i = 0; i < 6; i++) {
      cubeMaterials[i].wireframe = properties.wireframe;
    }

    var material = new THREE.MultiMaterial(cubeMaterials);
    return new THREE.Mesh(geometry, material);
  }

  function diceFillet(properties) {
    var radius2 = properties.radius * 2;
    var offset = properties.size.clone().divideScalar(2).subScalar(properties.radius);

    var geometry = new THREE.BoxGeometry(radius2, radius2, radius2, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);

    var old_vertices = [];
    for (var i = 0; i < geometry.vertices.length; i++) {
      var v = geometry.vertices[i];
      old_vertices.push(v.clone());
      v.x += Math.sign(v.x) * offset.x;
      v.y += Math.sign(v.y) * offset.y;
      v.z += Math.sign(v.z) * offset.z;
    }
    assignUVs(geometry, properties.size);

    geometry.vertices = old_vertices;
    for (var i = 0; i < geometry.vertices.length; i++) {
      var v = geometry.vertices[i];
      v.normalize().multiplyScalar(properties.radius);
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
      cubeMaterials[i].wireframe = properties.wireframe;
    }

    var material = new THREE.MultiMaterial(cubeMaterials);
    return new THREE.Mesh(geometry, material);
  }


  var cube1 = diceFillet(properties);
  objects.push(cube1);
  scene.add(cube1);

  var cube2 = diceClip(properties);
  cube2.visible = false;
  objects.push(cube2);
  scene.add(cube2);

  
  var outlinegeometry = new THREE.BoxGeometry(properties.size.x, properties.size.y, properties.size.z);
  var outlinematerial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
  outlinematerial.wireframe = true;
  var outlineCube = new THREE.Mesh(outlinegeometry, outlinematerial);
  scene.add(outlineCube);


  var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
  var transformControl = new THREE.TransformControls(camera, renderer.domElement);

  transformControl.addEventListener('change', render);
  transformControl.setMode("scale");
  //transformControl.attach(cube1);
  scene.add(transformControl);

  render();
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    orbitControl.update();
    transformControl.update();
  };

  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    var state = false;
    if (intersects.length > 0) {
      transformControl.attach(intersects[0].object);
    } else {
      transformControl.detach();
      state = true;
    }
  }

  // modified version of
  // http://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate  
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
});