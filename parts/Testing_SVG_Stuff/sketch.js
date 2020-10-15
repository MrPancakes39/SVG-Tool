function setup() {
	noCanvas();
	fetching();

	let svg = document.getElementById("Path");

	console.log(svg);

	//let l = svg.getTotalLength();
	//console.log(l);
}

async function fetching() {
	const response = await fetch("SVG/SVG.min.svg");
	const data = await response.text();
	document.body.insertAdjacentHTML("afterbegin", data);
}