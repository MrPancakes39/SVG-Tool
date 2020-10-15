let cPoint;

function setup() {
	createCanvas(400, 400);
	cPoint = new Point(100, 100);
}

function draw() {
	background(155);
	cPoint.checkCollision();
	cPoint.update();
	cPoint.show();
}