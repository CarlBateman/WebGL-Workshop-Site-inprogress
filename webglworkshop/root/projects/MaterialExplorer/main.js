/// <reference path="adapter.js" />
/// <reference path="options.js" />
/// <reference path="scene.js" />
/// <reference path="controller-babylon.js" />
/// <reference path="controller-three.js" />

"use strict"

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  var scene = makeScene();

  // set up a "default" scene
  var light = makeLight();
  light.type = "spot";
  light.position = [0,1,0];
  scene.lights.push(light);

  var mesh = makeMesh();
  mesh.type = "torus";
  scene.meshes.push(mesh);

  var controllers = [];
  controllers["Babylon.js"] = makeBabylonController(scene);
  //controllers["Babylon.js"].setScene(scene);
  controllers["Three.js"] = makeThreeController(scene);

  var adapter = makeAdapter();
  adapter.addEngine("Three.js", controllers["Three.js"]);
  adapter.addEngine("Babylon.js", controllers["Babylon.js"]);
  adapter.setEngine("Three.js");
  //adapter.setEngine("Babylon.js");

  optionsController.initialise();
  //optionsController.setEngine = adapter.setEngine;
  optionsController.adapter = adapter;

  (function render() {
    requestAnimationFrame(render);
    adapter.render();
  })();

  function setupScene() {
    for (var i = 0; i < scene.lights.length; i++) {
      var id = adapter.add(scene.lights[i].type);
      adapter.set(id, "position", scene.lights[i].position);
    }

    scene.meshes.forEach(function (mesh) {
      var id = adapter.add(mesh.type);
      adapter.set(id, "position", mesh.position);
      adapter.set(id, "material.color", [1,1,1]);
    });

  }
}