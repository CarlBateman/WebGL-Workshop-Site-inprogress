/// <reference path="../../libs/require/require.js" />
/// <reference path="../../libs/three-r83/three.js" />

/* text.js must be in base directory (or set base accordingly)
 * can't be renamed either
 * 
 * To use require to load glsl (frag, vert, c) need server (uses XHR)
 * server also needs appropriate mime type
 * 
 * Anyway, not a good idea, "OK" for one or two shaders but dumb for multiple files
 */


"use strict";

require(["../../libs/three-r83/three.js", "text!frag.glsl", "text!vert.glsl"], function (THREE, frag, vert) {;

  function createMaterial() {
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColour: { type: "v4", value: new THREE.Vector4(1, 0, 0, 1) },
      },
      //attributes: {},
      vertexShader: vert,
      fragmentShader: frag
    });

    return shaderMaterial;
  }



  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(15, 15, 15, 10, 10, 10);
  //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var material = createMaterial();
  material.wireframe = true;

  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  var render = function () {
    requestAnimationFrame(render);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  render();
});