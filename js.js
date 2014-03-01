
// -------------------------------------------------
// Printing and Visuals
// -------------------------------------------------

// Prints the state into the console
var print_state = function(state) {
	var x = "";
	var y = "";
	
	for(i in state) {
		x += points[state[i]][0] + " ";
		y += points[state[i]][1] + " ";
	}
	
	console.log(x);
	console.log(y);
};

// Initializes the points into the svg
var first_render = function(state) {
	// Clean display and select
	var svg = d3.select("#display");
	$("#display").html("");
	
	// Set up width and scales
	var svg_width = $("#display").width();
	var svg_height = $("#display").height();
	
	var extrema = min_max(x_points);
	
	var scale_x = d3.scale.linear();
	scale_x.domain([extrema.min-2,extrema.max+2]);
	scale_x.range([10, svg_width-10]);
	
	extrema = min_max(y_points);
	
	var scale_y = d3.scale.linear();
	scale_y.domain([extrema.min-1,extrema.max+1]);
	scale_y.range([svg_height-10, 10]);
	
	// Draw lines
	svg.selectAll("line").data(state).enter()
		.append("line")
		.attr("x1", function(d) {
			return scale_x(points[d][0]);
		})
		.attr("y1", function(d) {
			return scale_y(points[d][1]);
		})
		.attr("x2", function(d,i) {
			return scale_x(points[state[(i+1)%state.length]][0]);
		})
		.attr("y2", function(d,i) {
			return scale_y(points[state[(i+1)%state.length]][1]);
		});
		
	// Draw points
	svg.selectAll("circle").data(state).enter()
		.append("circle")
		.attr("r", 5)
		.attr("cx", function(d) {
			return scale_x(points[d][0]);
		})
		.attr("cy", function(d) {
			return scale_y(points[d][1]);
		});
	
	// Draw text data	
	svg.append("text")
		.attr("id", "length-text")
		.attr("x", 0)
		.attr("y",15)
		.text("Length = " + global_max);
	
	svg.append("text")
		.attr("id", "step-text")
		.attr("x", 0)
		.attr("y",30)
		.text("Step = " + t_step);

};

// Renders a new state into the svg
var render_state = function(state) {
	
	// Clean display and select
	var svg = d3.select("#display");
	
	// Set up width and scales
	var svg_width = $("#display").width();
	var svg_height = $("#display").height();
	
	// Calculate scales
	var extrema = min_max(x_points);
	
	var scale_x = d3.scale.linear();
	scale_x.domain([extrema.min-2,extrema.max+2]);
	scale_x.range([10, svg_width-10]);
	
	extrema = min_max(y_points);
	
	var scale_y = d3.scale.linear();
	scale_y.domain([extrema.min-1,extrema.max+1]);
	scale_y.range([svg_height-10, 10]);
	
	// Draw lines
	svg.selectAll("line").data(state)
		.transition()
		.duration(250)
		.attr("x1", function(d) {
			return scale_x(points[d][0]);
		})
		.attr("y1", function(d) {
			return scale_y(points[d][1]);
		})
		.attr("x2", function(d,i) {
			return scale_x(points[state[(i+1)%state.length]][0]);
		})
		.attr("y2", function(d,i) {
			return scale_y(points[state[(i+1)%state.length]][1]);
		});
	
	// Draw text data	
	svg.select("#length-text")
		.text("Length = " + global_max);
	
	svg.select("#step-text")
		.text("Step = " + t_step);
	
};

// -------------------------------------------------
// UI functions
// -------------------------------------------------

// Generates N points, from [0, 0] to [size, size] depending on size of N
// Some points may be the same
var generate_n_points = function(n) {
	var size = 3;
	if(n > 10) size = 10;
	if(n > 100) size = 50;
	if(n > 1000) size = 200;
	if(n > 10000) size  = 400;
	
	// Randomly choose points with uniform distribution [size, size]
	var picked_points = [];
	for(var i=0;i<n;i++) {
		picked_points.push([Math.random()*size, Math.random()*size]);
	}
	
	return picked_points;
};

// -------------------------------------------------
// Past this point, everything is used for setting up UI and objects
// -------------------------------------------------
$(document).ready(function() {
	
	// Startup salesman
	points = generatePoints(x_points, y_points);
	init_salesman();
	first_render(global_state);
	
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  	
	  	$("#input-file").on("change", function(e) {
	  		var reader = new FileReader();
	  		var file = e.target.files[0];
	  		
	  		reader.onloadend = function() {
	  			var result = this.result;
	  			
	  			$("#text-input").val(result);
	  		};
	  		
	  		reader.readAsText(file)
	  		$("#apply-input").click();
	  	});
	  	
	}
	
	$("#apply-input").on("click", function() {
		
		var parsed = parseData($("#text-input").val());
		console.log(parsed);
		
		if(!parsed) {
			$("#text-input").val("Bad input\n"+$("#text-input").val());
			return true;
		}
		
		$("#salesman-end").text("");
		
		// Set all globals
		x_points = parsed.x;
		y_points = parsed.y;
		points = parsed.points;
		
		init_salesman();
		first_render(global_state);
	
	});
	
	$("#step-button").on("click", function() {
		if(step_salesman($("#algorithm").val())) {
			render_state(global_state);
		} else {
			$("#salesman-end").text("Hill climbing ended!");
		}
	});	
	
	$("#generate-points").on("click", function() {
		if($("#n-points").val().replace(/\s+/g, '') != "") {
			var gen = generate_n_points($("#n-points").val());
			
			var s = "";
			for(var i=0;i<gen.length;i++) {
				s += gen[i][0] + " ";
			}
			s += "\n";
			for(var i=0;i<gen.length;i++) {
				s += gen[i][1] + " ";
			}
			$("#text-input").val(s);
			$("#apply-input").click();
		}
	});
	
	$("#run-button").on("click", function() {
	
		// Closure
		var the_button = this;
	
		if(global_running) {
			$(the_button).html("Run to completion").addClass('btn-default').removeClass('btn-danger');
			global_running = false;
			return;
		} else {
			$(the_button).html("Stop").addClass('btn-danger').removeClass('btn-default');
			global_running = true;
		}
	
		var delay = $("#delay").val();
		var algo = $("#algorithm").val();
		if(delay != "" && delay>0) {
		
			var thread = function() {
				if(!global_running) return false;
				var test = step_salesman(algo);
				if(test) {
					render_state(global_state);
					setTimeout(function() {
						thread();
					}, Number(delay));
				}
				else {
					$("#salesman-end").text("Hill climbing ended!");
					$(the_button).click();
				} // End
			};
		
			thread();
		}
		
		else {
			while(global_running && step_salesman(algo)) {}
			render_state(global_state);
			$("#salesman-end").text("Hill climbing ended!");
			$(the_button).click();
		}
	});	
	
});