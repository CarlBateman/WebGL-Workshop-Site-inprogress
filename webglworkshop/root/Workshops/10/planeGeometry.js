var planeGeometry = {
    vertexPositions : [-1,-1,0, -1,1,0, 1,1,0, 1,-1,0],
    vertexNormals : [0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1 ],
    vertexTextureCoords : [0,0, 0,1, 1,1, 1,0],
    indices : [0,1,2, 0,2,3],
    // colors: (function() { var c = []; for (var i = 0; i < 4; i++) { c.push(1.0); c.push(0.7); c.push(0.7); c.push(1.0); }; return c;}())
    colors: [1,1,0.8,1, 1,1,0.8,1, 1,1,0.8,1, 1,1,0.8,1]
    };