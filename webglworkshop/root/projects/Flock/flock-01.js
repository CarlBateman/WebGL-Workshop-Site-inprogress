function Flock01() {
  var numNeighbours = 1;
  var bound = numNeighbours;
  var numBoids = bound;
  var maxDistanceToNeighbour = 1;

  var boids = [[], []];
  var grid = [[], []];
  var currGen = 0, nextGen = 1;
  var xIdx = [];
  var yIdx = [];
  var zIdx = [];

  this.getBoids = function () { return boids[currGen]; };

  init();

  function init() {
    //for (var i = 0; i <= 0; i++) {
    //  for (var j = 0; j <= 2; j++) {
    for (var i = -numBoids; i <= numBoids; i++) {
      for (var j = -numBoids; j <= numBoids; j++) {
        //var boid = makeBoid(Math.random() - .5, Math.random() - .5, 0);
        var boid = makeBoid(i, j, 0);
        //boid.vel.x = Math.random() - .5, boid.vel.y = Math.random() - .5;
        addBoid();
      }
    }

    function addBoid() {
      boids[currGen].push(boid);
      boids[nextGen].push(boid);

      if (grid[currGen][boid.key] === undefined) {
        grid[currGen][boid.key] = [boids[currGen].length - 1];
      } else {
        grid[currGen][boid.key].push(boids[currGen].length - 1);
      }
    }
  }

  this.update = function (ms) {
    for (var i = 0; i < boids[currGen].length; i++) {
      updateBoid(i, ms);
    }

    nextGen = currGen;
    currGen = currGen === 0 ? 1 : 0;

    grid[nextGen] = [];


  }

  function updateBoid(iBoid, ms) {
    if (ms > 0.1) ms = 0.01;

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
    // if too close move apart
    var buffer = 1;
    var bufferSq = buffer * buffer;
    var sumSeparation = makeVec3(0, 0, 0);
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = boids[currGen][neighbours[i].idx];
      var separation = subVec3(neighbour.pos, boid.pos);

      var distanceSq = sqrVec3(separation);

      if (distanceSq < bufferSq) {
        var distance = Math.sqrt(distanceSq);

        var direction = scaleDownVec3(separation, distance);
        var correction = scaleUpVec3(direction, (distance - buffer));
        sumSeparation = addVec3(correction, sumSeparation);
      }
    }




    // cohesion
    // ALWAYS move toward centre or nieighbours (why not whole flock???)
    var moveTo = findCentre(neighbours, boid.pos);


    // update boid velocity
    var velocity = scaleUpVec3(addVec3(sumSeparation, moveTo), ms);
    boid.vel = velocity;
    // update boid pos
    var pos = addVec3(boid.pos, boid.vel);

    // add new pos to next gen grid
    var nextBoid = boids[nextGen][iBoid];
    //nextBoid.pos = addVec3(boid.pos, scaleUpVec3(sumVecs, 0.1));
    nextBoid.pos = addVec3(boid.pos, moveTo);
    //nextBoid.pos = addVec3(boid.pos, scaleUpVec3(sumSeparation, 0.01));
    nextBoid.pos = pos;

    nextBoid.key = makeKey(boids[currGen][iBoid].pos.x, boids[currGen][iBoid].pos.y, boids[currGen][iBoid].pos.z);

    if (grid[nextGen][boid.key] === undefined) {
      grid[nextGen][boid.key] = [iBoid];
    } else {
      grid[nextGen][boid.key].push(iBoid);
    }

  }

  function findCentre(neighbours, pos) {
    var sumVecs = makeVec3(0, 0, 0);
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = boids[currGen][neighbours[i].idx];
      sumVecs = addVec3(sumVecs, subVec3(neighbour.pos, pos));
    }
    sumVecs = scaleDownVec3(sumVecs, neighbours.length);
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

          if (key in grid[currGen] === false) continue;

          for (var i = 0; i < grid[currGen][key].length; i++) {
            //if (iBoid === grid[currGen][key][i]) continue;
            var idx = grid[currGen][key][i];
            var boid = boids[currGen][idx];
            var vec = subVec3(pos, boid.pos);
            if (vec === 0) continue;
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

  function magnSqrd(v1, v2) {
    return makeVec3(sqrVec3(v1) + sqrVec3(v2));
  }

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
      fwd: makeVec3(0, 1, 0),
      up: makeVec3(0, 0, 1),
      vel: makeVec3(0, 0, 0),
      key: key
    }
  }

  function makeKey(x,y,z) {
    return Math.floor(x / maxDistanceToNeighbour) + "," + Math.floor(y / maxDistanceToNeighbour) + "," + Math.floor(z / maxDistanceToNeighbour);
  }

  function wrap(n, m) {
    if (n > m) return -m;
    if (n < -m) return m;
    return n;
  }
}