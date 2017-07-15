// adapted from http://threejs.org/examples/webgl_interactive_draggablecubes

var scene = new THREE.Scene();
var renderer;
var camera;
var container;
var raycaster;
var mouse = new THREE.Vector2();
var clock = new THREE.Clock();
var offset = new THREE.Vector3(), INTERSECTED, SELECTED;
var orbit, plane, objects = [];

window.addEventListener ?
window.addEventListener("load", init, false) :
window.attachEvent && window.attachEvent("onload", init);

window.addEventListener('resize', function (event) {
  //var w = window.innerWidth;
  //var h = window.innerHeight;
  var w = container.clientWidth;
  var h = container.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
});

function init() {
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);

  container = document.getElementById("renderTarget");
  renderer = addRenderer(container);
  camera = createCamera();
  var cylinder = addCylinder(scene, 5, "red.gif");
  cylinder = addCylinder(scene, 10, "blue.gif");
  cylinder = addCylinder(scene, 15, "green.gif");

  var cross_section  = addCrossSection(scene, 15);

  createLight(scene);

  orbit = new THREE.OrbitControls(camera, renderer.domElement);
  orbit.minPolarAngle = Math.PI / 3; // radians
  orbit.maxPolarAngle = 2 * Math.PI / 3; // radians
  orbit.object.position.z *= 1.25;

  var threshold = 0.1;
  raycaster = new THREE.Raycaster();
  //raycaster.params.Points.threshold = threshold;
  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  scene.add(plane);

  var render = function () {
    requestAnimationFrame(render);

    orbit.update( clock.getDelta() );

    renderer.render(scene, camera);
  };

  render();
}

function onDocumentMouseUp(event) {
  event.preventDefault();
  orbit.enabled = true;
  if (INTERSECTED) {
    plane.position.copy(INTERSECTED.position);
    SELECTED = null;
  }
  container.style.cursor = 'auto';
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = ((event.clientX - container.offsetLeft) / renderer.domElement.width) * 2 - 1;
  mouse.y = -((event.clientY - container.offsetTop) / renderer.domElement.height) * 2 + 1;
  //
  raycaster.setFromCamera(mouse, camera);
  if (SELECTED) {
    var intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
      //offset.z = 0;
      SELECTED.position.copy(intersects[0].point.sub(offset));
      SELECTED.position.y = 0;
      SELECTED.position.z = 0;
    }
    return;
  }

  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      plane.position.copy(INTERSECTED.position);
      plane.lookAt(camera.position);
    }
    container.style.cursor = 'pointer';
  } else {
    if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
    container.style.cursor = 'auto';
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  // Get mouse position
  //mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width) * 2 - 1;
  //mouse.y = -((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height) * 2 + 1;
  // 
  // http://stackoverflow.com/questions/13542175/three-js-ray-intersect-fails-by-adding-div/13544277
  // Method 1 For the following method to work correctly, set the canvas position static; margin > 0 and padding > 0 are OK

  //mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
  //mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.height ) * 2 + 1;

  //Method 2 For this alternate method, set the canvas position fixed; set top > 0, set left > 0; padding must be 0; margin > 0 is OK

  //mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
  //mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;

  //Here is a Fiddle if you want to experiment: http://jsfiddle.net/fek9ddg5/62/

  //// for position absolute
  //mouse.x = ((event.clientX - container.offsetLeft) / renderer.domElement.width) * 2 - 1;
  //mouse.y = -((event.clientY - container.offsetTop) / renderer.domElement.height) * 2 + 1;

  //console.log("[", mouse.x, ", ", mouse.y, "]");

    // update the picking ray with the camera and mouse position	
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      orbit.enabled = false;
      SELECTED = intersects[0].object;
      var intersects = raycaster.intersectObject(plane);
      if (intersects.length > 0) {
        offset.copy(intersects[0].point).sub(plane.position);
      }
      container.style.cursor = 'move';
    }

    //for (var i = 0; i < intersects.length; i++) {

    //  //intersects[i].object.material.color.set(0xff0000);
    //  console.log(i, intersects[i].object.name);
    //}


  //// Get 3D vector from 3D mouse position using 'unproject' function
  //var vector = new THREE.Vector3(mouseX, mouseY, 1);
  //vector.unproject(lesson10.camera);

  //// Set the raycaster position
  //lesson10.raycaster.set(lesson10.camera.position, vector.sub(lesson10.camera.position).normalize());

  //// Find all intersected objects
  //var intersects = lesson10.raycaster.intersectObjects(lesson10.objects);

  //if (intersects.length > 0) {
  //  // Disable the controls
  //  lesson10.controls.enabled = false;

  //  // Set the selection - first intersected object
  //  lesson10.selection = intersects[0].object;

  //  // Calculate the offset
  //  var intersects = lesson10.raycaster.intersectObject(lesson10.plane);
  //  lesson10.offset.copy(intersects[0].point).sub(lesson10.plane.position);
  //}
}

function createCamera() {
  var w = container.clientWidth;
  var h = container.clientHeight;
  //var w = window.innerWidth;
  //var h = window.innerHeight;
  var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 30;
  return camera;
}

function addRenderer(container) {
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  //console.log(window.innerWidth / 2, window.innerHeight / 2)
  //renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.name = "renderer";
  return renderer;
}

function addCrossSection(scene, size) {
  var geometry = new THREE.PlaneGeometry(size*2.2, size*2.2, 1, 1);
  var material = new createEarthMaterial("../../imgs/earthmap2k.jpg");//THREE.MeshBasicMaterial({ color: 0x888888 });//
  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.y = Math.PI / 2;
  plane.name = "slice";
  //plane.rotation.x = 1;
  //return plane;
  scene.add(plane);
  objects.push(plane);

}

function createEarthMaterial(img) {
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load(img, function (image) {
    earthTexture.image = image;
    earthTexture.needsUpdate = true;
  });

  //var earthMaterial = new THREE.MeshPhongMaterial();
  var earthMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  earthMaterial.map = earthTexture;

  return earthMaterial;
}

function addCylinder(scene, rad, img) {
  var geometry = new THREE.CylinderGeometry(rad, rad, 30, 32, 1, true);
  //geometry.openEnded = true;
  var material = new createEarthMaterial(img);//THREE.MeshBasicMaterial({ color: 0x888888 });//
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotation.z = Math.PI / 2;
  cylinder.rotation.x = 1;
  //return cylinder;
  scene.add(cylinder);
  //objects.push(cylinder);
}

function createEarthMaterial(img) {
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load(img, function (image) {
    earthTexture.image = image;
    earthTexture.needsUpdate = true;
  });

  //var earthMaterial = new THREE.MeshPhongMaterial();
  var earthMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  earthMaterial.map = earthTexture;

  return earthMaterial;
}

function createLight(scene) {
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
}