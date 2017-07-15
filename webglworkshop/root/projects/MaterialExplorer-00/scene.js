// enum to go here

var scene = {
  background: [1, 1, 1],
  skybox: "",
  lights: [],
  meshes: []
}

var Light = {
  type: "",
  colour: [1,1,1],
  intensity: 1,
  position: [0, 0, 0],
  direction: [0, 0, 0],
}

var Mesh = {
  type: "",
  position: [0, 0, 0],
  rotateX: [0, 0, 0],
  rotateY: [0, 0, 0],
  rotateZ: [0, 0, 0],
  parent: null,
  children: null,
}

var Material = {
  emissive: [1, 1, 1, 1],
  ambient: [1, 1, 1, 1],
  diffuse: [1, 1, 1, 1],
  specular: [1, 1, 1, 1],
}

/*
"scene" : {
  "spot" : {
    "position" : [1,1,1],  
    "colour" : [1,1,1],  
  }
  "torus" : {
    "position" : [1,1,1],  
    "colour" : [1,1,1],  
  }
}
 */