xValues = [];
yValues = [];
//arrOfPaths = [];

let noms = [];
let dens = [];

function setupOptions() {
    let sendButton = select("#sendButton");
    sendButton.mousePressed(selectedPath);

    nPoints = select("#nPoints");
    let submitButton = select("#submitButton");
    submitButton.mousePressed(coordinatePoints);

    let cButton = select("#createTextButton");
    cButton.mousePressed(createBlob);

    let lButton = select("#LIPButton");
    lButton.mousePressed(generateLIP);

    selPath_alt = select("#selPath_alt");
    let sendButton_alt = select("#sendButton_alt");
    sendButton_alt.mousePressed(selectedPath_alt);
}

function selPathSetup(nOptions) {
    selPath = document.getElementById("selPath");
    selPath.innerHTML = `<option value="">--Please Select a Path--</option>`;
    selPath.value = "";

    for (let i = 1; i < nOptions + 1; i++) {
        let option = document.createElement("option");
        option.textContent = `Path_${i}`;
        option.setAttribute("value", `${i}`);
        selPath.appendChild(option);
    }
}

function selectedPath() {
    selPathValue = selPath.value;
    if (selPathValue !== "") {
        let pathName = "Path_" + selPathValue;
        path = document.getElementById(pathName);
        lenPath = path.getTotalLength();
        plProp = lenPath;
        updateProperties();
        drawCanvas = false;
        getPoints();
    } else {
        //console.log("Please select a path.");
        output("Please select a path.");
    }
}

function selectedPath_alt() {
    //console.log(selPath_alt.value());
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
        plProp = lenPath;
        updateProperties();
        drawCanvas = false;
        getPoints();
    } else {
        //console.log("Not a valid path value!!");
        output("Not a valid path value!!");
    }
}

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
        //console.log("It's not continuous.");
        output("It's not continuous.");
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

// function createEquation() {

// }

// function getPaths() {
//     tempArr = Array.from(document.getElementById("svg").childNodes);
//     tempArr.forEach(node => {
//         if (node.nodeName == "path") {
//             arrOfPaths.push(node);
//         }
//     })
//     console.log(arrOfPaths);
// }