function setup() {
	var nerdObj = {
		x: 5
	};

	var result = nerdamer('4*x^2').evaluate(nerdObj);
	console.log(result.text());
}