"use strict";

window.addEventListener('DOMContentLoaded', function () { init(); });

var programInfo = {
  id: null,
  aVertex: null,
  aTextureCoord: null,
  aColour: null,
  uColour: null,
  uModelViewMatrix: null,
  uProjectionMatrix: null,
}

var bufferInfo = {
  id: null,
  itemSize: 3,
  numItems: 0,
}

var cubeVertexIndexBuffer = {
  id: null,
  itemSize: 3,
  numItems: 0,
}

var cubeVertexColorBuffer = {
  id: null,
  itemSize: 3,
  numItems: 0,
}

var gl;

var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();

var rotationMatrix = mat4.create();
mat4.identity(rotationMatrix);
var rvel = { x: 0, y: 0 };
var updateVelocity = new UpdateVelocity();

function init() {
  var canvas = document.getElementById("glcanvas");
  Pointer.initInputHandlers(canvas);

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  gl = WebGLUtils.setupWebGL(canvas);

  if (gl) {
    programInfo.id = initShaderProgram(gl, "vertex", "fragment");
    if (programInfo.id === null) return;

    initVariableLocations();
    initGeometry();

    gl.enable(gl.DEPTH_TEST);

    tick();
  }
}

function initVariableLocations() {
  programInfo.uColour = gl.getUniformLocation(programInfo.id, "uColour");
  programInfo.uModelViewMatrix = gl.getUniformLocation(programInfo.id, "uModelViewMatrix");
  programInfo.uProjectionMatrix = gl.getUniformLocation(programInfo.id, "uProjectionMatrix");

  programInfo.aVertex = gl.getAttribLocation(programInfo.id, "aVertex");
  programInfo.aColour = gl.getAttribLocation(programInfo.id, "aColour");
}

function initGeometry() {
  initVertices();
  initFaceIndices();
  initColours();
}

function initVertices() {
  var vertices = new Float32Array(cubeGeometry.vertexPositions);

  //var vertices = new Float32Array([
  //        // Front face
  //        -0.5, -0.5, 0.5,
  //         0.5, -0.5, 0.5,
  //         0.5, 0.5, 0.5,
  //        -0.5, 0.5, 0.5,

  //        // Back face
  //        -0.5, -0.5, -0.5,
  //        -0.5, 0.5, -0.5,
  //         0.5, 0.5, -0.5,
  //         0.5, -0.5, -0.5,

  //        // Top face
  //        -0.5, 0.5, -0.5,
  //        -0.5, 0.5, 0.5,
  //         0.5, 0.5, 0.5,
  //         0.5, 0.5, -0.5,

  //        // Bottom face
  //        -0.5, -0.5, -0.5,
  //         0.5, -0.5, -0.5,
  //         0.5, -0.5, 0.5,
  //        -0.5, -0.5, 0.5,

  //        // Right face
  //         0.5, -0.5, -0.5,
  //         0.5, 0.5, -0.5,
  //         0.5, 0.5, 0.5,
  //         0.5, -0.5, 0.5,

  //        // Left face
  //        -0.5, -0.5, -0.5,
  //        -0.5, -0.5, 0.5,
  //        -0.5, 0.5, 0.5,
  //        -0.5, 0.5, -0.5
  //]);
  bufferInfo.numItems = vertices.length / bufferInfo.itemSize;

  bufferInfo.id = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.id);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(programInfo.aVertex);
  gl.vertexAttribPointer(programInfo.aVertex, bufferInfo.itemSize, gl.FLOAT, false, 0, 0);
}

function initFaceIndices() {
  var indices = new Uint16Array([
      0, 1, 2, 0, 2, 3,    // Front face
      4, 5, 6, 4, 6, 7,    // Back face
      8, 9, 10, 8, 10, 11,  // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23  // Left face
  ]);
  cubeVertexIndexBuffer.id = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer.id);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;
  cubeVertexIndexBuffer.numItems = 36;
}

function initColours() {
  var colors = [
      [0.0, 1.0, 1.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.0, 1.0, 1.0], // Bottom face
      [1.0, 0.0, 0.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0]  // Left face
  ];
  var unpackedColors = [];
  for (var i in colors) {
    var color = colors[i];
    for (var j = 0; j < 4; j++) {
      unpackedColors = unpackedColors.concat(color);
    }
  }
  cubeVertexColorBuffer.id = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer.id);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  cubeVertexColorBuffer.itemSize = 4;
  cubeVertexColorBuffer.numItems = 24;

  gl.enableVertexAttribArray(programInfo.aColour);
  gl.vertexAttribPointer(programInfo.aColour, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

function draw() {
  mat4.perspective(45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uProjectionMatrix, false, projectionMatrix);

  mat4.identity(modelViewMatrix);
  mat4.translate(modelViewMatrix, [0.0, 0.0, -3.0]);
  mat4.multiply(modelViewMatrix, rotationMatrix);

  gl.uniformMatrix4fv(programInfo.uModelViewMatrix, false, modelViewMatrix);
  gl.uniform4fv(programInfo.uColour, [0.0, 1.0, 0.0, 1.0]);

  gl.clearColor(0, 0.5, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numItems);
  //gl.drawElements(gl.LINE_STRIP, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function UpdateVelocity() {
  var oldPos = null;
  return function (pointer) {
    if (oldPos === null) {
      oldPos = { x: pointer.X, y: pointer.Y };
      return [0, 0];
    } else {
      var deltaX = oldPos.x - pointer.X;
      var deltaY = oldPos.y - pointer.Y;
      var fudgefactor = 2;
      var rvelx = deltaX / fudgefactor;
      var rvely = deltaY / fudgefactor;

      oldPos = { x: pointer.X, y: pointer.Y };
      return { x: rvelx, y: rvely };
    }
  }
}

function animate() {
  var newRotationMatrix = mat4.create();

  mat4.identity(newRotationMatrix);
  mat4.rotate(newRotationMatrix, rvel.x * Math.PI / 180, [0, 1, 0]);
  mat4.rotate(newRotationMatrix, rvel.y * Math.PI / 180, [1, 0, 0]);
  mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

  rvel.x = rvel.x / 1.08;
  if (Math.abs(rvel.x) < 0.001) rvel.x = 0;
  rvel.y = rvel.y / 1.1;
  if (Math.abs(rvel.y) < 0.001) rvel.y = 0;
}

function tick() {
  requestAnimationFrame(tick);
  var velocity = updateVelocity(Pointer);
  if (Pointer.L) {
    rvel.x = -velocity.x;
    rvel.y = -velocity.y;
  }
  animate();
  draw();
}