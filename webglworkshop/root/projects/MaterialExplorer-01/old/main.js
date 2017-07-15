/// <reference path="../../libs/three-r84/three.js" />


"use strict"

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  // default scene
  setupScene();

  optionsController.initialise();


  //////////////////////////////////////////////////////////////////////////////
  // to do next
  //
  // add light helper
  // show move target
  // show properties of selection
  //
  //////////////////////////////////////////////////////////////////////////////




  // add
  // position
  // scale
  // rotate
  // sub-divide
  // show/hide gizmos

  // define materials

  (function render() {
    requestAnimationFrame(render);
  })();


  function setupScene() {
    document.addEventListener('mousedown', onDocumentMouseDown(), false);

    function onDocumentMouseDown() {
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      var objects = [];
      var box;
      var selected;


      //var material = new THREE.LineDashedMaterial({
      //  color: 0x0000FF,
      //  linewidth: 2,
      //  scale: 2,
      //  dashSize: 3,
      //  gapSize: 3,
      //});

      return function (event) {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children);

        //if (selected) {
        //  selected.remove(box);
        //  box = null;
        //}

        if (intersects.length > 0) {
          selected = intersects[0].object;

          transformControl.attach(selected);
          //box = new THREE.BoxHelper(selected, 0x00000);
          
          //var box1 = new THREE.BoxHelper(selected, 0x00000);//new THREE.Line( selected.geometry, new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2 } ), THREE.LinePieces );//
          //var geo = new THREE.BoxGeometry(10,10,10)
          ////geo.computeLineDistances();
          //box = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: 0xffaa00, dashSize: 30, gapSize: 1, linewidth: 2 }), THREE.LinePieces);//



          //selected.geometry
          //box.material = material;
          box.position.x = -selected.position.x;
          box.position.y = -selected.position.y;
          box.position.z = -selected.position.z;
          selected.add(box);

          orbitControl.enablePan = false;
          orbitControl.enableRotate = false;
          orbitControl.enableZoom = false;
        } else {
          transformControl.detach();
          orbitControl.enablePan = true;
          orbitControl.enableRotate = true;
          orbitControl.enableZoom = true;
        }
      }
    }



    var glCanvas = document.getElementById("glcanvas");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, glCanvas.clientWidth / glcanvas.clientHeight, 0.1, 1000);
    camera.position.z = 50;

    var renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true });
    renderer.setSize(glCanvas.clientWidth, glcanvas.clientHeight);
    renderer.setClearColor(0xEEEEEE, 1);

    
    var lightMarker = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshBasicMaterial()
    );
    scene.add(lightMarker);

    //color, intensity, distance, angle, penumbra, decay
    var light = new THREE.SpotLight( 0xffffff, 1, 100, Math.PI/8 );
    lightMarker.add(light);
    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);
    scene.add(lightTarget);
    light.target = lightTarget;

    var spotLightHelper = new THREE.SpotLightHelper(light);
    spotLightHelper.cone.material.color.set(0, 0, 0);
    scene.add(spotLightHelper);
    //var lightControl = new THREE.TransformControls(camera, renderer.domElement);
    //lightControl.attach(light);
    //scene.add(lightControl);

    //var targetControl = new THREE.TransformControls(camera, renderer.domElement);
    //targetControl.attach(lightTarget);
    //scene.add(targetControl);




    //var geometry = new THREE.TeapotBufferGeometry(2, 20, 2);
    var geometry = new THREE.TorusGeometry(10, 3, 16, 100);

    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    var transformControl = new THREE.TransformControls(camera, renderer.domElement);
  scene.add(transformControl);


 

    (function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      orbitControl.update();
      //lightControl.update();
      //targetControl.update();
    })();
  }
}