  var properties = initGUIandProperties();

  if (properties.smooth) s = THREE.SmoothShading;
  function initGUIandProperties() {
    var properties = {
      radius: 0.5,
      numSegs: new THREE.Vector3(12, 12, 12),
      size: new THREE.Vector3(2, 2, 2),
      scale: new THREE.Vector3(1, 1, 1),
      texture: true,
      smooth: false,
      wireframe: false,
      boundingbox: true,
    }

    var gui = new dat.GUI();
    gui.add(properties, "radius", 0.1, 2).step(0.01).onChange(rebuildBox);
    gui.add(properties.size, "x", 0.01, 4).name("size x").step(0.01).onChange(rebuildBox);
    gui.add(properties.size, "y", 0.01, 4).name("size y").step(0.01).onChange(rebuildBox);
    gui.add(properties.size, "z", 0.01, 4).name("size z").step(0.01).onChange(rebuildBox);
    gui.add(properties.scale, "x", 0.01, 4).name("scale x").step(0.01).onChange(changeScale);
    gui.add(properties.scale, "y", 0.01, 4).name("scale y").step(0.01).onChange(changeScale);
    gui.add(properties.scale, "z", 0.01, 4).name("scale z").step(0.01).onChange(changeScale);
    gui.add(properties.numSegs, "x", 1, 24).name("numSegs x").step(1).onChange(rebuildBox);
    gui.add(properties.numSegs, "y", 1, 24).name("numSegs y").step(1).onChange(rebuildBox);
    gui.add(properties.numSegs, "z", 1, 24).name("numSegs z").step(1).onChange(rebuildBox);
    gui.add(properties, "texture").onChange(function () { changeTexture(properties.texture); });
    gui.add(properties, "smooth").onChange(updateBoxSmooth);
    gui.add(properties, "wireframe").onChange(function () { boxWireframe(properties.wireframe); });
    gui.add(properties, "boundingbox").onChange(rebuildBox);

    function changeScale() {
      box.scale.x = properties.scale.x;
      box.scale.y = properties.scale.y;
      box.scale.z = properties.scale.z;
      boundBox.scale.x = properties.scale.x;
      boundBox.scale.y = properties.scale.y;
      boundBox.scale.z = properties.scale.z;
    }

    function changeTexture(useTexture) {
      if (useTexture)
        box.material = boxMultiTexture;
      else
        box.material = boxMultiMaterial;
    }

    function boxWireframe(wireframe) {
      for (var i = 0; i < box.material.materials.length; i++) {
        boxMultiTexture.materials[i].wireframe = wireframe;
        boxMultiMaterial.materials[i].wireframe = wireframe;
        box.material.materials[i].wireframe = wireframe;
      }
    }

    function updateBoxSmooth() {
      var s = THREE.FlatShading;
      if (properties.smooth) s = THREE.SmoothShading;

      for (var i = 0; i < box.material.materials.length; i++) {
        box.material.materials[i].shading = s;
        box.material.materials[i].needsUpdate = true;

        boxMultiTexture.materials[i].shading = s;
        boxMultiTexture.materials[i].needsUpdate = true;

        boxMultiMaterial.materials[i].shading = s;
        boxMultiMaterial.materials[i].needsUpdate = true;
      }
    }

    function rebuildBox() {
      var multiMaterial = box.material;

      scene.remove(box);
      box = makeBoxFillet(properties, multiMaterial);
      box.scale.x = properties.scale.x;
      box.scale.y = properties.scale.y;
      box.scale.z = properties.scale.z;
      box.castShadow = true;
      scene.add(box);



      scene.remove(boundBox);
      boundBox.geometry = new THREE.BoxGeometry(properties.size.x, properties.size.y, properties.size.z);
      boundBox.material.wireframe = true;
      boundBox.scale.x = properties.scale.x;
      boundBox.scale.y = properties.scale.y;
      boundBox.scale.z = properties.scale.z;
      boundBox.visible = properties.boundingbox;
      scene.add(boundBox, multiMaterial);
    }
    return properties;
  }
