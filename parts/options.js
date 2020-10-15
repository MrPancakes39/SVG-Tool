let xValues = [];
let yValues = [];

let noms = [];
let dens = [];

function setupOptions() {
    select("#sendButton").mousePressed(selectedPath);

    nPoints = select("#nPoints");
    select("#submitButton").mousePressed(coordinatePoints);
    select("#createTextButton").mousePressed(createBlob);
    select("#LIPButton").mousePressed(generateLIP);

    selPath_alt = select("#selPath_alt");
    select("#sendButton_alt").mousePressed(selectedPath_alt);
}

// Creates the options drop menu basd on the number of paths.
function selPathSetup(nOptions) {
    selPath = $("#selPath")[0];
    selPath.innerHTML = `<option value="">--Please Select a Path--</option>`;
    selPath.value = "";

    for (let i = 1; i < nOptions + 1; i++) {
        let option = document.createElement("option");
        option.textContent = `Path_${i}`;
        option.setAttribute("value", `${i}`);
        selPath.appendChild(option);
    }
}

// Gets the selected path from option menu.
function selectedPath() {
    if (selPath.value !== "") {
        let pathName = "Path_" + selPath.value;
        path = document.getElementById(pathName);
        lenPath = path.getTotalLength();
        propObj.plProp = lenPath;
        updateProperties();
        drawCanvas = false;
        getPoints();
    } else {
        output("Please select a path.");
    }
}

// Gets the selected path from the custom input textbox.
function selectedPath_alt() {
    // If the number entered has a "," remove it.
    if (selPath_alt.value().includes(",")) {
        tempArr = selPath_alt.value().split(",");
        selPathValue_alt = tempArr.join("");
    } else {
        selPathValue_alt = selPath_alt.value();
    }

    if (0 < selPathValue_alt && selPathValue_alt < (nPaths + 1)) {
        let pathName = "Path_" + selPathValue_alt;
        path = document.getElementById(pathName);
        lenPath = path.getTotalLength();
        propObj.plProp = lenPath;
        updateProperties();
        drawCanvas = false;
        getPoints();
    } else {
        output("Not a valid path value!!");
    }
}

// Gets and stores the coordinate points in two arrays.
function coordinatePoints() {
    output("Points submitted");

    xValues = [];
    yValues = [];

    if (nPoints.value() - 1 == 0) {
        console.log("Infinity Error!!");
        output("Infinity Error!!");
    } else {
        let ratio = lenPath / (nPoints.value() - 1);
        for (let i = 0; i <= lenPath; i += ratio) {
            let p = path.getPointAtLength(i);
            xValues.push(p.x);
            yValues.push(p.y);
        }
    }
}

// Takes the coordinate points and put them in a file.
function createBlob() {
    blob = [];
    for (let i = 0; i < xValues.length; i++) {
        blob.push("x: " + String(xValues[i]) + ", y: " + String(yValues[i]))
    }
    saveStrings(blob, 'coodrinateList.txt');
}

// Generates a Lagrange Interpolation Polynomial from the arrays.
function generateLIP() {
    let den = 1;
    let nom = "";
    equation = "";

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

        simEq = getSimpleLIP();
        let saveArr = [equation, "", simEq];

        saveStrings(saveArr, 'Curve.txt');

    } else {
        output("It's not continuous.");
    }
}

// Checks continuity.
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