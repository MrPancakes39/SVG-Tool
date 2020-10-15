function setup() {
	setupCanvas();
	setupTools();
	setupOptions();
	setupButtons();
	setupCubic();
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

function output(text) {
	outputBox = $("#output_field")[0];
	outputBox.textContent = text;
}

function clearOutput() {
	outputBox.textContent = "";
}

function repStr(str) {
	let newStr = str.split("+ -").join("- ");
	return newStr
}