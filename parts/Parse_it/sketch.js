let xValues = [];
let yValues = [];
let blob = [];
let p1, p2;

function setup() {
	noCanvas();

	// Creates a "choose file" button.
	createFileInput(fileSelected);

	// Creates a variable from the existing button in html.
	const cButton = select("#createTextButton");
	cButton.mousePressed(createBlob);

	const lButton = select("#LIPButton");
	lButton.mousePressed(generateLIP);

	//Creates two <p> elements and hides them.
	p1 = createP("Ready");
	p1.hide();

	p2 = createP("It's not continuous.");
	p2.hide();
}

// Checks the file selected if it's a text file and initiates getData();
function fileSelected(file) {
	if (file.type == "text" && file.subtype == "plain") {
		getData(file.data);
	} else {
		createP("I need a text file.");
	}
}

// Gets the data from the file selected and parse it.
async function getData(data) {
	let points = [];
	xValues = [];
	yValues = [];

	p1.hide();
	p2.hide();
	console.log(data);

	points = data.split(" ");
	console.log(points);
	points.forEach(coordinates => {
		const points = coordinates.split(",");
		const xValue = points[0];
		const yValue = points[1];

		xValues.push(xValue);
		yValues.push(yValue);
	})
	p1.show();
	console.log(xValues);
	console.log(yValues);
}

// Saves the coordinates as a list in a text file.
function createBlob() {
	blob = [];
	for (let i = 0; i < xValues.length; i++) {
		blob.push("x: " + String(xValues[i]) + ", y: " + String(yValues[i]))
	}
	saveStrings(blob, 'coodrinateList.txt');
}

// Generates Lagrange Interpolating Polynomial using the coordinates.
// Then saves it the equation as a text file.

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
	p2.hide();

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
		p2.show();
	}
}

// Checks if the curve is continuous.
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