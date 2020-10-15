let takeM = {};
let pathProps = {};
let drawCanvas = false;
let showPoints = false;
let Transformed = false;
let cPoints = [];
let xScaled = [];
let yScaled = [];

// Moves the canvas into it's proper div.
function setupCanvas() {
    canvas = createCanvas(240, 240);
    background("#666666");
    canvas.id("canvas");

    canvasMove = $("#canvas")[0];
    tempBtn = $("#loadPathButton")[0];
    $("#advanced-left")[0].insertBefore(canvasMove, tempBtn);
}

// Adds event listener to each button.
function setupButtons() {
    select("#clearButton").mousePressed(clearOutput);
    select("#loadPathButton").mousePressed(loadThePath);
    select("#transformButton").mousePressed(transformPath);
    select("#showPointsButton").mousePressed(displayPoints);
    select("#submitCustomButton").mousePressed(submitPoints);
}

// Gets points from path and put them in arrays.
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

// Sets the correct settings to display the path.
function loadThePath() {
    clearOutput();
    Transformed = false;
    showPoints = false;
    drawCanvas = true;
    cPoints = [];
}

// Transforms the set of points in the arrays.
function transformPath() {
    xScaled = [];
    yScaled = [];

    if (pathProps.pathH <= pathProps.pathW) {
        scale = (width - 10) / (pathProps.pathW + 10);
    } else {
        scale = (height - 10) / (pathProps.pathH + 10);
    }

    for (let i = 0; i < xDraws.length; i++) {
        xScaled[i] = (xMapped[i] - pathProps.sx + 5) * scale;
        yScaled[i] = (yMapped[i] - pathProps.sy + 5) * scale;
    }

    Transformed = true;
    showPoints = false;
}

// Creates points on the curve and displays them.
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

// Gets and stores the selected points in the arrays.
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
            }
        }

        if (xValues.length - 1 == 0) {
            let tmpString = `x: ${xValues[0]}, y: ${yValues[0]}`;

            console.log(`Infinity Error!!\n`, tmpString);
            output(`Infinity Error!!\n` + tmpString);

            xValues = [];
            yValues = [];
        }

        if (xValues.length == 0) {
            output("There are 0 points selected.");
        }
    } else {
        output("You need the points to be visible to be able to submit.");
    }
}