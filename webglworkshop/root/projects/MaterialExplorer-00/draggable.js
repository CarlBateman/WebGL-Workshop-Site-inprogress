﻿window.addEventListener('DOMContentLoaded', function () { InitDragDrop(); });

function $(id) {
  return document.getElementById(id);
}

var _startX = 0;			// mouse starting positions
var _startY = 0;
var _offsetX = 0;			// current element offset
var _offsetY = 0;
var _dragElement;			// needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;			// we temporarily increase the z-index during drag
var _debug = $('debug');	// makes life easier


function InitDragDrop() {
  _debug = $('debug');	// makes life easier
  document.addEventListener("mousedown", OnMouseDown);
  document.addEventListener("mouseup", OnMouseUp);
}

function OnMouseDown(e) {
  // IE is retarded and doesn't pass the event object
  if (e == null)
    e = window.event;

  // IE uses srcElement, others use target
  var target = e.target != null ? e.target : e.srcElement;

  if(_debug !== null)
  _debug.innerHTML = target.className == 'drag'
		? 'draggable element clicked'
		: 'NON-draggable element clicked';

  // for IE, left click == 1
  // for Firefox, left click == 0
  if ((e.button == 1 && window.event != null ||
		e.button == 0) &&
		target.className == 'drag') {

    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;

    // grab the clicked element's position
    _offsetX = ExtractNumber(target.style.left);
    _offsetY = ExtractNumber(target.style.top);

    // bring the clicked element to the front while it is being dragged
    _oldZIndex = target.style.zIndex;
    target.style.zIndex = 10000;

    // we need to access the element in OnMouseMove
    _dragElement = target;

    // tell our code to start moving the element with the mouse
    document.addEventListener("mousemove", OnMouseMove);

    // cancel out any text selections
    document.body.focus();

    // prevent text selection in IE
    document.onselectstart = function () { return false; };
    // prevent IE from trying to drag an image
    target.ondragstart = function () { return false; };

    // prevent text selection (except IE)
    return false;
  }
}

function ExtractNumber(value) {
  var n = parseInt(value);

  return n == null || isNaN(n) ? 0 : n;
}

function OnMouseMove(e) {
  if (e == null)
    var e = window.event;

  // this is the actual "drag code"
  //var t = _dragElement.clientWidth;
  _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
  _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
  //_dragElement.style.width = t+"px";

  if (_debug !== null)
    _debug.innerHTML = '(' + _dragElement.style.left + ', ' + _dragElement.style.top + ')';
}

function OnMouseUp(e) {
  if (_dragElement != null) {
    _dragElement.style.zIndex = _oldZIndex;

    // we're done with these events until the next OnMouseDown
    document.removeEventListener("mousemove", OnMouseMove);
    document.onselectstart = null;
    _dragElement.ondragstart = null;

    // this is how we know we're not dragging
    _dragElement = null;

    if (_debug !== null)
      _debug.innerHTML = 'mouse up';
  }
}
