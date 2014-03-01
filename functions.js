
// This file contains the core functions and objects used in running the program

// ---------------------------------------------
// Travelling Salesman Setup
// ---------------------------------------------

// Global to control the stepping and count iterations
var t_step = 0;

// Gets the Euclidian distance between 2 points (||2 norm)
var ll2 = function(a, b) {
	if(a.x) return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

// **Data definition: state is a path connecting all points
// This will be represented by the order of points in the "points" variable
// Each item in a state will refer to the index of a point in "points"
var global_state = null;
var global_max = null;

// Keeps track of past states
var states = [];
var state_limit = 10;

// Allows stopping and starting of the algorithm
var global_running = false;

// Init the algorithm
var init_salesman = function() {
	t_step = 0;
	
	state = [];
	for(i in points) {
		state.push(i);
	}
	states = [state];
	global_state = state;
	global_max = path_length(state);
	
	return state;
};

// ---------------------------------------------
// Travelling Salesman Core functions
// ---------------------------------------------

// Compute the path through an entire state
// This a heuristic function allowing for a swap of two indices
// i and j are optional swap parameters
var path_length = function(state, i, j) {
	var len = 0;
	for(var index=0;index<state.length;index++) {
		var left = index;
		var next = (index + 1)%state.length;
		
		if(left == i) left = j;
		else if(left == j) left = i;
		if(next == j) next = i;
		else if(next == i) next = j;
		len += ll2(points[state[left]], points[state[next]]);
	}
	return len;
};

// Executes a swap in a state, where change is [i, j], the indices to swap
var swap = function(state, change) {

	if(change) {
	
		// Actual swap occurs here
		var temp = state[change[0]];
		state[change[0]] = state[change[1]];
		state[change[1]] = temp;
		
		// The rest is just diagnostics
		t_step++;
		states.push(state);
		
		if(states.length > state_limit) {
			states.splice(0,1);
		}
		
		global_state = state;
		console.log("Swap " + change[0] + " and " + change[1]);
		
		return state;
	} 
	
	// No change
	return false;
};

// Steps though the salesman using algorithm based on input
// Almost a switching function that determines the algorithm used
var step_salesman = function(algo) {
	if(algo == "simple") {
		var state = simple_step(global_state, global_max);
		if(state) {
			print_state(state);
			return true;
		} 
		console.log("End of hill climbing.");
		return false;
	}
	
	else if(algo == "faster") {
		var state = faster_step(global_state, global_max);
		if(state) {
			print_state(state);
			return true;
		} 
		console.log("End of hill climbing.");
		return false;
	}
	
	return false;
};

// ---------------------------------------------
// Simple function
// ---------------------------------------------

// Allows stepping through of simple algorithm
var simple_step = function(state, max) {
	if(typeof(max) === "undefined") max = path_length(state);
	var testmax = 0;
	var change = false;
	
	console.log("Length = "+max);
	
	// Test swaps
	for(var i=0;i<state.length;i++) {
		for(var j=i+1;j<state.length;j++) {
			testmax = path_length(state, i, j);
			if(testmax < max) {
				change = [i, j];
				max = testmax;
			}
		}
	}
	
	global_max = max;
	
	return swap(state, change);
	
};

// ---------------------------------------------
// Faster function (improved algorithm)
// ---------------------------------------------

// Computes the effective change in path length given a swap
var path_difference = function(state, i, j) {
	
	var original = 0;
	var new_length = 0;
	
	// Compute path lengths next to i and j
	if(j == i + 1) {
		var prev = i - 1;
		var next = (j + 1)%points.length;
		if(prev < 0) prev = points.length - 1;
		
		original += ll2(points[state[prev]], points[state[i]]);
		original += ll2(points[state[j]], points[state[next]]);
		
		new_length += ll2(points[state[prev]], points[state[j]]);
		new_length += ll2(points[state[i]], points[state[next]]);
		
		return new_length - original;
	}
	
	// Edge case
	if(i == 0 && j == state.length - 1) {
		var prev = j - 1;
		var next = (i + 1)%points.length;
		
		original += ll2(points[state[prev]], points[state[j]]);
		original += ll2(points[state[i]], points[state[next]]);
		
		new_length += ll2(points[state[prev]], points[state[i]]);
		new_length += ll2(points[state[j]], points[state[next]]);
		
		return new_length - original;
	}
	
	// Otherwise need 4 paths
	var prev_i = i - 1;
	var next_i = (i + 1)%points.length;
	var prev_j = j - 1;
	var next_j = (j + 1)%points.length;
	
	if(prev_j < 0) prev_j = points.length - 1;
	if(prev_i < 0) prev_i = points.length - 1;
	
	original += ll2(points[state[prev_i]], points[state[i]]);
	original += ll2(points[state[next_i]], points[state[i]]);
	original += ll2(points[state[prev_j]], points[state[j]]);
	original += ll2(points[state[next_j]], points[state[j]]);
	
	new_length += ll2(points[state[prev_i]], points[state[j]]);
	new_length += ll2(points[state[next_i]], points[state[j]]);
	new_length += ll2(points[state[prev_j]], points[state[i]]);
	new_length += ll2(points[state[next_j]], points[state[i]]);
	
	return new_length - original;

};

// Improves the algorithm by only computing necessary edges
var faster_step = function(state, max) {
	if(typeof(max) === "undefined") max = path_length(state);
	var testmin = 0;
	var min = 0;
	var change = false;
	
	console.log("Length = "+max);
	
	// Test swaps
	for(var i=0;i<state.length;i++) {
		for(var j=i+1;j<state.length;j++) {
			testmin = path_difference(state, i, j);
			if(testmin < min) {
				change = [i, j];
				min = testmin;
			}
		}
	}
	
	global_max += min;
	
	return swap(state, change);
	
};

// ---------------------------------------------
// Data manipulation
// ---------------------------------------------

// Creates points from corresponding x and y values
var generatePoints = function(x, y) {
	var pts = [];
	for(var i in x) {
		points.push([x[i], y[i]]);
	}
	return points;
};

// Parses data into points
var parseData = function(data) {
	var x = [];
	var y = [];

	// Break data into tokens
	var portions = data.split("\n");
	
	if(portions.length != 2) return false;
	portions[0] = portions[0].replace(/\s+/g, ' ').split(" ");
	portions[1] = portions[1].replace(/\s+/g, ' ').split(" ");
	
	// Deal in input errors
	if(portions[0].length != portions[1].length || portions[0].length == 0) {
		return false;
	}
	
	// Generate points and turn into Numbers
	var points = [];
	for(var i in portions[0]) {
		x.push(Number(portions[0][i]));
		y.push(Number(portions[1][i]));
		points.push([x[i],y[i]]);
	}
	
	return {x: x, y: y, points: points};
};

// Get the min and max of a set of values
var min_max = function(data) {
	var min = data[0];
	var max = data[0];
	
	for(var i=1;i<data.length;i++) {
		if(data[i] > max) {
			max = data[i];
		} 
		if(data[i] < min) {
			min = data[i];
		}
	}
	return {max: max, min: min};
};

