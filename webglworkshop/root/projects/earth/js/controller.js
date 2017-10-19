window.addEventListener ?
window.addEventListener("load", init, false) :
window.attachEvent && window.attachEvent("onload", init);

function init() {
  var carousel = makeCarousel();

  var item = carousel.addItem("");

  // set up earth demo based on div properties
  earth(item);
}