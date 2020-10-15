let takeM = {};
let pathProps = {};
let drawCanvas = false;
let showPoints = false;
let Transformed = false;
let cPoints = [];
let xScaled = [];
let yScaled = [];

function setup() {
	setupCanvas();
	setupTools();
	setupProperties();
	setupOptions();
	setupButtons();
}

function draw() {
	background("#666666");
	if (drawCanvas && !Transformed) {
		strokeWeight(1);
		for (let i = 0; i < xMapped.length + 1; i++) {
			point(xMapped[i], yMapped[i]);
		}
	}
	if (Transformed) {
		strokeWeight(1);
		for (let i = 0; i < xScaled.length + 1; i++) {
			point(xScaled[i], yScaled[i]);
		}
	}
	if (showPoints) {
		for (let i = 0; i < cPoints.length; i++) {
			cPoints[i].show();
		}
	}
}

function mousePressed() {
	for (let i = 0; i < cPoints.length; i++) {
		if (cPoints[i].pointInEllipse(mouseX, mouseY)) {
			cPoints[i].changeColor();
		}
	}
}

function setupCanvas() {
	canvas = createCanvas(240, 240);
	background("#666666");
	canvas.id("canvas");

	canvasMove = document.getElementById("canvas");
	tempBtn = document.getElementById("loadPathButton");
	document.getElementById("advanced").insertBefore(canvasMove, tempBtn);
}

function setupButtons() {
	clearButton = select("#clearButton");
	clearButton.mousePressed(clearOutput);

	loadPathButton = select("#loadPathButton");
	loadPathButton.mousePressed(loadThePath);

	transformButton = select("#transformButton");
	transformButton.mousePressed(transformPath);

	showPointsButton = select("#showPointsButton");
	showPointsButton.mousePressed(displayPoints);

	submitPointsButton = select("#submitCustomButton");
	submitPointsButton.mousePressed(submitPoints);
}

function output(text) {
	outputBox = document.getElementById("output_field");
	outputBox.textContent = text;
}

function clearOutput() {
	outputBox.textContent = "";
}

function getPoints() {
	xDraws = [];
	yDraws = [];

	for (let i = 0; i <= lenPath; i += lenPath / 1999) {
		let p = path.getPointAtLength(i);
		xDraws.push(p.x);
		yDraws.push(p.y);
	}

	xMapped = [];
	yMapped = [];

	for (let i = 0; i < xDraws.length; i++) {
		let xMap = map(xDraws[i], 0, takeM.w, 0, takeM.wSVG);
		let yMap = map(yDraws[i], 0, takeM.h, 0, takeM.hSVG);

		xMapped.push(xMap);
		yMapped.push(yMap);
	}

	let arrX = xMapped.slice().sort(function (a, b) {
		return a - b
	});
	let arrY = yMapped.slice().sort(function (a, b) {
		return a - b
	});

	pathProps.sx = arrX[0];
	pathProps.sy = arrY[0];
	pathProps.ex = arrX[arrX.length - 1];
	pathProps.ey = arrY[arrY.length - 1];

	pathProps.pathW = pathProps.ex - pathProps.sx;
	pathProps.pathH = pathProps.ey - pathProps.sy;

	output("The Path is ready to load.");
}

function loadThePath() {
	clearOutput();
	Transformed = false;
	showPoints = false;
	drawCanvas = true;
	cPoints = [];
}

function transformPath() {
	xTrans = [];
	yTrans = [];

	for (let i = 0; i < xDraws.length; i++) {
		xTrans[i] = xMapped[i] - pathProps.sx + 5;
		yTrans[i] = yMapped[i] - pathProps.sy + 5;
	}

	if (pathProps.pathH <= pathProps.pathW) {
		scale = (width - 10) / (pathProps.pathW + 10);
	} else {
		scale = (height - 10) / (pathProps.pathH + 10);
	}

	xScaled = [];
	yScaled = [];

	for (let i = 0; i < xDraws.length; i++) {
		xScaled[i] = xTrans[i] * scale;
		yScaled[i] = yTrans[i] * scale;
	}

	Transformed = true;

	showPoints = false;
}

function displayPoints() {
	if (Transformed) {
		if (cPoints.length == 0) {
			cPoints = [];

			let ratio = round(xScaled.length / 24);
			for (let i = 0; i <= xScaled.length; i += ratio) {
				cPoint = new Point(xScaled[i], yScaled[i]);
				cPoints.push(cPoint);
			}
			if (cPoints[cPoints.length - 1].x !== xScaled[xScaled.length - 1]) {
				cPoints.pop();
				cPoint = new Point(xScaled[xScaled.length - 1], yScaled[yScaled.length - 1]);
				cPoints.push(cPoint);
			}
		}
		showPoints = true;
	} else {
		output("Points Are Only Visible While The Path is Tranformed!");
	}
}

function submitPoints() {
	if (showPoints) {
		output("Points submitted");

		xValues = [];
		yValues = [];

		for (let i = 0; i < cPoints.length; i++) {
			if (cPoints[i].color == cPoints[i].colorP) {
				let dex = xScaled.indexOf(cPoints[i].x);
				xValues.push(xDraws[dex]);
				yValues.push(yDraws[dex]);

				//xValues.push(cPoints[i].x);
				//yValues.push(cPoints[i].y);
			}
		}

		//console.log(xValues.length);

		if (xValues.length - 1 == 0) {
			let tmpString = `x: ${xValues[0]}, y: ${yValues[0]}`;

			console.log(`Infinity Error!!\n`, tmpString);
			output(`Infinity Error!!\n` + tmpString);

			xValues = [];
			yValues = [];
		}
	} else {
		output("You need the points to be visible to be able to submit.");
	}
}