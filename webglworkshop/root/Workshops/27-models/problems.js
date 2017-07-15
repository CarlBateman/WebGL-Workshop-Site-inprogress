/// <reference path="frame_1.js" />
/// <reference path="frame_2.js" />
/// <reference path="frame_3.js" />

"use strict";
window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  var gl;
    
  var programInfo = {
    id: null,
    aVertex: null,
    uColour: null,
  };

  var bufferInfo = {
    id: null,
    itemSize: 0,
    numItems: 0,
  };

  (function init() {
    var canvas = document.getElementById("glCanvas");

    getWebGLcontext(canvas);
    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    initShaderProgram();
    initVariableLocations();
    initGeometry();

    tick();
  })();

  function getWebGLcontext(canvas) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var i = 0; i < names.length; ++i) {
      try { gl = canvas.getContext(names[i]); }
      catch (e) { }
      if (gl) break;
    }
  }

  function initShaderProgram() {
    var v = document.getElementById("vertex").firstChild.nodeValue;
    var f = document.getElementById("fragment").firstChild.nodeValue;

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, v);
    gl.compileShader(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, f);
    gl.compileShader(fs);

    programInfo.id = gl.createProgram();
    gl.attachShader(programInfo.id, vs);
    gl.attachShader(programInfo.id, fs);
    gl.linkProgram(programInfo.id);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
      console.log(gl.getShaderInfoLog(vs));

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
      console.log(gl.getShaderInfoLog(fs));

    if (!gl.getProgramParameter(programInfo.id, gl.LINK_STATUS))
      console.log(gl.getProgramInfoLog(programInfo.id));

    gl.useProgram(programInfo.id);
  }

  function initVariableLocations() {
    programInfo.aVertex = gl.getAttribLocation(programInfo.id, "aVertex");

    programInfo.uColour = gl.getUniformLocation(programInfo.id, "uColour");
  }

  function initGeometry() {
    var vertices = new Float32Array(frame4Geometry.vertexPositions);
    bufferInfo.itemSize = 3;
    bufferInfo.numItems = vertices.length / bufferInfo.itemSize;

    bufferInfo.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.id);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(programInfo.aVertex, bufferInfo.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.aVertex);
  }

  function draw() {
    gl.clearColor(0, 0.5, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform3fv(programInfo.uColour, [0.0, 1.0, 0.0]);

    gl.drawArrays(gl.LINES, 0, bufferInfo.numItems);
  }

  function animate() { }

  function tick() {
    requestAnimationFrame(tick);
    animate();
    draw();
  }
}
