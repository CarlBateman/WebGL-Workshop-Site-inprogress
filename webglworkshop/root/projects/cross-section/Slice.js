var sliceScene = new THREE.Scene();
var sliceRenderer;
var sliceCamera;
var sliceMaterial;

function sliceInit() {
  sliceContainer = document.getElementById("slice");
  sliceRenderer = createRenderer(sliceContainer);
  sliceCamera = createCamera(sliceContainer);

  var geometry = new THREE.CylinderGeometry(5, 25, 10, 720, 2, true);
  sliceMaterial = new createSlice("../../imgs/earthmap2k.jpg");//THREE.MeshBasicMaterial({ color: 0x888888 });//
  var cylinder = new THREE.Mesh(geometry, sliceMaterial);
  cylinder.rotation.x = Math.PI / 2;
  //cylinder.rotation.x = 1;
  sliceScene.add(cylinder);

}

function createSlice(img) {
  var transfer = new THREE.TextureLoader().load("imgs/transfer01.png");
  var midTexture = new THREE.TextureLoader().load("imgs/mid.png");
  var innerTexture = new THREE.TextureLoader().load("imgs/inner.png");
  var outerTexture = new THREE.TextureLoader().load("imgs/outer.png");
  //var midTexture = new THREE.TextureLoader().load("../heartgeometry/imgs/checkerboard.jpg");
  var sliceMaterial = new THREE.ShaderMaterial({
    uniforms: {
      transfer: { type: "t", value: transfer },
      txInner: { type: "t", value: innerTexture },
      txOuter: { type: "t", value: outerTexture },
      txMid: { type: "t", value: midTexture },
      pos: { type: "f", value: 0.5 }
  },
    //attributes: {},
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  return sliceMaterial;
}

//var earthTexture = new THREE.Texture();
//var loader = new THREE.ImageLoader();
//loader.load(img, function (image) {
//  earthTexture.image = image;
//  earthTexture.needsUpdate = true;
//});

////var earthMaterial = new THREE.MeshPhongMaterial();
//var earthMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
//earthMaterial.wireframe = true;
//earthMaterial.map = earthTexture;



//var midTexture = new THREE.Texture().load("../../imgs/earthmap2k.jpg");
//var loader = new THREE.ImageLoader();
//loader.load("../../imgs/earthmap2k.jpg", function (image) {
//  midTexture.image = image;
//  midTexture.needsUpdate = true;
//});

