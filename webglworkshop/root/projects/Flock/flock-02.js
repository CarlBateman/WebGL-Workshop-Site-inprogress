function Flock01() {
  var numNeighbours = 1;
  var bound = numNeighbours;
  var numBoids = bound;
  var maxDistanceToNeighbour = 1;

  var boids = [[], []];
  var currGen = 0, nextGen = 1;
  var grid = [];
  var iCurrentGrid = 0;
  var xIdx = [];
  var yIdx = [];
  var zIdx = [];

  this.getBoids = function () { return boids[currGen]; };

  init();

  function init() {
    for (var i = -numBoids; i <= numBoids; i++) {
      for (var j = -numBoids; j <= numBoids; j++) {
        //var boid = makeBoid(Math.random() - .5, Math.random() - .5, 0);
        var boid = makeBoid(i / 2, j / 2, 0);
        boid.vel.x = Math.random() - .5, boid.vel.y = Math.random() - .5
        addBoid();
      }
    }

    function addBoid() {
      boids[currGen].push(boid);

      if (grid[boid.key] === undefined) {
        grid[boid.key] = [boids[currGen].length - 1];
      } else {
        grid[boid.key].push(boids[currGen].length - 1);
      }
    }
  }

  this.update = function () {
    for (var i = 0; i < boids[currGen].length; i++) {
      updateBoid(i);
    }

    grid = [];
    for (var i = 0; i < boids[currGen].length; i++) {
      var boid = boids[currGen][i];
      boid.pos = boid.nextPos;
      boid.nextPos = makeVec3(0, 0, 0);
      boid.key = makeKey(boids[currGen][i].pos.x, boids[currGen][i].pos.y, boids[currGen][i].pos.z);

      if (grid[boid.key] === undefined) {
        grid[boid.key] = [i];
      } else {
        grid[boid.key].push(i);
      }
    }

  }

  function updateBoid(iBoid) {
    var neighbours = getNeighbours(iBoid);
    var boid = boids[currGen][iBoid];

    // separation
    // cohesion
    // alignment


    // advanced
    //   avoid other flocks
    //   follow leader
    //   contrain distance from common center
    //   ignore 


    // separation
    //var sumVecs = makeVec3(0, 0, 0);
    //for (var i = 0; i < neighbours.length; i++) {
    //  var neighbour = boids[currGen][neighbours[i].idx];
    //  sumVecs = addVec3(sumVecs, subVec3(neighbour.pos, pos));
    //}
    //return sumVecs;


    // cohesion
    var sumVecs = findCentroid(neighbours, boid.pos);
    sumVecs = scaleDownVec3(sumVecs, neighbours.length);

    //sumVecs = addVec3(sumVecs, boid.fwd);
    //sumVecs = scaleUpVec3(sumVecs, 2);

    //boid.nextPos = addVec3(boid.pos, scaleUpVec3(boid.fwd, 0.01));
    boid.nextPos = addVec3(boid.pos, scaleUpVec3(sumVecs, 0.01));
  }

  function findCentroid(neighbours, pos) {
    var sumVecs = makeVec3(0, 0, 0);
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = boids[currGen][neighbours[i].idx];
      sumVecs = addVec3(sumVecs, subVec3(neighbour.pos, pos));
    }
    return sumVecs;
  }

  function getNeighbours(iBoid) {
    var pos = boids[currGen][iBoid].pos;
    //var key = boids[currGen][iBoid].key;
    var neighbours = [];

    // get indices of all boids[currGen] that share cell and adjacent with current boid
    for (var ix = -1; ix < 2; ix++) {
      for (var iy = -1; iy < 2; iy++) {
        for (var iz = -1; iz < 2; iz++) {
          var key = makeKey(wrap(pos.x + ix, bound), wrap(pos.y + iy, bound), wrap(pos.z + iz, bound));

          if (key in grid === false) continue;

          for (var i = 0; i < grid[key].length; i++) {
            if (iBoid === grid[key][i]) continue;
            var idx = grid[key][i];
            var boid = boids[currGen][idx];
            var vec = subVec3(pos, boid.pos);
            var d2 = sqrVec3(vec);
            if (d2 <= maxDistanceToNeighbour)
              neighbours.push({ idx: idx, d2: d2 });
          }
        }
      }
    }

    return neighbours;
  }


  //////////////////////////////////////


  function makeVec3(x, y, z) {
    return { x: x || 0.0, y: y || 0.0, z: z || 0.0 };
  }

  function subVec3(v1, v2) {
    return makeVec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  function addVec3(v1, v2) {
    return makeVec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  function diffVec3(v1, v2) {
    return makeVec3(Math.abs(v1.x - v2.x), Math.abs(v1.y - v2.y), Math.abs(v1.z - v2.z));
  }


  function sqrVec3(v1) {
    return (v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  }

  function scaleUpVec3(v1, n) {
    return makeVec3(v1.x * n, v1.y * n, v1.z * n);
  }

  function scaleDownVec3(v1, n) {
    return makeVec3(v1.x / n, v1.y / n, v1.z / n);
  }

  function makeBoid(x, y, z) {
    var key = makeKey(x, y, z);

    return {
      pos: makeVec3(x, y, z),
      nextPos: makeVec3(x, y, z),
      fwd: makeVec3(0, 1, 0),
      up: makeVec3(0, 0, 1),
      vel: makeVec3(0, 0, 0),
      key: key
    }
  }

  function makeKey(x, y, z) {
    return Math.floor(x / maxDistanceToNeighbour) + "," + Math.floor(y / maxDistanceToNeighbour) + "," + Math.floor(z / maxDistanceToNeighbour)
  }

  function wrap(n, m) {
    if (n > m) return -m;
    if (n < -m) return m;
    return n;
  }
}