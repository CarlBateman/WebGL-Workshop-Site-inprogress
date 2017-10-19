function makeCarousel() {
  var items = [];

  // create / insert carousel
  var page = document.getElementById("page");
  var carousel = document.createElement("div");
  page.parentNode.insertBefore(carousel, page);
  carousel.className += "carouselContainer ";

  // add carousel controls < > oooo

  // add / remove item
  function addItem(id, classname) {
    var item = document.createElement("div");
    item.className += "carouselItem ";
    if (classname) item.className += className;
    items[id] = item;
    carousel.appendChild(item);

    return item;
  }
  // show / hide item
  // transition

  return { addItem };
}