"use strict";

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  let programInfo = {
    id: null,
    aVertex: null,
    aColour: null,
    uModelViewMatrix: null,
    uProjectionMatrix: null,
  }

  const makeBufferInfo = () => ({
    vertices: {
      id: null,
      itemSize: 3,
      numItems: 0,
    },
    colors: {
      id: null,
      itemSize: 4,
      numItems: 0,
    },
    indices: {
      id: null,
      itemSize: 1,
      numItems: 0,
    }
  });

  let bufferInfo = [];
  bufferInfo.push(makeBufferInfo());

  let gl;

  let modelViewMatrix = mat4.create();
  let projectionMatrix = mat4.create();

  let rotationMatrix = mat4.create();
  mat4.identity(rotationMatrix);
  let rvel = { x: 0, y: 0 };
  let updateVelocity = new UpdateVelocity();

  (function init() {
    let canvas = document.getElementById("glcanvas");
    Pointer.initInputHandlers(canvas);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl = WebGLUtils.setupWebGL(canvas);

    if (gl) {
      programInfo.id = initShaderProgram(gl, "vertex", "fragment");
      if (programInfo.id === null) return;

      initVariableLocations(programInfo);
      initGeometry();
      setActiveGeometry(0);

      gl.enable(gl.DEPTH_TEST);

      tick();
    }
  })();

  function setActiveGeometry(idx) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo[idx].indices.id);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo[idx].colors.id);
    gl.vertexAttribPointer(programInfo.aColour, bufferInfo[idx].colors.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo[idx].vertices.id);
    gl.vertexAttribPointer(programInfo.aVertex, bufferInfo[idx].vertices.itemSize, gl.FLOAT, false, 0, 0);
  }

  function initVariableLocations(programInfo) {
    programInfo.uModelViewMatrix = gl.getUniformLocation(programInfo.id, "uModelViewMatrix");
    programInfo.uProjectionMatrix = gl.getUniformLocation(programInfo.id, "uProjectionMatrix");

    programInfo.aVertex = gl.getAttribLocation(programInfo.id, "aVertex");
    gl.enableVertexAttribArray(programInfo.aVertex);

    programInfo.aColour = gl.getAttribLocation(programInfo.id, "aColour");
    gl.enableVertexAttribArray(programInfo.aColour);
  }

  function initGeometry() {
    initBuffer(new Float32Array(cubeGeometry.vertices), bufferInfo[0].vertices);
    initBuffer(new Float32Array(cubeGeometry.colors), bufferInfo[0].colors);
    initIndices(new Uint16Array(cubeGeometry.indices), bufferInfo[0].indices);
  }

  function initBuffer(values, buffer) {
    buffer.numItems = values.length / buffer.itemSize;
    buffer.id = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
    gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
  }

  function initIndices(indices, buffer) {
    buffer.numItems = indices.length / buffer.itemSize;
    buffer.id = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  function draw() {
    mat4.perspective(45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uProjectionMatrix, false, projectionMatrix);

    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, [0.0, 0.0, -3.0]);
    mat4.multiply(modelViewMatrix, rotationMatrix);

    gl.uniformMatrix4fv(programInfo.uModelViewMatrix, false, modelViewMatrix);

    gl.clearColor(0.25, 0.75, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, bufferInfo[0].indices.numItems, gl.UNSIGNED_SHORT, 0);
  }

  function UpdateVelocity() {
    let oldPos = null;
    return function (pointer) {
      if (oldPos === null) {
        oldPos = { x: pointer.X, y: pointer.Y };
        return [0, 0];
      } else {
        let deltaX = oldPos.x - pointer.X;
        let deltaY = oldPos.y - pointer.Y;
        let fudgefactor = 2;
        let rvelx = deltaX / fudgefactor;
        let rvely = deltaY / fudgefactor;

        oldPos = { x: pointer.X, y: pointer.Y };
        return { x: rvelx, y: rvely };
      }
    }
  }

  function animate() {
    let newRotationMatrix = mat4.create();

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
    let velocity = updateVelocity(Pointer);
    if (Pointer.L) {
      rvel.x = -velocity.x;
      rvel.y = -velocity.y;
    }
    animate();
    draw();
  }
}