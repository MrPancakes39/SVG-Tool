xValues = [];
yValues = [];

function setupOptions() {
    selPath = select("#selPath");
    let sendButton = select("#sendButton");
    sendButton.mousePressed(selectedPath);

    nPoints = select("#nPoints");
    let submitButton = select("#submitButton");
    submitButton.mousePressed(coordinatePoints);

    let cButton = select("#createTextButton");
    cButton.mousePressed(createBlob);

    let lButton = select("#LIPButton");
    lButton.mousePressed(generateLIP);
}

function selectedPath() {
    if (0 < selPath.value() && selPath.value() < (nPaths + 1)) {
        let pathName = "Path_" + selPath.value();
        path = document.getElementById(pathName);
        lenPath = path.getTotalLength();
        plProp = lenPath;
        updateProperties();
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
        let ratio = lenPath / (nPoints.value() - 1);
        for (let i = 0; i <= lenPath; i += ratio) {
            let p = path.getPointAtLength(i);
            xValues.push(p.x);
            yValues.push(p.y);
        }
    }
}

function createBlob() {
    blob = [];
    for (let i = 0; i < xValues.length; i++) {
        blob.push("x: " + String(xValues[i]) + ", y: " + String(yValues[i]))
    }
    saveStrings(blob, 'coodrinateList.txt');
}

function generateLIP() {
    let den = 1;
    let nom = "";
    let equation = "";

    const noms = []
    const dens = [];

    let continuous = checkContinuity();

    if (continuous) {
        for (let j = 0; j < (xValues.length); j++) {
            for (let k = 0; k < (xValues.length); k++) {
                if (j !== k) {
                    den *= (float(xValues[j]) - float(xValues[k]));
                    nom += ("(x - " + xValues[k] + ") * ");
                }
            }
            dens.push(den);
            den = 1;
            noms.push(nom + yValues[j]);
            nom = "";
        }

        for (let i = 0; i < yValues.length; i++) {
            if (i < yValues.length - 1) {
                equation += "{" + noms[i] + "} / {" + String(dens[i]) + "}" + " + ";
            } else {
                equation += "{" + noms[i] + "} / {" + String(dens[i]) + "}";
            }
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