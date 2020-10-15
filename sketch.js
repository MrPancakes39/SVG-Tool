let svg, path;
let w, h, newW, newH;
let viewDiv, toolsDiv, propertiesDiv, optionsDiv;
let xValues = [];
let yValues = [];
let l, pathGotSelected = false;

function setup() {
	noCanvas();
	createPage();
}

function createPage() {
	createDivs();
	createElements();
	posSVG();
}

function createDivs() {
	let mainDiv = createDiv("");
	mainDiv.attribute("id", "main");

	let topDiv = createDiv("");
	topDiv.attribute("id", "top");
	mainDiv.child(topDiv);

	let bottomDiv = createDiv("");
	bottomDiv.attribute("id", "bottom");
	mainDiv.child(bottomDiv);

	viewDiv = createDiv("");
	viewDiv.attribute("id", "view");
	topDiv.child(viewDiv);

	toolsDiv = createDiv("");
	toolsDiv.attribute("id", "tools");
	topDiv.child(toolsDiv);

	propertiesDiv = createDiv("");
	propertiesDiv.attribute("id", "properties");
	bottomDiv.child(propertiesDiv);

	optionsDiv = createDiv("");
	optionsDiv.attribute("id", "options");
	bottomDiv.child(optionsDiv);
}

function createElements() {
	svg = document.getElementById("svg");
	nPaths = svg.childElementCount;

	createTitles();
	createTools();
	createProperties();
	createOptions();
}

function createTitles() {
	let h1 = createElement("h2");
	let title1 = createElement("ins", "View SVG:");
	title1.parent(h1);
	viewDiv.child(h1);

	let h2 = createElement("h2");
	let title2 = createElement("ins", "Tools:");
	title2.parent(h2);
	toolsDiv.child(h2);

	let h3 = createElement("h2");
	let title3 = createElement("ins", "Properties:");
	title3.parent(h3);
	propertiesDiv.child(h3);

	let h4 = createElement("h2");
	let title4 = createElement("ins", "Options:");
	title4.parent(h4);
	optionsDiv.child(h4);
}

function createTools() {
	let p1 = createP("SVG's code");
	svgLoad = createInput("");
	toolsDiv.child(p1);
	toolsDiv.child(svgLoad);

	let p2 = createP("");
	button = createButton("Load SVG");
	button.mousePressed(loadSVG);
	toolsDiv.child(p2);
	toolsDiv.child(button);

	let h1 = createElement("h3");
	let title1 = createElement("ins", "Custom:");
	title1.parent(h1);
	toolsDiv.child(h1);

	button2 = createButton("Original Size");
	button2.mousePressed(returnSize);
	toolsDiv.child(button2);

	button3 = createButton("Revert Size");
	button3.mousePressed(revertSize);
	toolsDiv.child(button3);

	let p3 = createP("");
	setW = createInput("");
	toolsDiv.child(p3);
	toolsDiv.child(setW);

	let p4 = createP("");
	button4 = createButton("Set Width");
	button4.mousePressed(setWidth);
	toolsDiv.child(p4);
	toolsDiv.child(button4);

	let p5 = createP("");
	setH = createInput("");
	toolsDiv.child(p5);
	toolsDiv.child(setH);

	let p6 = createP("");
	button5 = createButton("Set Height");
	button5.mousePressed(setHeight);
	toolsDiv.child(p6);
	toolsDiv.child(button5);
}

function createProperties() {
	let pw = createP("Width: -");
	let ph = createP("Height: -");

	pw.id("pw");
	ph.id("ph");

	propertiesDiv.child(pw);
	propertiesDiv.child(ph);

	let np = createP("Number of Paths: -");
	let pl = createP("Selected Path Length: -");

	np.id("np");
	pl.id("pl");

	propertiesDiv.child(np);
	propertiesDiv.child(pl);
}

function updateSVGProperties(wc, hc) {
	pw = document.getElementById("pw");
	ph = document.getElementById("ph");

	document.getElementById("properties").removeChild(pw);
	document.getElementById("properties").removeChild(ph);

	pw = createP("Width: " + wc);
	ph = createP("Height: " + hc);

	pw.id("pw");
	ph.id("ph");

	propertiesDiv.child(pw);
	propertiesDiv.child(ph);

	updateNPathsProperties(nPaths);
	if (pathGotSelected) {
		updatePathLength();
	}
}

function updateNPathsProperties(nPaths) {
	np = document.getElementById("np");
	pl = document.getElementById("pl");

	document.getElementById("properties").removeChild(np);
	document.getElementById("properties").removeChild(pl);

	np = createP("Number of Paths: " + nPaths);
	pl = createP("Selected Path Length: -");

	np.id("np");
	pl.id("pl");

	propertiesDiv.child(np);
	propertiesDiv.child(pl);
}

function updatePathLength() {
	l = path.getTotalLength();
	pl = document.getElementById("pl");

	document.getElementById("properties").removeChild(pl);

	pl = createP("Selected Path Length: " + String(l));
	pl.id("pl");

	propertiesDiv.child(pl);
}

