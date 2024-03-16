let xValues = [0.0, 1.0, 2.0, 0.0, 2.0, 1.0];
let yValues = [0.0, 2.0, 0.0, 1.0, 1.0, 0.0];

let points = generatePoints(xValues, yValues);
let travelingSalesman = null;

/* Suboptimal: 
var x_points = [0.0, 1.0, 2.0, 0.0, 2.0, 1.0, 1.0, 2.0, 0.0, 1.0, 1.0, 1.0, 1.5];
var y_points = [0.0, 2.0, 0.0, 1.0, 1.0, 0.0, 1.0, 2.0, 2.0, 1.5, 0.5, 1.5, 1.0];

len = 11.943174758686338
*/

/* Same points, swap 5 and 6
var x_points = [0.0, 1.0, 2.0, 0.0, 2.0, 1.0, 1.0, 2.0, 0.0, 1.0, 1.0, 1.0, 1.5];
var y_points = [0.0, 2.0, 0.0, 1.0, 1.0, 1.0, 0.0, 2.0, 2.0, 1.5, 0.5, 1.5, 1.0];

len = 10.325140769936443
*/

// -------------------------------------------------
// Set up the UI and listeners
// -------------------------------------------------
$(document).ready(function() {
	
	// Startup salesman
  travelingSalesman = new TravelingSalesman(points);
	salesmanViz = new SalesmanViz(travelingSalesman, $('#display').get(0));
  salesmanViz.render();
	
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  	
	  	$('#input-file').on('change', function(e) {
	  		let reader = new FileReader();
	  		let file = e.target.files[0];
	  		
	  		reader.onloadend = function() {
	  			let result = this.result;
	  			
	  			$('#text-input').val(result);
	  		};
	  		
	  		reader.readAsText(file)
	  		$('#apply-input').click();
	  	});
	  	
	}
	
	$("#apply-input").on("click", function() {
		let parsed = parseStringInput($("#text-input").val());
		console.log(parsed);
		
		if(!parsed) {
			$("#text-input").val("Bad input\n"+$("#text-input").val());
			return true;
		}
		
		$('#salesman-end').text('');
		
		// Set all globals
		xValues = parsed.xValues;
		yValues = parsed.yValues;
		points = parsed.points;
		
		travelingSalesman.setData(points);
    salesmanViz.updateScales();
    salesmanViz.render();
	});
	
	$("#step-button").on("click", function() {
		if (travelingSalesman.stepForward()) {
			salesmanViz.render();
		} else {
			$("#salesman-end").text("Hill climbing ended!");
		}
	});	
	
	$("#generate-points").on("click", function() {
		if($("#n-points").val().replace(/\s+/g, '') != '') {
			let gen = generateNPoints($("#n-points").val());
			
		  let s = '';
			for(let i = 0; i < gen.length; i++) {
				s += gen[i][0] + " ";
			}
			s += '\n';
			for(let i = 0; i < gen.length; i++) {
				s += gen[i][1] + " ";
			}
			$("#text-input").val(s);
			$("#apply-input").click();
		}
	});
	
	$("#run-button").on("click", function() {
    /*
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
		} */
	});	
	
});