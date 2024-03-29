﻿function earth(div) {
  var scene = new THREE.Scene();
  var renderer;
  var camera;

  window.addEventListener('resize', function (event) {
    //var w = window.innerWidth;
    //var h = window.innerHeight * .3;
    var w = renderer.domElement.parentElement.clientWidth;
    var h = renderer.domElement.parentElement.clientHeight;
    camera.aspect = w / h;
    //camera.setViewOffset(w * 1.6, h, w * 0, h * 0, w, h);
    camera.position.x = -w / 80 + 5;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  (function init() {
    // add div
    // add image to div
    // add canvas to div
    // add p to div
    // change image to background propery?
    //var page = document.getElementById("page");
    //var div = document.createElement("div");
    //page.parentNode.insertBefore(div, page);
    //div.className += "carouselContainer ";
    addStarfield(div);

    var p = document.createElement("p");
    p.className += "credits ";
    p.innerHTML = "Credits: ";
    p.appendChild(document.createElement("br"));
    p.innerHTML += "Milky Way Image (ESO/S. Brunier - https://www.eso.org/public/images/eso0932a/";
    p.appendChild(document.createElement("br"));
    p.innerHTML += "Earth textures: http://planetpixelemporium.com/earth.html";
    div.appendChild(p);


    camera = createCamera(div);
    renderer = addRenderer(div);
    var earth = addEarth(scene);
    var clouds = addClouds(earth);

    createLight(scene);

    var render = function () {
      requestAnimationFrame(render);

      earth.rotation.y += 0.002;
      clouds.rotation.y += 0.00053;
      clouds.rotation.z -= 0.0001;

      scene.getObjectByName("sun").rotation.y += 0.005;

      renderer.render(scene, camera);
    };

    render();
  })();

  function addStarfield(container) {
    var img = document.createElement("img");
    img.src = "../../../imgs/milky.jpg";
    img.className += "backgroundImage ";
    container.appendChild(img);
  }

  function addEarth(scene) {
    var axialTilt = new THREE.Object3D();
    axialTilt.rotation.z = 0.41;
    scene.add(axialTilt);

    var geometry = new THREE.SphereGeometry(2.5, 32, 32);
    var material = createEarthMaterial();
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "earth";
    axialTilt.add(sphere);
    return sphere;
  }

  function addClouds(scene) {
    var geometry = new THREE.SphereGeometry(2.53, 32, 32);

    var cloudsTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load("../../../imgs/fair_clouds_1k.png", function (image) {
      cloudsTexture.image = image;
      cloudsTexture.needsUpdate = true;
    });

    var cloudsMaterial = new THREE.MeshPhongMaterial();
    cloudsMaterial.map = cloudsTexture;
    cloudsMaterial.transparent = true;

    var sphere = new THREE.Mesh(geometry, cloudsMaterial);
    sphere.name = "clouds";
    scene.add(sphere);
    return sphere;
  }

  function createEarthMaterial() {
    var earthTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load("../../../imgs/earthmap1k.jpg", function (image) {
      earthTexture.image = image;
      earthTexture.needsUpdate = true;
    });

    var normalTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load("../../../imgs/earth_normalmap_flat2k.jpg", function (image) {
      normalTexture.image = image;
      normalTexture.needsUpdate = true;
    });

    var specularTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load("../../../imgs/earthspec1k.jpg", function (image) {
      specularTexture.image = image;
      specularTexture.needsUpdate = true;
    });

    var earthMaterial = new THREE.MeshPhongMaterial();
    earthMaterial.map = earthTexture;
    earthMaterial.normalMap = normalTexture;
    earthMaterial.normalScale = new THREE.Vector2(0.7, 0.7);
    earthMaterial.specularMap = specularTexture;
    earthMaterial.specular = new THREE.Color(0x262626);

    return earthMaterial;
  }

  function addRenderer(container) {
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias:true });
    container.appendChild(renderer.domElement);
    //renderer.setSize(window.innerWidth, window.innerHeight * .3);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.name = "renderer";
    renderer.context.canvas.className += "webgl ";
    renderer.context.canvas.className += "webgl-head ";
    return renderer;
  }

  function createCamera(container) {
    //var w = window.innerWidth;
    //var h = window.innerHeight * .3;
    var w = container.clientWidth;
    var h = container.clientHeight;
    var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    //camera.setViewOffset(w * 1.6, h, w * 0, h * 0, w, h);
    camera.position.z = 50;
    camera.zoom = 10;
    camera.aspect = w / h;
    camera.position.x = -w / 80 + 5;
    camera.updateProjectionMatrix();
    return camera;
  }

  function createLight(scene) {
    var lightHolder = new THREE.Object3D();
    lightHolder.name = "sun";
    scene.add(lightHolder);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-10, 0, 20);
    lightHolder.add(light);

    var ambient = new THREE.AmbientLight(0x202020);
    scene.add(ambient);

  }

  return { init };
}