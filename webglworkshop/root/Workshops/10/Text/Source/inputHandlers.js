InputHandler = function () {
  var mouseDown = false;
  var lastMouseX = null;
  var lastMouseY = null;
  var rvelX = 0;
  var rvelY = 0;
  var depth = -10.0;

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }

  function handleMouseUp(event) {
    mouseDown = false;
  }

  function handleMouseMove(event) {
    if (!mouseDown) {
      return;
    }
    updateXY(event.clientX, event.clientY);
  }

  function handleMouseWheel(event) {
    var event = window.event || event; // old IE support
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    depth += delta;
  }

  function handleTouchMove(event) {
    event.preventDefault();

    if (!mouseDown) {
      return;
    }
    updateXY(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
  }

  function handleTouchDown(event) {
    mouseDown = true;
    lastMouseX = event.targetTouches[0].pageX;
    lastMouseY = event.targetTouches[0].pageY;
  }

  function updateXY(newX, newY) {
    var fudgefactor = 2;
    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;
    lastMouseX = newX
    lastMouseY = newY;

    rvelX = deltaX / fudgefactor;
    rvelY = deltaY / fudgefactor;
    interactionTarget.rvelocity[0] = deltaX / fudgefactor;
    interactionTarget.rvelocity[1] = deltaY / fudgefactor;
  }

  var initInputHandlers = function(canvas) {
    var canvas = document.getElementById(canvas);

    canvas.onmousedown = handleMouseDown;
    document.onmousemove = handleMouseMove;
    document.onmouseup = handleMouseUp;

    if (canvas.addEventListener) {
      canvas.addEventListener("mousewheel", handleMouseWheel, false);
      canvas.addEventListener("DOMMouseScroll", handleMouseWheel, false);
    }
    else canvas.attachEvent("onmousewheel", handleMouseWheel);

    canvas.addEventListener('touchstart', handleTouchDown, false);
    canvas.addEventListener('touchmove', handleTouchMove, true);
    canvas.addEventListener('touchend', handleMouseUp, false);
  }
}