function createOptions() {
	let p7 = createP("Select a Path: ");
	p7.style("font-size", "14px");
	selPath = createInput("");
	selPath.style("width", "24px")
	selPath.parent(p7);

	let submit = createButton("Submit");
	submit.style("margin", "4px");
	submit.parent(p7);

	submit.mousePressed(selectedPath);
	optionsDiv.child(p7);

	let p8 = createP("How many points?: ");
	p8.style("font-size", "13.5px");
	nPoints = createInput("");
	nPoints.style("width", "10px")
	nPoints.style("margin", "0px")
	nPoints.parent(p8);

	let submit2 = createButton("OK");
	submit2.style("width", "30px");
	submit2.style("margin", "4px");
	submit2.style("padding", "0px");
	submit2.parent(p8);

	submit2.mousePressed(coordinatePoints);
	optionsDiv.child(p8);

	const cButton = createButton("Download Coordinate List");
	cButton.mousePressed(createBlob);

	let p9 = createP("");
	const lButton = createButton("Download a Lagrange Curve Equation");
	lButton.mousePressed(generateLIP);

	cButton.id("createTextButton");
	lButton.id("LIPButton");

	optionsDiv.child(cButton);
	optionsDiv.child(p9);
	optionsDiv.child(lButton);
}

function selectedPath() {
	if (0 < selPath.value() && selPath.value() < (nPaths + 1)) {
		let pathName = "Path-" + selPath.value();
		path = document.getElementById(pathName);
		pathGotSelected = true;
		updatePathLength();
	} else {
		console.log("Not a valid path value!!");
	}
}

function coordinatePoints() {
	xValues = [];
	yValues = [];

	if (nPoints.value() - 1 == 0) {
		console.log("Infinity Error!!");
	} else {
		let n = l / (nPoints.value() - 1);
		for (let i = 0; i <= l; i += n) {
			let p = path.getPointAtLength(i);
			xValues.push(p.x);
			yValues.push(p.y);
		}

		//console.log(xValues);
		//console.log(yValues);
	}
}

function posSVG() {
	let p5svg = select("#svg");
	p5svg.hide();

	let temp = document.createElement("p");
	temp.setAttribute("id", "temp");
	document.getElementById("view").appendChild(temp);

	let svgMove = document.getElementById("svg");
	document.getElementById("view").insertBefore(svgMove, temp);

	p5svg.show();
	document.getElementById("view").removeChild(temp);
}

function loadSVG() {
	document.getElementById("view").removeChild(svg);

	let temp = document.createElement("div");
	temp.setAttribute("id", "temp");
	temp.innerHTML = svgLoad.value();
	document.getElementById("view").appendChild(temp);

	let svgMove = document.getElementById("svg");
	document.getElementById("view").insertBefore(svgMove, temp);

	document.getElementById("view").removeChild(temp);

	svg = document.getElementById("svg");

	w = svg.getAttribute("width");
	h = svg.getAttribute("height");
	let scale;

	if (w <= h) {
		scale = 240 / h;
	} else {
		scale = 240 / w;
	}

	newH = String(h * scale);
	newW = String(w * scale);

	svg.setAttribute("width", newW);
	svg.setAttribute("height", newH);

	updateSVGProperties(newW, newH);
	updateNPathsProperties(nPaths);
}

function returnSize() {
	svg.setAttribute("width", w);
	svg.setAttribute("height", h);
	updateSVGProperties(w, h);
}

function revertSize() {
	svg.setAttribute("width", newW);
	svg.setAttribute("height", newH);
	updateSVGProperties(newW, newH);
}

function setWidth() {
	let customW = float(setW.value());
	let scale = customW / w;
	let customH = h * scale;

	svg.setAttribute("width", String(customW));
	svg.setAttribute("height", String(customH));
	updateSVGProperties(customW, customH);
}

function setHeight() {
	let customH = float(setH.value());
	let scale = customH / h;
	let customW = w * scale;

	svg.setAttribute("width", String(customW));
	svg.setAttribute("height", String(customH));
	updateSVGProperties(customW, customH);
}

function createBlob() {
	blob = [];
	for (let i = 0; i < xValues.length; i++) {
		blob.push("x: " + String(xValues[i]) + ", y: " + String(yValues[i]))
	}
	saveStrings(blob, 'coodrinateList.txt');
}

function generateLIP() {
	let i = 0;
	let j = 0;
	let k = 0;

	let den = 1;
	let nom = "";
	let equation = "";

	const noms = []
	const dens = [];

	let continuous = checkContinuity();

	if (continuous) {

		while (j < (xValues.length)) {

			if (k == (xValues.length)) {
				k = 0;
				j++;
				dens.push(den);
				den = 1;
				noms.push(nom + yValues[j - 1]);
				nom = "";
			}

			if (j == k) {
				k++;
			} else {
				den *= (float(xValues[j]) - float(xValues[k]));
				nom += ("(x - " + xValues[k] + ") * ");
				k++;
			}

		}

		while (i < ((yValues.length) - 1)) {
			equation += "{" + noms[i] + "} / {" + String(dens[i]) + "}" + " + ";
			i++;
		}

		if (i == ((yValues.length) - 1)) {
			equation += "{" + noms[i] + "} / {" + String(dens[i]) + "}";
		}

		saveStrings([equation], 'Curve.txt');

	} else {
		console.log("It's not continuous.")
	}
}

function checkContinuity() {
	let arr = xValues.slice().sort();
	let continuity = true;

	for (let i = 0; i < (arr.length - 1); i++) {
		if (arr[i + 1] == arr[i]) {
			continuity = false;
		}
	}
	return continuity;
}