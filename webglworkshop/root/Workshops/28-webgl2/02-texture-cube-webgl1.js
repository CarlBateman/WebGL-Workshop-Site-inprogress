"use strict";

window.addEventListener('DOMContentLoaded', function () { main(); });

function main() {
  let canvas = document.getElementById("glcanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  let gl;
  for (let i = 0; i < names.length; ++i) {
    try { gl = canvas.getContext(names[i]); }
    catch (e) { }
    if (gl) break;
  }

  if (!gl) {
    console.error("WebGL 1 not available");
    document.body.innerHTML = "This example requires WebGL 1 which is unavailable on this system."
  }

  /////////////////////
  // SET UP PROGRAM
  /////////////////////

  let vertexScript = document.getElementById("vertex").text.trim();
  let fragmentScript = document.getElementById("fragment").text.trim();

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexScript);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    console.error(gl.getShaderInfoLog(vertexShader));

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentScript);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    console.error(gl.getShaderInfoLog(fragmentShader));

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.error(gl.getProgramInfoLog(program));

  gl.useProgram(program);

  /////////////////////
  // SET UP GEOMETRY
  /////////////////////

  program.aVertex = gl.getAttribLocation(program, "aVertex");

  let vertices = new Float32Array([
      -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0,
       0.0, 0.5, 0.0
  ]);

  let positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(program.aVertex, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.aVertex);

  program.aColor = gl.getAttribLocation(program, "aColor");

  let colors = new Float32Array([
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0
  ]);

  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.aColor);

  ////////////////
  // DRAW
  ////////////////

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
