
// Set up global variables
let xValues = basicDataset.starter.x;
let yValues = basicDataset.starter.y;

let points = generatePoints(xValues, yValues);
let travelingSalesman = null;

/**
 * Converts xValues and yValues into a string
 * 
 * @param {number[]} x 
 * @param {number[]} y 
 * @returns string of joined values
 */
let pointsToText = (x, y) => {
  return x.join(' ') + '\n' + y.join(' ');
};

// -------------------------------------------------
// Set up the UI and listeners
// -------------------------------------------------
$(document).ready(function() {
	
	// Startup salesman
  travelingSalesman = new TravelingSalesman(points);
	salesmanViz = new SalesmanViz(travelingSalesman, $('#display').get(0));
  salesmanViz.render();

  $('#text-input').val(pointsToText(xValues, yValues));
	
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  	
	  	$('#input-file').on('change', function(e) {
	  		let reader = new FileReader();
	  		let file = e.target.files[0];
	  		
	  		reader.onloadend = function() {
	  			let result = this.result;
	  			
	  			$('#text-input').val(result);
	  		};
	  		
	  		reader.readAsText(file);
	  		$('#apply-input').click();
	  	});
	  	
	}
	
	$('#apply-input').on('click', function() {
		let parsed = parseStringInput($('#text-input').val());
		
		if (!parsed) {
			$('#text-input').val('Bad input\n'+$('#text-input').val());
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
	
	$('#step-button').on('click', function() {
		if (travelingSalesman.stepForward()) {
			salesmanViz.render();
		} else {
			$('#salesman-end').text('No improvements found!');
		}
	});	
	
	$('#generate-points').on('click', function() {
		if($('#n-points').val().replace(/\s+/g, '') != '') {
			let gen = generateNPoints($('#n-points').val());
			
		  let s = '';
			for(let i = 0; i < gen.length; i++) {
				s += gen[i][0] + " ";
			}
			s += '\n';
			for(let i = 0; i < gen.length; i++) {
				s += gen[i][1] + " ";
			}
			$('#text-input').val(s);
			$('#apply-input').click();
		}
	});
	
	$('#run-button').on('click', function() {
    travelingSalesman.run();
    salesmanViz.render();
    /*
		// Closure
		let the_button = this;
	
		if(global_running) {
			$(the_button).html('Run to completion').addClass('btn-default').removeClass('btn-danger');
			global_running = false;
			return;
		} else {
			$(the_button).html('Stop').addClass('btn-danger').removeClass('btn-default');
			global_running = true;
		}
	
		let delay = $('#delay').val();
		if(delay != '' && delay > 0) {
		
			let thread = function() {
				if(!global_running) return false;
				let test = travelingSalesman.stepForward();
				if (test) {
					render_state(global_state);
					setTimeout(function() {
						thread();
					}, Number(delay));
				}
				else {
					$('#salesman-end').text('Hill climbing ended!');
					$(the_button).click();
				} // End
			};
		
			thread(); 
		}
		
		else {
			while(global_running && step_salesman(algo)) {}
			render_state(global_state);
			$('#salesman-end').text('Hill climbing ended!');
			$(the_button).click();
		} */
	});

  // Update the svg on resize
  $(window).on('resize', () => {
    salesmanViz.updateScales();
    salesmanViz.render();
  });
	
});