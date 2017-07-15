/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="../../libs/datgui/dat.gui.js" />

"use strict"
window.addEventListener('DOMContentLoaded', function () {

  function makeCubeFillet(properties, multiMaterial) {
    var radius2 = properties.radius * 2;
    var offset = properties.size.clone().divideScalar(2).subScalar(properties.radius);

    var geometry = new THREE.BoxGeometry(radius2, radius2, radius2, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);

    var vertices = [];
    for (var i = 0; i < geometry.vertices.length; i++) {
      var v = geometry.vertices[i];
      vertices.push(v.clone());
      v.x += Math.sign(v.x) * offset.x;
      v.y += Math.sign(v.y) * offset.y;
      v.z += Math.sign(v.z) * offset.z;
    }
    assignUVs(geometry, properties.size);

    geometry.vertices = vertices;
    for (var i = 0; i < geometry.vertices.length; i++) {
      var v = geometry.vertices[i];
      v.normalize().multiplyScalar(properties.radius);
      v.x += Math.sign(v.x) * offset.x;
      v.y += Math.sign(v.y) * offset.y;
      v.z += Math.sign(v.z) * offset.z;
    }
    geometry.computeFaceNormals();
    geometry.computeFlatVertexNormals();
    geometry.computeVertexNormals();

    return new THREE.Mesh(geometry, multiMaterial);
  }

  // modified version of
  // http://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate  
  function assignUVs(geometry, scale) {
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function (face) {
      var components = ['x', 'y', 'z'].sort(function (a, b) {
        return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
      });

      var s = new THREE.Vector2(scale[components[0]], scale[components[1]]);
      var v1 = geometry.vertices[face.a];
      var v2 = geometry.vertices[face.b];
      var v3 = geometry.vertices[face.c];

      var t1 = new THREE.Vector2(v1[components[0]], v1[components[1]]);
      var t2 = new THREE.Vector2(v2[components[0]], v2[components[1]]);
      var t3 = new THREE.Vector2(v3[components[0]], v3[components[1]]);

      geometry.faceVertexUvs[0].push([
          t1.divide(s).addScalar(.5),
          t2.divide(s).addScalar(.5),
          t3.divide(s).addScalar(.5)
      ]);

      if (face.normal.x > 0) { t1.y = 1 - t1.y; t2.y = 1 - t2.y; t3.y = 1 - t3.y; }
      if (Math.abs(face.normal.x) > 0) { [t1.x, t1.y] = [t1.y, t1.x];[t2.x, t2.y] = [t2.y, t2.x];[t3.x, t3.y] = [t3.y, t3.x]; }


      if (face.normal.y > 0) { t1.y = 1 - t1.y; t2.y = 1 - t2.y; t3.y = 1 - t3.y; }
      if (face.normal.z < 0) { t1.x = 1 - t1.x; t2.x = 1 - t2.x; t3.x = 1 - t3.x; }
    });
  }

  var properties = initGUIandProperties();

  var glCanvas = document.getElementById("glcanvas");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
  renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
  renderer.setClearColor(0xEEEEEE, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshLambertMaterial({ color: 0xffeedd }));
  plane.rotateX(-Math.PI/2);
  plane.position.y = -1.1;
  plane.receiveShadow = true;
  scene.add(plane);

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

  var s = THREE.FlatShading;
  if (properties.smooth) s = THREE.SmoothShading;

  var cubeMaterials = [];
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xffff33, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xff3333, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0xff8800, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0x3333ff, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0x33ff33, shading: s }));
  cubeMaterials.push(new THREE.MeshPhongMaterial({ color: 0x8833ff, shading: s }));

  var cubeMultiMaterial = new THREE.MultiMaterial(cubeMaterials);

  var cubeTextures = [];
  cubeTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  cubeTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  cubeTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  cubeTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  cubeTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));
  cubeTextures.push(new THREE.MeshPhongMaterial({ color: 0xffffff, shading: s, map: texture }));

  var cubeMultiTexture = new THREE.MultiMaterial(cubeTextures);

  var cube = makeCubeFillet(properties, cubeMultiTexture);
  cube.castShadow = true;
  scene.add(cube);
  
  var boundGeometry = new THREE.BoxGeometry(properties.size.x, properties.size.y, properties.size.z);
  var boundMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
  boundMaterial.wireframe = true;
  var boundCube = new THREE.Mesh(boundGeometry, boundMaterial);
  scene.add(boundCube);

  var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

  render();
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    orbitControl.update();
  };

  function initGUIandProperties() {
    var properties = {
      radius: 0.5,
      numSegs: new THREE.Vector3(12, 12, 12),
      size: new THREE.Vector3(2, 2, 2),
      scale: new THREE.Vector3(1, 1, 1),
      texture: true,
      smooth: false,
      wireframe: false,
      boundingbox: true,
    }

    var gui = new dat.GUI();
    gui.add(properties, "radius", 0.1, 2).step(0.01).onChange(rebuildCube);
    gui.add(properties.size, "x", 0.01, 4).name("size x").step(0.01).onChange(rebuildCube);
    gui.add(properties.size, "y", 0.01, 4).name("size y").step(0.01).onChange(rebuildCube);
    gui.add(properties.size, "z", 0.01, 4).name("size z").step(0.01).onChange(rebuildCube);
    gui.add(properties.scale, "x", 0.01, 4).name("scale x").step(0.01).onChange(changeScale);
    gui.add(properties.scale, "y", 0.01, 4).name("scale y").step(0.01).onChange(changeScale);
    gui.add(properties.scale, "z", 0.01, 4).name("scale z").step(0.01).onChange(changeScale);
    gui.add(properties.numSegs, "x", 1, 24).name("numSegs x").step(1).onChange(rebuildCube);
    gui.add(properties.numSegs, "y", 1, 24).name("numSegs y").step(1).onChange(rebuildCube);
    gui.add(properties.numSegs, "z", 1, 24).name("numSegs z").step(1).onChange(rebuildCube);
    gui.add(properties, "texture").onChange(function () { changeTexture(properties.texture); });
    gui.add(properties, "smooth").onChange(updateCubeSmooth);
    gui.add(properties, "wireframe").onChange(function () { cubeWireframe(properties.wireframe); });
    gui.add(properties, "boundingbox").onChange(rebuildCube);

    function changeScale() {
      cube.scale.x = properties.scale.x;
      cube.scale.y = properties.scale.y;
      cube.scale.z = properties.scale.z;
      boundCube.scale.x = properties.scale.x;
      boundCube.scale.y = properties.scale.y;
      boundCube.scale.z = properties.scale.z;
    }

    function changeTexture(useTexture) {
      if (useTexture)
        cube.material = cubeMultiTexture;
      else
        cube.material = cubeMultiMaterial;
    }

    function cubeWireframe(wireframe) {
      for (var i = 0; i < cube.material.materials.length; i++) {
        cubeMultiTexture.materials[i].wireframe = wireframe;
        cubeMultiMaterial.materials[i].wireframe = wireframe;
        cube.material.materials[i].wireframe = wireframe;
      }
    }

    function updateCubeSmooth() {
      var s = THREE.FlatShading;
      if (properties.smooth) s = THREE.SmoothShading;

      for (var i = 0; i < cube.material.materials.length; i++) {
        cube.material.materials[i].shading = s;
        cube.material.materials[i].needsUpdate = true;

        cubeMultiTexture.materials[i].shading = s;
        cubeMultiTexture.materials[i].needsUpdate = true;

        cubeMultiMaterial.materials[i].shading = s;
        cubeMultiMaterial.materials[i].needsUpdate = true;
      }
    }

    function rebuildCube() {
      var multiMaterial = cube.material;

      scene.remove(cube);
      cube = makeCubeFillet(properties, multiMaterial);
      cube.scale.x = properties.scale.x;
      cube.scale.y = properties.scale.y;
      cube.scale.z = properties.scale.z;
      cube.castShadow = true;
      scene.add(cube);



      scene.remove(boundCube);
      boundCube.geometry = new THREE.BoxGeometry(properties.size.x, properties.size.y, properties.size.z);
      boundCube.material.wireframe = true;
      boundCube.scale.x = properties.scale.x;
      boundCube.scale.y = properties.scale.y;
      boundCube.scale.z = properties.scale.z;
      boundCube.visible = properties.boundingbox;
      scene.add(boundCube, multiMaterial);
    }
    return properties;
  }
});