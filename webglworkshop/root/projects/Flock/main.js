/// <reference path="flock.js" />

"use strict";
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

window.addEventListener ?
window.addEventListener("load", init, false) :
window.attachEvent && window.attachEvent("onload", init);

window.addEventListener('resize', function (event) {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
});

var scene = new THREE.Scene();
var renderer;
var camera;
var canvas;
var now = Date.now();
var elapsed = 0;

function init() {
  // flock demo
  //   -- dat-gui
  // flock object
  //   -- API
  // keep notionally separate from Three.js
  // 

  var flock = new Flock01();
  var boids3 = [];

  //console.log("xxx");
  //flock.update();
  //console.log("+++");


  canvas = document.getElementById("flock-display");
  camera = createCamera();
  renderer = addRenderer(canvas);
  addOrbitViewer();

  var geometry = new THREE.CylinderGeometry(0, 1, 2, 4);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  (function addBoidsToScene(flock) {
    var boids = flock.getBoids();
    for (var i = 0; i < boids.length; i++) {
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(boids[i].pos.x, boids[i].pos.y, boids[i].pos.z);
      cube.scale.set(.2, .25, .1);
      boids3.push(cube);
      scene.add(cube);
    }
  })(flock);

  function updateAvatars() {
    var boids = flock.getBoids();
    for (var i = 0; i < boids.length; i++) {
      boids3[i].position.set(boids[i].pos.x, boids[i].pos.y, boids[i].pos.z);
    }
  }

  function createCamera() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 15;
    return camera;
  }

  function addRenderer(container) {
    var renderer = new THREE.WebGLRenderer({ canvas:container,alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.name = "renderer";
    return renderer;
  }

  function addOrbitViewer() {
    var orbit = new THREE.OrbitControls(camera);
    orbit.enableKeys = false;
  }

  (function render() {
    elapsed = Date.now() - now;
    now = Date.now();

    flock.update(elapsed / 1000);
    updateAvatars();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  })();
}