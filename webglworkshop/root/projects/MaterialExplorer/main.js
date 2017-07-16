/// <reference path="adapter.js" />
/// <reference path="options.js" />
/// <reference path="scene.js" />
/// <reference path="controller-babylon.js" />
/// <reference path="controller-three.js" />
/// <reference path="controller-playcanvas.js" />

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

  console.log("initial");
  console.log(scene);

  var controllers = [];
  controllers["Babylon.js"] = makeBabylonController(scene);
  //controllers["Babylon.js"].setScene(scene);
  controllers["Three.js"] = makeThreeController(scene);
  controllers["PlayCanvas.js"] = makePlayCanvasController(scene);

  var adapter = makeAdapter();
  adapter.addEngine("Three.js", controllers["Three.js"]);
  adapter.addEngine("Babylon.js", controllers["Babylon.js"]);
  adapter.addEngine("PlayCanvas.js", controllers["PlayCanvas.js"]);
  //adapter.setEngine("Three.js");
  //adapter.setEngine("Babylon.js");
  adapter.setEngine("PlayCanvas.js");

  optionsController.initialise();
  //optionsController.setEngine = adapter.setEngine;
  optionsController.adapter = adapter;

  (function render() {
    requestAnimationFrame(render);
    adapter.render();
  })();

}