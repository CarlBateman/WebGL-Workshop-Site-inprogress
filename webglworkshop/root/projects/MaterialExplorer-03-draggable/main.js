/// <reference path="adapter.js" />
/// <reference path="options.js" />
/// <reference path="scene.js" />

"use strict"

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
  Object.resolve = function (path, obj) {
    return path.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : undefined
    }, obj || self)
  }
  // set up controls
  // gui talks to adapter

  // displays properties for current object
  // adapter mediates with "current" engine

  // control
  //   material properties
  //   light colour, type
  //   model add/delete
  //         show/hide
  //         sub-divide
  //         type


  /*var viewEngine = new ViewEngine();
  viewEngine.addMaterial();
  viewEngine.removeMaterial();
  viewEngine.addMesh();
  viewEngine.addModel();
  viewEngine.addLight();
  viewEngine.engines.add(engine, name);
  viewEngine.engines.setCurrent(name);
  viewEngine.setupOptions(); //<- done when setCurrent???

  var viewThree =*/

  // default scene
  var light = Object.create(Light);
  light.type = "spot";
  light.position = [0,1,0];
  scene.lights.push(light);

  var mesh = Object.create(Mesh);
  mesh.type = "torus";
  scene.meshes.push(mesh);


  var adapter = makeAdapter();
  adapter.addEngine("Three.js", makeThree(scene));
  adapter.setEngine("Three.js");
  adapter.addEngine("Babylon.js", makeBabylon(scene));
  //adapter.setEngine("Babylon.js");

  setupScene();

  optionsController.initialise();
  optionsController.setEngine = adapter.setEngine;

  // add
  // position
  // scale
  // rotate
  // sub-divide
  // show/hide gizmos

  // switch

  // define materials

  //var id1 = adapter.add("box");
  //var id2 = adapter.add("torus");

  //console.log(id1, id2);

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