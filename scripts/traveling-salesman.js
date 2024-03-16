/**
 * Instance of a Traveling Salesman run
 * 
 * Allows for stepping through of different algorithms
 * (only 2-opt swap implemented) while tracking total
 * path length.
 */
class TravelingSalesman {

  // Iteration counter
  step = 0;

  // A list of Points
  data = [];

  // Original list of Points
  originalData = [];

  // Tracks previous states (list of Point[])
  history = [];

  // Max history saved
  maxHistory = 10;

  // Tracks the total path length
  pathLength = 0;

  // Tracks the total squared path length
  pathLengthSquared = 0;

  // List of available algorithms
  // TODO: Make this an enum
  algorithms = ['2-opt'];

  // Algorithm used
  algorithm = '2-opt';

  /**
   * Set up a new Traveling Salesman run
   * 
   * @param {Point[]} points
   */
  constructor(points) {
    this.originalData = points;
    this.reset();
  }

  /**
   * Resets the runner to the original data
   */
  reset() {
    this.step = 0;
    this.data = this.originalData;
    this.history = [];
    this.calculatePaths();
  }

  /**
   * Sets up a new list of points
   * 
   * @param {Point[]} points 
   */
  setData(points) {
    this.data = this.originalData = points;
    this.step = 0;
    this.calculatePaths();
  }

  /**
   * Calculate the path length values based on the current data
   */
  calculatePaths() {
    this.pathLength =
        TravelingSalesmanUtil.totalLength(this.data);
    this.pathLengthSquared =
        TravelingSalesmanUtil.totalSquaredLength(this.data);
  }

  /**
   * Adds a set of points to the history
   * 
   * @param {Point[]} points
   */
  addHistory(points) {
    this.history.push([...points]);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }
  }

  /**
   * Runs one step of Traveling Salesman
   * 
   * @returns true if a step is possible
   */
  stepForward() {
    if (this.algorithm == this.algorithms[0]) {
      let swap = this.step2Opt();

      if (swap != null) {
        this.step++;
        this.addHistory(this.data);
        this.swap2Opt(swap[0], swap[1]);
        this.calculatePaths();

        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * Reverts to a saved state in history if possible
   * 
   * @returns true on success, false on failure
   */
  stepBackward() {
    if (this.history.length > 0) {
      this.data = this.history.pop();
      this.step--;
      this.calculatePaths();
      return true;
    }
    return false;
  }

  /**
   * Runs Traveling Salesman to completion
   */
  run() {
    if (this.algorithm == this.algorithms[0]) {
      this.run2Opt();
    }
  }

  /**
   * Runs a 2-opt swap
   */
  swap2Opt(start, end) {
    if (end != 0) {
      this.data = [
        ...this.data.slice(0, start),
        ...this.data.slice(start, end + 1).reverse(),
        ...this.data.slice(end + 1)
      ];
    } else {
      let temp = [...this.data.slice(start), this.data[0]];
      this.data = [
        ...this.data.slice(1, start),
        ...temp.reverse(),
      ];
    }
  }

  /**
   * Runs one step of the 2-opt algorithm
   * 
   * @returns a swap if possible
   */
  step2Opt() {
    let swap = null;
    let bestDelta = 0;
    let len = this.data.length;

    // Test for the best swap
    for (let i = 0; i < len - 1; i++) {
			for (let j = i + 1; j < len + 1; j++) {

        // Test for edge case of the same line
        if (i == j % len) {
          continue;
        }

        // Get the delta between path 1 (points i and i + 1)
        // and path 2 (points j and j + 1)
        let computedDelta = TravelingSalesmanUtil.squaredDelta(
            this.data[i],
            this.data[(i + 1) % len],
            this.data[j % len],
            this.data[(j + 1) % len]
        );

        /* Testing check
        console.log(computedDelta 
            + ' (' + i + ', ' + (i + 1) % len + ') (' 
            + (j % len) + ', ' + (j + 1) % len + ')');
        */

        if (computedDelta < bestDelta) {
          bestDelta = computedDelta;
          swap = [(i + 1) % len, j % len];
        }
      }
    }
    return swap;
  }

  /**
   * Runs 2-opt algorithm to completion
   */
  run2Opt() {
    let changeMade = true;
    let len = this.data.length;

    while (changeMade) {
      changeMade = false;

      // Test for the next swap
      for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len + 1; j++) {

          // Test for edge case of the same line
          if (i == j % len) {
            continue;
          }

          // Get the delta between path 1 (points i and i + 1)
          // and path 2 (points j and j + 1)
          let computedDelta = TravelingSalesmanUtil.squaredDelta(
              this.data[i],
              this.data[(i + 1) % len],
              this.data[j % len],
              this.data[(j + 1) % len]
          );

          if (computedDelta < 0) {
            this.step++;
            this.swap2Opt((i + 1) % len, j % len);
            changeMade = true;
          }
        }
      }
    }

    this.calculatePaths();
  }

}

/**
 * Class object for points
 */
class Point {
  /**
   * Create a new Point
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Calculates the euclidean distance squared to another Point
   * 
   * @param {Point} otherPoint
   * @returns distance squared value
   */
  distanceSquared(otherPoint) {
    return (this.x - otherPoint.x) * (this.x - otherPoint.x) 
        + (this.y - otherPoint.y) * (this.y - otherPoint.y);
  }

  /**
   * Calculates the euclidean distance to another Point
   * 
   * @param {Point} otherPoint
   * @returns distance
   */
  distance(otherPoint) {
    return Math.sqrt(this.distanceSquared(otherPoint));
  }
}

/**
 * Contains util functions for Traveling Salesman runs
 */
class TravelingSalesmanUtil {
  /**
   * Compute the total euclidean distance squared of set of points
   * 
   * @param {Point[]} points 
   * @returns total squared length
   */
  static totalSquaredLength(points) {
    let distance = 0;
    
    for(let i = 0; i < points.length; i++) {
      distance += 
          points[i].distanceSquared(points[(i + 1) % points.length]);
    }

    return distance;
  };

  /**
   * Compute the total euclidean distance of set of points
   * 
   * @param {Point[]} points 
   * @returns total euclidean length
   */
  static totalLength(points) {
    let distance = 0;
    
    for(let i = 0; i < points.length; i++) {
      distance += 
          points[i].distance(points[(i + 1) % points.length]);
    }

    return distance;
  };

  /**
   * Compute the change in path distance if a path from A to B
   * is swapped with a path from C to D.
   * 
   * A negative delta signifies that the swap reduces squared
   * distance.
   * 
   * @param {Point} pointA
   * @param {Point} pointB
   * @param {Point} pointC
   * @param {Point} pointD
   * @returns the squared distance delta
   */
  static squaredDelta(pointA, pointB, pointC, pointD) {
    let currentLength = pointA.distanceSquared(pointB)
        + pointC.distanceSquared(pointD);
    
    let newLength = pointA.distanceSquared(pointC)
        + pointB.distanceSquared(pointD);

    return newLength - currentLength;
  }

}