/// <reference path="../../libs/three-r84/three.js" />
/// <reference path="../../libs/datgui-0.6.3/dat.gui.js" />


"use strict"

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  // default scene
  setupScene();

  //optionsController.initialise();


  //////////////////////////////////////////////////////////////////////////////
  // to do next
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


  function getObjectProperties_OLD(object, propertyTypeName, parentPropertyName) {
    var properties = [];
  
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        // do stuff
        //console.log(pad + property, typeof (object[property]));
  
        if(Array.isArray(object[property])) continue;
        if (!object[property]) continue;
  
        if (typeof (object[property]) === "object") {
          if (object[property].constructor.name === propertyTypeName) {
            //console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            //console.log(parentPropertyName + "." + property, object[property]);
            //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  
            properties[parentPropertyName + "." + property] = object[property];
            console.log(properties);
  
          } else {
            getObjectProperties(object[property], propertyTypeName, parentPropertyName + "." + property);
          }
        }
      }
    }
    return properties;
  }

  function getObjectPropertiesDeep(object, propertyTypeName, parentPropertyName) {
    var properties = [];


    (function recurse(object, propertyTypeName, parentPropertyName) {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          // do stuff
          //console.log(pad + property, typeof (object[property]));

          if (Array.isArray(object[property])) continue;
          if (!object[property]) continue;

          if (typeof (object[property]) === "object") {
            if (object[property].constructor.name === propertyTypeName) {
              //console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
              //console.log(parentPropertyName + "." + property, object[property]);
              //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

              properties[parentPropertyName + "." + property] = object[property];
              console.log(properties);

            } else {
              recurse(object[property], propertyTypeName, parentPropertyName + "." + property);
            }
          }
        }
      }
    })(object, propertyTypeName, parentPropertyName);

    return properties;
  }

  function getObjectProperties(object, propertyTypeName, parentPropertyName) {
    var properties = [];

    (function recurse(object, propertyTypeName, parentPropertyName) {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          if (Array.isArray(object[property])) continue;
          if (!object[property]) continue;

          if (typeof (object[property]) === "object") {
            if (object[property].constructor.name === propertyTypeName) {
              properties[property] = object[property];
            } else {
              recurse(object[property], propertyTypeName, parentPropertyName + "." + property);
            }
          }
        }
      }
    })(object, propertyTypeName, parentPropertyName);

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
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);


    scene.add(cube);

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    var transformControl = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transformControl);

    var gui, param = { color: '0xffffff' };;
    buildGui();
    function buildGui() {
      clearGui();
      addGui('light color', spotLight.color.getHex(), function (val) {
        spotLight.color.setHex(val);
        render();
      }, true);
      addGui('intensity', spotLight.intensity, function (val) {
        spotLight.intensity = val;
        render();
      }, false, 0, 2);
      addGui('distance', spotLight.distance, function (val) {
        spotLight.distance = val;
        render();
      }, false, 0, 200);
      addGui('angle', spotLight.angle, function (val) {
        spotLight.angle = val;
        render();
      }, false, 0, Math.PI / 3);
      addGui('penumbra', spotLight.penumbra, function (val) {
        spotLight.penumbra = val;
        render();
      }, false, 0, 1);
      addGui('decay', spotLight.decay, function (val) {
        spotLight.decay = val;
        render();
      }, false, 1, 2);
    }

    var properties = getObjectProperties(cube.material, THREE.Color.name, "");
    addGUIfolder(properties);
    //buildGui();


    dat.GUI.prototype.removeFolder = function (name) {
      var folder = this.__folders[name];
      if (!folder) {
        return;
      }
      folder.close();
      this.__ul.removeChild(folder.domElement.parentNode);
      delete this.__folders[name];
      this.onResize();
    }


    //gui.removeFolder("Material");


    function addGUIfolder(properties) {
      //param.material = [];
      //var folder = gui.addFolder("Material");

      //addGui('Color', props[".material.color"].getHex(), function (val) {
      //  props[".material.color"].setHex(val);
      //  render();
      //}, true);

      var folder =addFolder("Material");

      for (var propertyName in properties) {
        var property = properties[propertyName];
        addColorToFolder(folder, propertyName, property.getHex(), setProperty(property));
      }

      function setProperty(propertyName) {
        return function (val) {
          propertyName.setHex(val);
          render();
        };
      }

      function addFolder(folderName) {
        var folder = gui.addFolder(folderName);
        folder.open();
        return folder;
      }

      function addColorToFolder(folder, name, value, callback) {
        var node;
        param[name] = value;
        node = folder.addColor(param, name).onChange(function () {
          callback(param[name]);
        });
      }
    }

    //function addGUIfolder(/*gui, cube,*/ props) {
    //  //param.material = [];
    //  var folder = gui.addFolder("flibble");
    //  for (var p in props) {
    //    folder.addColor(p, name).onChange(function () {
    //      param[name] = value;
    //      callback(param[name]);
    //    })
    //  }
    //}

    function addGui(name, value, callback, isColor, min, max) {
      var node;
      param[name] = value;
      if (isColor) {
        node = gui.addColor(param, name).onChange(function () {
          callback(param[name]);
        });
      } else if (typeof value == 'object') {
        node = gui.add(param, name, value).onChange(function () {
          callback(param[name]);
        });
      } else {
        node = gui.add(param, name, min, max).onChange(function () {
          callback(param[name]);
        });
      }
      return node;
    }

    function clearGui() {
      if (gui) gui.destroy();
      gui = new dat.GUI();
      gui.open();
    }



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