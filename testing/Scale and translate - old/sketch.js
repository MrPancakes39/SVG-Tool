let x = 0;
let y = 0;
let scaler = 1;

function setup() {
    createCanvas(300, 300);
    createP();

    let t = createButton("Translate");
    let s = createButton("Scale");

    t.mousePressed(trans);
    s.mousePressed(scaled);
}

function draw() {
    background(155);
    scale(scaler);
    translate(x, y);
    rect(11, 16, 80, 150);
    text(mouseX, 10, 200);
}

function trans() {
    x = -10;
    y = -15;
}

function scaled() {
    scaler = 240 / 150;
}