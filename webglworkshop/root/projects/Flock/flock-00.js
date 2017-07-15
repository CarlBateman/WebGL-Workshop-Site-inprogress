function Flock00() {
  var bound = 1000;
  var numBoids = 1000;
  var numNeighbours = 1000;

  var boids = [];
  var grid = [];
  var xIdx = [];
  var yIdx = [];
  var zIdx = [];

  this.getBoids = function () { return boids; };

  init();
  updateFlock();

  function init() {
    for (var i = 1; i < numBoids; i++) {
      //var boid = makeBoid(Math.random() - .5, Math.random() - .5, 0);
      var boid = makeBoid(i / 2, i / 2, 0);
      addBoid();
      var boid = makeBoid(i / 2, -i / 2, 0);
      addBoid();
      var boid = makeBoid(-i / 2, i / 2, 0);
      addBoid();
      var boid = makeBoid(-i / 2, -i / 2, 0);
      addBoid();
      //boid.pos = scaleVec3(boid.pos, 100);


      function addBoid() {
        boids.push(boid);
        var idx = boids.length - 1;

        var key = Math.floor(boid.pos.x);
        if (xIdx[key])
          xIdx[key].push(idx);
        else
          xIdx[key] = [idx];

        var key = Math.floor(boid.pos.y);
        if (yIdx[key])
          yIdx[key].push(idx);
        else
          yIdx[key] = [idx];

        var key = Math.floor(boid.pos.z);
        if (zIdx[key])
          zIdx[key].push(idx);
        else
          zIdx[key] = [idx];


        if (grid[boid.key] === undefined) {
          grid[boid.key] = [boids.length - 1];
        } else {
          grid[boid.key].push(boids.length - 1);
        }
      }
    }
  }

  
  function updateFlock() {
    for (var i = 0; i < boids.length; i++) {
      updateBoid(i);

    }
    //console.log(" = = = = = = = =");
  }

  function updateBoid(iBoid) {
    var neighbours = getNeighbours(iBoid);

    for (var i = 0; i < neighbours.length; i++) {
      //console.log(neighbours[i]);
    }

    //console.log(" = = = = = = = =");
    //console.log("");
  }

  function getNeighbours(iBoid) {
    var pos = boids[iBoid].pos;
    var neighbours = [];

    // get indices all boids that share an ORDINATE with current boid
    var partIdx = xIdx[Math.floor(pos.x)].concat(yIdx[Math.floor(pos.y)]).concat(zIdx[Math.floor(pos.z)]);
    partIdx.sort();

    // remove the current boid
    partIdx.splice(partIdx.findIndex(function (idx) { return idx === iBoid }), 3);

    // find all boids share the same cell as the current boid (share 3 ordinates and we have a winner)
    findBoids();
    
    // do something similar for adjacent cells
    getOuterBoids();

    neighbours.sort(function (a, b) { return a.d2 - b.d2; });
    neighbours = neighbours.slice(0, 4);

    return neighbours;
    //////////////////////////////////////////////////////

    function getOuterBoids() {
      var rad = 1;
      var xlo = Math.floor(pos.x);
      var xhi = Math.floor(pos.x);
      var ylo = Math.floor(pos.y);
      var yhi = Math.floor(pos.y);
      var zlo = Math.floor(pos.z);
      var zhi = Math.floor(pos.z);

      while (neighbours.length < 4) {
        getNeighbours();

        rad++;
      }

      neighbours.sort(function (a, b) { return a.d2 - b.d2; });
      neighbours = neighbours.slice(0, 4);

      // finally check whether any nieghbours are outside the radius^2 for a final outer check
      if (neighbours[3].d2 > (rad*rad)) {
        getNeighbours();
      }

      console.log(rad);

      function getNeighbours() {
        xlo = mod(xlo - 1, bound);
        xhi = mod(xhi + 1, bound);
        ylo = mod(ylo - 1, bound);
        yhi = mod(yhi + 1, bound);
        zlo = mod(zlo - 1, bound);
        zhi = mod(zhi + 1, bound);

        partIdx = concat(partIdx, xIdx[xlo]);
        partIdx = concat(partIdx, yIdx[ylo]);
        partIdx = concat(partIdx, zIdx[zlo]);
        partIdx = concat(partIdx, xIdx[xhi]);
        partIdx = concat(partIdx, yIdx[yhi]);
        partIdx = concat(partIdx, zIdx[zhi]);
        partIdx.sort();
        findBoids();
      }
    }

    function findBoids() {
      for (var i = 0; i < partIdx.length; ) {
        if (partIdx[i] === partIdx[i + 2]) {
          var iAdj = partIdx[i];
          var vec = diffVec3(pos, boids[iAdj].pos);
          neighbours.push({ idx: iAdj, d2: sqrVec3(vec) });
          partIdx.splice(i, 3);
        } else {
          i++;
        }
      }
    }

    function mod(n, m) {
      if (n > m) return -m;
      if (n < -m) return m;
      return n;
      //return ((n % m) + m) % m;
    }

    function concat(a,b){
      if (a === undefined) return b;
      if (b === undefined) return a;
      return a.concat(b);
    }
  }



  //////////////////////////////////////



  function makeVec3(x, y, z) {
    return { x: x || 0.0, y: y || 0.0, z: z || 0.0 };
  }

  function diffVec3(v1, v2) {
    return makeVec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  function sqrVec3(v1) {
    return (v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  }

  function scaleVec3(v1, n) {
    return makeVec3(v1.x * n, v1.y * n, v1.z * n);
  }

  function makeBoid(x, y, z) {
    return { pos: makeVec3(x, y, z), key: x + "," + y + "," + z };
    //return { pos: makeVec3(x, y, z), key : Math.floor(10 * x) + "," + Math.floor(10 * y) + "," + Math.floor(10 * z)};
  }
}