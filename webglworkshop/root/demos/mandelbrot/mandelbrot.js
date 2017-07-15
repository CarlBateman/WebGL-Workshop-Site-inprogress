window.addEventListener ?
window.addEventListener("load", init, false) :
window.attachEvent && window.attachEvent("onload", init);

var shaderProgram;
var vertexBuffer;
var limitBuffer;

function init() {
  initWebGL();
  initShaderProgram();
  initGeometry();
  animate();
}

function initWebGL() {
  canvas = document.getElementById("mycanvas");
  gl = canvas.getContext("webgl");

  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  for (var i = 0; i < names.length; ++i) {
    try {
      gl = canvas.getContext(names[i]);
    }
    catch (e) { }
    if (gl) break;
  }

  //gl.viewportWidth = gl.canvas.clientWidth;
  //gl.viewportHeight = gl.canvas.clientHeight;
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
  //gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
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

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vs);
  gl.attachShader(shaderProgram, fs);
  gl.linkProgram(shaderProgram);

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(vs));

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(fs));

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    console.log(gl.getProgramInfoLog(shaderProgram));

  gl.useProgram(shaderProgram);

  shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.aVertexPosition);

  shaderProgram.aLimit = gl.getAttribLocation(shaderProgram, "aLimit");
  gl.enableVertexAttribArray(shaderProgram.aLimit);
}

function initGeometry() {
  var limits = new Float32Array([ 0.5,  0.5, 0.0,
                                  0.5, -0.5, 0.0,
                                 -0.5,  0.5, 0.0,
                                 -0.5, -1, 0.0  ]);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, limits, gl.STATIC_DRAW);

  vertexBuffer.itemSize = 3;
  vertexBuffer.numItems = limits.length / vertexBuffer.itemSize;



  var limits = new Float32Array([ 1,  1,
                                  1, -1,
                                 -1,  1,
                                 -1, -1 ]);

  limitBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, limitBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, limits, gl.STATIC_DRAW);

  limitBuffer.itemSize = 2;
  limitBuffer.numItems = limits.length / limitBuffer.itemSize;
}

function draw() {
  gl.vertexAttribPointer(shaderProgram.aVertexPosition, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(shaderProgram.aLimit, limitBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.clearColor(0, 0.5, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numItems);
}

function animate() {
  resize();
  requestAnimationFrame(animate);
  draw();
}

var needToRender = true;
function resize() {
  var width = gl.canvas.clientWidth;
  var height = gl.canvas.clientHeight;
  if (gl.canvas.width != width ||
      gl.canvas.height != height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    return true;
  }
  return false;
}