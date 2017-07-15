/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="../../libs/datgui-0.6.3/dat.gui.js" />
/// <reference path="gui-options.js" />
"use strict"

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  // default scene
  setupScene();



  //////////////////////////////////////////////////////////////////////////////
  // to do next
  // 
  // get it working
  // then tidy
  // 
  // Three.js
  // Babylon.js
  // PlayCanvas
  // 
  // add spotLight helper
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



  function getObjectProperties(object, propertyTypeName) {
    var properties = [];

    (function recurse(object, propertyTypeName, parentPropertyName) {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          if (Array.isArray(object[property])) continue;
          if (!object[property]) continue;

          if (typeof (object[property]) === "object") {
            if (object[property].constructor.name === propertyTypeName) {
              properties[property] = object[property];
            //} else {
            //  recurse(object[property], propertyTypeName, parentPropertyName + "." + property);
            }
          }
        }
      }
    })(object, propertyTypeName, "");

    return properties;
  }

  function setupScene() {
    document.addEventListener('mousedown', onDocumentMouseDown(), false);
    function onDocumentMouseDown() {
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      var objects = [];
      var selected;

      return function (event) {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
          selected = intersects[0].object;

          //console.log(selected.type);

          setGUIforSelection(selected);

          transformControl.attach(selected);

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


      var materials = [];
      materials[THREE.MeshBasicMaterial.constructor.name] = THREE.MeshBasicMaterial;
      materials[THREE.MeshLambertMaterial.constructor.name] = THREE.MeshLambertMaterial;
      materials[THREE.MeshPhongMaterial.constructor.name] = THREE.MeshPhongMaterial;

      function setGUIforSelection(selected) {
        if (selected.constructor.name === THREE.Mesh.name) {
          if (selected.children.length > 0) {
            if (selected.children[0].constructor.name === THREE.SpotLight.name) {
              options.buildGui(selected.children[0])
            }
          } else {
            options.clearGui();
            var properties = getObjectProperties(selected.material, THREE.Color.name);

            options.addMaterialsFolder(selected.material.type, properties);
            //console.log(selected.material);
          }
        }
      }
    }

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
    lightMarker.position.set(0, 20, 0);

    //color, intensity, distance, angle, penumbra, decay
    var spotLight = new THREE.SpotLight( 0xffffff, 1, 100, Math.PI/8 );
    lightMarker.add(spotLight);
    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);
    scene.add(lightTarget);
    spotLight.target = lightTarget;

    var spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLightHelper.cone.material.color.set(0, 0, 0);
    scene.add(spotLightHelper);
    //var lightControl = new THREE.TransformControls(camera, renderer.domElement);
    //lightControl.attach(spotLight);
    //scene.add(lightControl);

    //var targetControl = new THREE.TransformControls(camera, renderer.domElement);
    //targetControl.attach(lightTarget);
    //scene.add(targetControl);




    //var geometry = new THREE.TeapotBufferGeometry(2, 20, 2);
    var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    //var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);


    scene.add(cube);

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    var transformControl = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transformControl);


 
    options.buildGui(spotLight);


 



    render();
    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      orbitControl.update();
      spotLightHelper.update();
      spotLightHelper.cone.material.color.set(0, 0, 0);

      //lightControl.update();
      //targetControl.update();
    };
  }
}