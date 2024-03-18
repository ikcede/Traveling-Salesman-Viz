// ---------------------------------------------
// Data manipulation helpers
// ---------------------------------------------

/**
 * Creates points from corresponding x and y values
 * 
 * @param {number[]} xValues 
 * @param {number[]} yValues 
 * @returns a custom data object for d3
 */
let generatePoints = function(xValues, yValues) {
	let points = [];
	for(var i in xValues) {
		points.push(new Point(xValues[i], yValues[i]));
	}
	return points;
};

/**
 * Parse string data into Points
 * 
 * @param {string} stringInput 
 * @returns custom object to be passed to d3
 */
let parseStringInput = function(stringInput) {
	let xValues = [];
	let yValues = [];

	// Break data into tokens
	var sections = stringInput.split('\n');
	
	if(sections.length != 2) return false;
	sections[0] = sections[0].replace(/\s+/g, ' ').split(' ');
	sections[1] = sections[1].replace(/\s+/g, ' ').split(' ');
	
	// Deal with input errors
	if (sections[0].length != sections[1].length 
      || sections[0].length == 0) {
		return false;
	}
	
	// Generate points and turn into numbers
	for(let i in sections[0]) {
		xValues.push(Number(sections[0][i]));
		yValues.push(Number(sections[1][i]));
	}
	
	return {
    xValues: xValues,
    yValues: yValues,
    points: generatePoints(xValues, yValues)
  };
};

/**
 * Calculate both the min and max of a list of numbers
 * 
 * @param {number[]} data 
 * @returns an object with min and max properties
 */
let calculateMinMax = function(data) {
	let min = data[0];
	let max = data[0];
	
	for (let i = 1; i < data.length; i++) {
		if (data[i] > max) {
			max = data[i];
		} 
		if (data[i] < min) {
			min = data[i];
		}
	}
	return {max: max, min: min};
};

// Generates N points, from [0, 0] to [size, size] depending on size of N
// Some points may be the same
let generateNPoints = function(n) {
	let size = 3;
	if (n > 10) size = 10;
	if (n > 100) size = 50;
	if (n > 1000) size = 200;
	if (n > 10000) size = 400;
	
	// Randomly choose points with uniform distribution [size, size]
	let pickedPoints = [];
	for(let i = 0; i < n; i++) {
		pickedPoints.push([Math.random() * size, Math.random() * size]);
	}
	
	return pickedPoints;
};

// ---------------------------------------------
// Working with D3.js
// ---------------------------------------------

/**
 * Class wrapper for the visualization
 */
class SalesmanViz {

  // Stores a TravelingSalesman instance
  travelingSalesman = null;

  // Tracks the main svgNode
  svgNode = null;

  // Scale for X values
  scaleX = d3.scaleLinear();

  // Scale for Y values
  scaleY = d3.scaleLinear();

  // Sets the animation speed
  transitionSpeed = 250;

  constructor(travelingSalesman, svgNode) {
    this.travelingSalesman = travelingSalesman;
    this.svgNode = svgNode;

    this.updateScales();
  }

  /**
   * Sets up the proper scales
   */
  updateScales() {
    let points = this.travelingSalesman.data;

    let svgWidth = $(this.svgNode).width();
    let svgHeight = $(this.svgNode).height();

    let xValues = points.map((point) => point.x);
    let yValues = points.map((point) => point.y);

    let xExtrema = calculateMinMax(xValues);
    let yExtrema = calculateMinMax(yValues);

    this.scaleX.domain([xExtrema.min - 2, xExtrema.max + 2]);
	  this.scaleX.range([10, svgWidth - 10]);

    this.scaleY.domain([yExtrema.min - 1, yExtrema.max + 1]);
	  this.scaleY.range([svgHeight - 10, 10]);
  }

  /**
   * Renders everything
   */
  render() {
    this.renderLines();
    this.renderPoints();
    this.renderAnalytics();
  }

  /**
   * Rendering function for points
   */
  renderPoints() {
    let svg = d3.select(this.svgNode);
    let points = this.travelingSalesman.data;
    let scaleX = this.scaleX;
    let scaleY = this.scaleY;

    // Draw points
    svg.selectAll('circle').data(points)
        .join(
            (enter) => {
              return enter.append('circle');
            },
            (update) => update,
            (exit) => {
              return exit.remove();
            }
        )
        .attr('r', 6)
        .attr('cx', (point) => scaleX(point.x))
        .attr('cy', (point) => scaleY(point.y));
  }

  /**
   * Rendering function for lines
   */
  renderLines() {
    let svg = d3.select(this.svgNode);
    let svgWidth = $(this.svgNode).width();
    let svgHeight = $(this.svgNode).height();

    let points = this.travelingSalesman.data;
    let scaleX = this.scaleX;
    let scaleY = this.scaleY;
    let speed = this.transitionSpeed;

    // Draw points
    svg.selectAll('line').data(points)
        .join(
            (enter) => {
              // Lines will expand from the center
              return enter.append('line')
                  .attr('x1', svgWidth / 2)
                  .attr('y1', svgHeight / 2)
                  .attr('x2', svgWidth / 2)
                  .attr('y2', svgHeight / 2);
            },
            (update) => update,
            (exit) => {
              return exit.remove();
            }
        )
        .transition().duration(speed)
        .attr('x1', point => scaleX(point.x))
        .attr('y1', (point) => scaleY(point.y))
        .attr('x2', (point, i) =>
          scaleX(points[(i + 1) % points.length].x)
        )
        .attr('y2', (point, i) =>
          scaleY(points[(i + 1) % points.length].y)
        );
  }

  /**
   * Rendering function for analytics
   */
  renderAnalytics() {
    let svg = d3.select(this.svgNode);
    let lengthText = d3.select('#length-text');
    let stepText = d3.select('#step-text');

    if (lengthText.empty()) {
      lengthText = svg.append('text')
          .attr('id', 'length-text')
          .attr('x', 0)
          .attr('y', 15);
    }
    lengthText.text('length = ' + travelingSalesman.pathLength);

    if (stepText.empty()) {
      stepText = svg.append('text')
          .attr('id', 'step-text')
          .attr('x', 0)
          .attr('y', 30);
    }
    stepText.text('step = ' + travelingSalesman.step);
  }
}