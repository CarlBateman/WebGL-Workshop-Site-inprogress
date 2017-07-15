function initWebGL() {
  canvas = document.getElementById("mycanvas");
  gl = canvas.getContext("webgl", { alpha: false });
  //gl = canvas.getContext("webgl");

  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  for (var i = 0; i < names.length; ++i) {
    try {
      gl = canvas.getContext(names[i]);
    }
    catch (e) { }
    if (gl) break;
  }

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
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

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
	console.log("¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´");
    console.log(gl.getShaderInfoLog(vs));
	console.log("¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´¯`·._.·´");
	console.log();
  }

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(fs));

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    console.log(gl.getProgramInfoLog(shaderProgram));

  //gl.deleteShader(vs);
  //gl.deleteShader(fs);

  gl.useProgram(shaderProgram);
}