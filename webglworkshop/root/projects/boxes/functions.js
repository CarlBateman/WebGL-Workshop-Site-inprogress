function makeBoxFilletGeometry(properties) {
  var side = properties.radius * 2;
  var offset = properties.size.clone().divideScalar(2).subScalar(properties.radius);

  // create box geometry for the size of the fillet ONLY
  var geometry = new THREE.BoxGeometry(side, side, side, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);

  var vertices = [];
  var v;
  for (var i = 0; i < geometry.vertices.length; i++) {
    // use v as a shortcut
    v = geometry.vertices[i];
    // store vertex for later restoration
    vertices.push(v.clone());
    // shift vertices to outer edge
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }
  // re-calculate UVs
  assignUVs(geometry, properties.size);

  // restore vertices
  geometry.vertices = vertices;
  for (var i = 0; i < geometry.vertices.length; i++) {
    v = geometry.vertices[i];
    // move vertex to surface of unit sphere
    v.normalize().multiplyScalar(properties.radius);
    // shift vertices to outer edge
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }
  // re-calculate normals
  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();
  geometry.computeVertexNormals();

  return geometry;
}

function makeRoundedCubeGeometry(properties) {
  var size = properties.size;
  var radius = properties.radius;

  var buffer = size.clone().subScalar(radius * 2);

  var radSq = radius * radius;
  var offset = size.clone().divideScalar(2).subScalar(radius);
  offset.x = Math.abs(offset.x);
  offset.y = Math.abs(offset.y);
  offset.z = Math.abs(offset.z);

  // create box geometry
  var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);

  // clamp any vertices outside the radius
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    if (v.lengthSq() > radSq) {
      v.normalize().multiplyScalar(radius);
    }
  }

  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();
  geometry.computeVertexNormals();

  return geometry;
}

function makePunchedCubeGeometry(properties) {
  var size = properties.size;
  var edge = size.clone().divideScalar(2);
  var radius = properties.radius;

  var buffer = size.clone().subScalar(radius * 2);

  var radSq = radius * radius;
  var offset = size.clone().divideScalar(2).subScalar(radius);
  offset.x = Math.abs(offset.x);
  offset.y = Math.abs(offset.y);
  offset.z = Math.abs(offset.z);

  // create box geometry
  var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);

  // clamp any vertices outside the radius
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    if (v.lengthSq() < radSq) {
      var length = v.length();
      var diff = radius - length;
      var vdiff = v.clone().normalize().multiplyScalar(diff);

      // work out normal
      if (edge.x == Math.abs(v.x))
        vdiff.x *= -1;
      else if (edge.y == Math.abs(v.y))
        vdiff.y *= -1;
      else if (edge.z == Math.abs(v.z))
        vdiff.z *= -1;

      v.add(vdiff);
      //v.normalize().multiplyScalar(length - diff);
      //length+radius - length

      //v.normalize().multiplyScalar(radius);
    }
  }

  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();
  geometry.computeVertexNormals();

  return geometry;
}

function makeTwistedCube() {
}


// modified version of
// http://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate  
function assignUVs(geometry, scale) {
  geometry.faceVertexUvs[0] = [];

  geometry.faces.forEach(function (face) {
    var components = ['x', 'y', 'z'].sort(function (a, b) {
      return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
    });

    var s = new THREE.Vector2(scale[components[0]], scale[components[1]]);
    var v1 = geometry.vertices[face.a];
    var v2 = geometry.vertices[face.b];
    var v3 = geometry.vertices[face.c];

    var t1 = new THREE.Vector2(v1[components[0]], v1[components[1]]);
    var t2 = new THREE.Vector2(v2[components[0]], v2[components[1]]);
    var t3 = new THREE.Vector2(v3[components[0]], v3[components[1]]);

    geometry.faceVertexUvs[0].push([
        t1.divide(s).addScalar(.5),
        t2.divide(s).addScalar(.5),
        t3.divide(s).addScalar(.5)
    ]);

    if (face.normal.x > 0) { t1.y = 1 - t1.y; t2.y = 1 - t2.y; t3.y = 1 - t3.y; }
    if (Math.abs(face.normal.x) > 0) { [t1.x, t1.y] = [t1.y, t1.x];[t2.x, t2.y] = [t2.y, t2.x];[t3.x, t3.y] = [t3.y, t3.x]; }


    if (face.normal.y > 0) { t1.y = 1 - t1.y; t2.y = 1 - t2.y; t3.y = 1 - t3.y; }
    if (face.normal.z < 0) { t1.x = 1 - t1.x; t2.x = 1 - t2.x; t3.x = 1 - t3.x; }
  });
}


