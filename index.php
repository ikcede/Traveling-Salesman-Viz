<!doctype html>
<html>
<head>

<!-- This file is the main display file, used to render all 
	 the UI and run the Javascript -->

<title>Travelling Salesman</title>

<link rel="stylesheet" href="bootstrap.min.css">

<script type="text/javascript" src="jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="d3.v3.min.js"></script>
<script type="text/javascript" src="data.js"></script>
<script type="text/javascript" src="functions.js"></script>
<script type="text/javascript" src="js.js"></script>

<style>

body {
	text-align:center;
}

#content {
	position:fixed;
	left:5%;
	top:0px;
	width:90%;
	height:100%;
	
	margin: auto;
	padding-top:25px;
	overflow-y:auto;
	
	background:white;
	text-align:left;
	
	border-left:1px solid lightgrey;
	border-right:1px solid lightgrey;
}

.pane {
	border: 1px solid lightgrey;
	border-radius:10px;
	height:95%;
	overflow-y:auto;
	overflow-x:hidden;
	padding:10px;
}

#left-pane {
	float:left;
	width:25%;
	margin-left:25px;
}

#left-pane textarea {
	min-height:100px;
}

#n-points {
	max-width:125px;
}

#right-pane {
	float:right;
	width:70%;
	margin-right:25px;
}

line {
	stroke-width:1px;
	stroke:silver;
}

text {
	font-family:Inconsolata, monospace;
}

.red {
	color:red;
}

</style>

</head>

<body>

<div id="content">
	
	<div id="left-pane" class="pane">
		
		<!-- Input control -->
		<input type="file" id="input-file" name="files[]" />&nbsp;&nbsp;
		<br>
		<strong>Input:</strong>
		<textarea id='text-input' class='form-control'>0.0  1.0  2.0  0.0  2.0  1.0
0.0  2.0  0.0  1.0  1.0  0.0</textarea>
		<br>
		N-points: <input type='text' id='n-points'></input>&nbsp;
		<button id='generate-points' class="btn btn-default">Use</button>
		<br><br>
		<button id="apply-input" class="btn btn-default">Load!</button>
		
		<hr>
		<!-- Interactions and settings -->
		<button id="step-button" class="btn btn-default">Step forward</button>
		<button id="run-button" class="btn btn-default">Run to completion</button>
		<br><span class="red" id="salesman-end"></span><br><br>
		Algorithm:
		<select id="algorithm" class="form-control">
			<option value='simple'>Simple (2-opt swap)</option>
			<option value='faster' selected>Faster (2-opt swap)</option>
		</select>
		<br>
		Delay: <input id="delay" type="text" value="250"></input>
		
		<br><br>
	
	</div>
	
	<div id="right-pane" class="pane">
	
		<svg id="display"></svg>
	
	</div>
</div>

</body>
</html>