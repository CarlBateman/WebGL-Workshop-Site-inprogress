 function Model3d() {
    this.transform = mat4.create();

    this.scale = vec3.fromValues(1.0, 1.0, 1.0);

    this.velocity = vec3.create();
    this.rvelocity = vec3.create();

    this.mesh = {                                 
        vertexPositions : [],
        vertexNormals : [],
        vertexTextureCoords : [],
        indices : []
    }
    this.vertexPositionBuffer;
    this.vertexColorBuffer;
    this.vertexNormalBuffer;
    this.vertexIndexBuffer;
    this.vertexTextureCoordBuffer;
    this.currentTexture;
    this.name="";
    this.texture = null;
    this.isBillboard = false;
}

 function initModel(geometry) {
   var vertexPositions = geometry.vertexPositions;
   var vertexTextureCoords = geometry.vertexTextureCoords;
   var indices = geometry.indices;
   var colors = geometry.colors;
   var normals = geometry.vertexNormals;
   var textureCoords = geometry.vertexTextureCoords;

   var vertexPositionBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
   vertexPositionBuffer.itemSize = 3;
   vertexPositionBuffer.numItems = vertexPositions.length / vertexPositionBuffer.itemSize;

   var vertexColorBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
   vertexColorBuffer.itemSize = 4;
   vertexColorBuffer.numItems = colors.length / vertexColorBuffer.itemSize;

   var vertexNormalBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
   vertexNormalBuffer.itemSize = 3;
   vertexNormalBuffer.numItems = normals.length / vertexNormalBuffer.itemSize;

   var vertexTextureCoordBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
   vertexTextureCoordBuffer.itemSize = 2;
   vertexTextureCoordBuffer.numItems = textureCoords.length / vertexTextureCoordBuffer.itemSize;

   var vertexIndexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
   vertexIndexBuffer.itemSize = 1;
   vertexIndexBuffer.numItems = indices.length / vertexIndexBuffer.itemSize;

   var model = new Model3d();
   model.vertexPositionBuffer = vertexPositionBuffer;
   model.vertexColorBuffer = vertexColorBuffer;
   model.vertexNormalBuffer = vertexNormalBuffer;
   model.vertexTextureCoordBuffer = vertexTextureCoordBuffer;
   model.vertexIndexBuffer = vertexIndexBuffer;

   return model;
 }

function Scene() {
    this.transform = mat4.create();

    this.velocity = vec3.create();
    this.rvelocity = vec3.create();
    
    this.models = [];
}

function Camera() { }

function setNormals(geometry) {
  //var norm = [];
  for (var i = 0; i < geometry.indices.length; i++) {
    var j = 3 * geometry.indices[i];
    var v0 = geometry.vertexPositions.slice(j, j + 3);
    j = 3 * geometry.indices[i + 1];
    var v1 = geometry.vertexPositions.slice(j, j + 3);
    j = 3 * geometry.indices[i + 2];
    var v2 = geometry.vertexPositions.slice(j, j + 3);
    var nx = (v1[1] - v0[1]) * (v2[2] - v0[2]) - (v2[1] - v0[1]) * (v1[2] - v0[2]);
    var ny = -(v1[0] - v0[0]) * (v2[2] - v0[2]) + (v2[0] - v0[0]) * (v1[2] - v0[2]);
    var nz = (v1[0] - v0[0]) * (v2[1] - v0[1]) - (v2[0] - v0[0]) * (v1[1] - v0[1]);
    var n = Math.sqrt(nx * nx + ny * ny + nz * nz);
    geometry.vertexNormals[i] = [nx / n, ny / n, nz / n];
  }
}