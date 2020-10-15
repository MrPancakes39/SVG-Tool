let xValues = [];
let yValues = [];

function setup() {
    let svg = document.getElementById("Path");

    let l = svg.getTotalLength();
    console.log(l);

    for (let i = 0; i < l; i += (l / 4)) {
        let p = svg.getPointAtLength(i);
        xValues.push(p.x);
        yValues.push(p.y);
    }

    let p = svg.getPointAtLength(l);
    xValues.push(p.x);
    yValues.push(p.y);

    console.log(xValues);
    console.log(yValues);
}

function mousePressed() {
    createBlob();
}

function createBlob() {
    blob = [];
    for (let i = 0; i < xValues.length; i++) {
        blob.push(String(xValues[i]) + "," + String(yValues[i]))
    }
    saveStrings(blob, 'coodrinateList.txt');
}