// enum to go here

function makeScene() {
  return {
    background: [0.4, 0.7, 1],
    ambient: [0, 0, 1],
    skybox: "",
    lights: [],
    meshes: [],

    cameraFOV: 45,
    cameraPos: [0, 0, 150],
    cameraRot: [0, 0, 0],
    cameraTarget: [0,0,0],
    camWorldMatrix : [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
    ],
  }
}

function makeLight() {
  return {
    type: "",
    colour: [1, 1, 1],
    intensity: 1,
    position: [0, 0, 0],
    direction: [0, 0, 0],
  }
}

function makeMesh() {
  return {
    type: "",
    position: [0, 0, 0],
    scale: [0, 0, 0],
    rotateX: [0, 0, 0],
    rotateY: [0, 0, 0],
    rotateZ: [0, 0, 0],
    parent: null,
    children: null,
  }
}

function makeMaterial() {
  return {
    emissive: [1, 1, 1, 1],
    ambient: [1, 1, 1, 1],
    diffuse: [1, 1, 1, 1],
    specular: [1, 1, 1, 1],
  }
}

/*
"scene" : {
  "spot" : {
    "position" : [1,1,1],  
    "colour" : [1,1,1],  
  } }
  "torus" : {
    "position" : [1,1,1],  
    "colour" : [1,1,1],  
  } }
} }
 */