function makeRoundedCubeGeometry_NEW(properties) {
  var size = properties.size;
  var radius = properties.radius;

  var buffer = size.clone().subScalar(radius * 2);
  buffer.x = Math.abs(buffer.x);
  buffer.y = Math.abs(buffer.y);
  buffer.z = Math.abs(buffer.z);

  var radSq = radius * radius;
  var offset = size.clone().sub(buffer).divideScalar(2);
  offset.x = Math.abs(offset.x);
  offset.y = Math.abs(offset.y);
  offset.z = Math.abs(offset.z);

  // create box geometry for the size of the rounded edges ONLY
  var geometry = new THREE.BoxGeometry(buffer.x, buffer.y, buffer.z, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);
  //var geometry = new THREE.BoxGeometry(size.x - offset.x, size.y - offset.x, size.z - offset.x, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);
  //var vertices = [];
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    //vertices.push(v.clone());
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }


  assignUVs(geometry, properties.size);
  //geometry.vertices = vertices;


  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    if (v.lengthSq() > radSq) {
      v = v.normalize().multiplyScalar(radius);
    }
  }

  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();
  geometry.computeVertexNormals();

  return geometry;
}

function makeRoundedCubeGeometry_OLD_2(properties) {
  var size = properties.size;
  var radius = properties.radius;

  var buffer = size.clone().subScalar(radius * 2);

  var radSq = radius * radius;
  var offset = size.clone().divideScalar(2).subScalar(radius);
  offset.x = Math.abs(offset.x);
  offset.y = Math.abs(offset.y);
  offset.z = Math.abs(offset.z);

  // create box geometry for the size of the rounded edges ONLY
  var geometry = new THREE.BoxGeometry(buffer.x, buffer.y, buffer.z, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);
  //var geometry = new THREE.BoxGeometry(size.x - offset.x, size.y - offset.x, size.z - offset.x, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);
  //var vertices = [];
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    //vertices.push(v.clone());
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }


  assignUVs(geometry, properties.size);
  //geometry.vertices = vertices;


  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    if (v.lengthSq() > radSq) {
      v = v.normalize().multiplyScalar(radius);
    }
  }

  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();
  geometry.computeVertexNormals();

  return geometry;
}

function makeRoundedCubeGeometry_OLD_1(properties) {
  var side = properties.radius * 2;
  var size = properties.size;
  var rad = properties.radius * 1.5;
  var radSq = rad * rad;
  var offset = properties.size.clone().divideScalar(2).subScalar(properties.radius);
  offset.x = Math.abs(offset.x);
  offset.y = Math.abs(offset.y);
  offset.z = Math.abs(offset.z);

  var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, properties.numSegs.x, properties.numSegs.y, properties.numSegs.z);
  //var vertices = [];
  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    //vertices.push(v.clone());
    v.x += Math.sign(v.x) * offset.x;
    v.y += Math.sign(v.y) * offset.y;
    v.z += Math.sign(v.z) * offset.z;
  }


  assignUVs(geometry, properties.size);
  //geometry.vertices = vertices;


  for (var i = 0; i < geometry.vertices.length; i++) {
    var v = geometry.vertices[i];
    if (v.lengthSq() > radSq) {
      v = v.normalize().multiplyScalar(rad);
    }
  }

  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();
  geometry.computeVertexNormals();

  return geometry;
}

