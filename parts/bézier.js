function setupCubic() {
    select("#cubicIF").mousePressed(cubicIF);
    select("#interPt").mousePressed(interPt);
    select("#bézierPF").mousePressed(bézierPF);
    select("#bézierIF").mousePressed(bézierIF);

    select("#bézierPFPath").mousePressed(currentToParam);
    select("#bézierIFPath").mousePressed(currentToImplicit);
    select("#allParamPath").mousePressed(svgToParam);
}

// For Cubic Parametric Equation.
function cubicIF() {
    setNerdVal();
    implicitForm();
}

// Gets Coefficents of Parametric from Inputs.
function setNerdVal() {
    nerdamer.setVar("a", select("#aVal").value());
    nerdamer.setVar("b", select("#bVal").value());
    nerdamer.setVar("c", select("#cVal").value());
    nerdamer.setVar("d", select("#dVal").value());

    nerdamer.setVar("p", select("#pVal").value());
    nerdamer.setVar("q", select("#qVal").value());
    nerdamer.setVar("r", select("#rVal").value());
    nerdamer.setVar("s", select("#sVal").value());
}

// Gets the Parametric Coefficients.
function getCoeff() {
    P0 = select("#P0").value().split(",");
    P1 = select("#P1").value().split(",");
    P2 = select("#P2").value().split(",");
    P3 = select("#P3").value().split(",");

    x0 = float(round(P0[0], 4));
    x1 = float(round(P1[0], 4));
    x2 = float(round(P2[0], 4));
    x3 = float(round(P3[0], 4));
    y0 = 11.356 - float(round(P0[1], 4));
    y1 = 11.356 - float(round(P1[1], 4));
    y2 = 11.356 - float(round(P2[1], 4));
    y3 = 11.356 - float(round(P3[1], 4));

    aCoeff = round(-1 * x0 + 3 * x1 - 3 * x2 + x3, 4);
    bCoeff = round(3 * x0 - 6 * x1 + 3 * x2, 4);
    cCoeff = round(-3 * x0 + 3 * x1, 4);
    dCoeff = round(x0, 4);
    pCoeff = round(-1 * y0 + 3 * y1 - 3 * y2 + y3, 4);
    qCoeff = round(3 * y0 - 6 * y1 + 3 * y2, 4);
    rCoeff = round(-3 * y0 + 3 * y1, 4);
    sCoeff = round(y0, 4);
}

function CoeffFromList(points) {
    x0 = float(round(points[0].x, 4));
    x1 = float(round(points[1].x, 4));
    x2 = float(round(points[2].x, 4));
    x3 = float(round(points[3].x, 4));
    y0 = 11.356 - float(round(points[0].y, 4));
    y1 = 11.356 - float(round(points[1].y, 4));
    y2 = 11.356 - float(round(points[2].y, 4));
    y3 = 11.356 - float(round(points[3].y, 4));

    aCoeff = round(-1 * x0 + 3 * x1 - 3 * x2 + x3, 4);
    bCoeff = round(3 * x0 - 6 * x1 + 3 * x2, 4);
    cCoeff = round(-3 * x0 + 3 * x1, 4);
    dCoeff = round(x0, 4);
    pCoeff = round(-1 * y0 + 3 * y1 - 3 * y2 + y3, 4);
    qCoeff = round(3 * y0 - 6 * y1 + 3 * y2, 4);
    rCoeff = round(-3 * y0 + 3 * y1, 4);
    sCoeff = round(y0, 4);
}

// Sets Coefficents of Parametric in Nerdamier.
function setNerdCoeff() {
    nerdamer.setVar("a", aCoeff.toString());
    nerdamer.setVar("b", bCoeff.toString());
    nerdamer.setVar("c", cCoeff.toString());
    nerdamer.setVar("d", dCoeff.toString());

    nerdamer.setVar("p", pCoeff.toString());
    nerdamer.setVar("q", qCoeff.toString());
    nerdamer.setVar("r", rCoeff.toString());
    nerdamer.setVar("s", sCoeff.toString());
}

// For Cubic Bézier Parametric.
function bézierPF() {
    getCoeff();

    let paramArr = makeParam();
    saveStrings(paramArr, "Parametric Curve.txt");
}

// For Cubic Bézier Curve.
function bézierIF() {
    getCoeff();
    setNerdCoeff();
    implicitForm();
}

// Extract The 4 Points From Current Selected Path.
function extCPathPoints() {
    let d = path.getAttribute("d");
    let pointCSVList = d
        .replace("M ", "")
        .replace("C ", "")
        .split(" ");
    let pList = parsePoint(pointCSVList);
    return pList;
}

// Parses the CSV Point List.
function parsePoint(list) {
    let pList = [];
    list.forEach(point => {
        let coordinates = point.split(",");
        let obj = {
            x: coordinates[0],
            y: coordinates[1]
        };
        pList.push(obj);
    });
    return pList;
}

function currentToParam() {
    let pointList = extCPathPoints();
    CoeffFromList(pointList);

    let paramArr = makeParam();
    saveStrings(paramArr, "Parametric Curve.txt");
}

function currentToImplicit() {
    let pointList = extCPathPoints();
    CoeffFromList(pointList);
    setNerdCoeff();
    implicitForm();
}

function extractPoints(path) {
    let d = path.data;
    let pointTempList = d
        .replace("M ", "")
        .replace("C ", "")
        .split(" ");
    let pointList = parsePoint(pointTempList);
    return pointList;
}

function svgToParam() {
    let listOfLists = [];
    let BreakException = {};

    try {
        pathList.forEach(path => {
            if (path.data.includes("V") || path.data.includes("H")) {
                BreakException = `Error! ${path.name} has either a H or V in the d attribute.`;
                throw BreakException;
            }

            let pointsArr = path.data.replace("M ", "").replace("C ", "").replace(" Z", "").split(" ");
            if (pointsArr.length > 4) {
                let pathArr = [];
                let pointArr = extractPointsB4(path);
                for (let i = 0; i < pointArr.length; i++) {
                    let obj = {
                        name: `Path_${i + 1}`,
                        data: pointArr[i]
                    }
                    pathArr.push(obj);
                }
                path.data = pathArr;
            } else {
                let list = extractPoints(path);
                list.unshift(path.name);
                listOfLists.push(list);
            }
        });

        for (let i = 0; i < listOfLists.length; i++) {
            let index = pathList.findIndex(obj => obj.name === listOfLists[i][0])
            pathList[index].data = listOfLists[i].slice(1);
        }
        //console.log(pathList);
        allOfEquations(pathList);

    } catch (err) {
        console.error(err);
        output(err);
    }
}

function allOfEquations(pathList) {
    let Count = 0;
    let downArr = [];
    let lineColl = [];
    pathList.forEach(path => {
        if (path.name.includes("st-line") || path.data.length == 2) {
            let lineArr = makeLine(path);
            lineArr.forEach(elt => lineColl.push(elt));
            lineColl.push(``);
            lineColl.push(``);
            Count++
        } else if (typeof path.data[0].x === "undefined") {
            downArr.push(`id: ${path.name}`);
            let polyArr = allOfEquationsB4(path.data);
            polyArr.forEach(elt => downArr.push(elt));
            downArr.push(``);
            Count += path.data.length;
        } else {
            downArr.push(`id: ${path.name}`);
            CoeffFromList(path.data);
            // let paramArr = makeParam();
            // paramArr.forEach(elt => downArr.push(elt));
            let paramStr = makeParamB4();
            downArr.push(paramStr);
            downArr.push(``);
            //downArr.push(``);
            Count++
        }
    });
    lineColl.forEach(elt => downArr.push(elt));
    if (downArr.slice().splice(-2, 1)[0] == "") {
        downArr.splice(-2, 1);
    }
    //console.log(downArr);
    downArr.push(`Count: ${Count}`);
    saveStrings(downArr, "All Parametric in SVG.txt");
}

// function makeParam() {
//     let xStr = `${aCoeff}*t^3 + ${bCoeff}*t^2 + ${cCoeff}*t + ${dCoeff}`;
//     let yStr = `${pCoeff}*t^3 + ${qCoeff}*t^2 + ${rCoeff}*t + ${sCoeff}`;

//     xStr = repStr(xStr);
//     yStr = repStr(yStr);

//     let paramArr = [
//         `a: ${aCoeff}, b: ${bCoeff}, c: ${cCoeff}, d: ${dCoeff}`,
//         `p: ${pCoeff}, q: ${qCoeff}, r: ${rCoeff}, s: ${sCoeff}`,
//         ``,
//         `X = ${xStr}`,
//         `Y = ${yStr}`,
//         ``,
//         `(${xStr}, ${yStr})`
//     ];
//     return paramArr
// }

function getLineEq(data) {
    let index = (data.length == 2) ? 1 : 3

    let Xa = data[0].x;
    let Ya = 11.356 - data[0].y;
    let Xb = data[index].x;
    let Yb = 11.356 - data[index].y;

    let slope = round((Yb - Ya) / (Xb - Xa), 4)
    let intercept = round(Ya - slope * Xa, 4)

    let eq = "";
    if (intercept < 0) {
        eq = `y=${slope}x${intercept}`;
    } else {
        eq = `y=${slope}x+${intercept}`;
    }
    return eq
}

function makeLine(path) {
    let lineEq = getLineEq(path.data);
    let index = (path.data.length == 2) ? 1 : 3

    let sx = round(path.data[0].x, 4);
    let sy = round(11.356 - path.data[0].y, 4);
    let ex = round(path.data[index].x, 4);
    let ey = round(11.356 - path.data[index].y, 4);

    let bX = (sx > ex) ? sx : ex;
    let sX = (sx > ex) ? ex : sx;

    let arrTemp = [
        `id: ${path.name}`,
        `(${path.data[0].x}),(${path.data[0].y})`,
        `(${path.data[index].x}),(${path.data[index].y})`,
        ``,
        `sx: ${sx}; sy: ${sy}`,
        `ex: ${ex}; ey: ${ey}`,
        ``,
        lineEq,
        ``,
        `${sX}<= x <=${bX}`
    ];

    return arrTemp
}

function extractPointsB4(path) {
    let d = path.data;
    let pointTempList = d
        .replace("M ", "")
        .replace("C ", "")
        .replace(" Z", "")
        .split(" ");
    let pointList = parsePointsB4(pointTempList);
    //console.log(pointList);
    return pointList;
}

function parsePointsB4(list) {
    let allPathDataList = [];
    for (let i = 0; i < list.length - 1; i += 3) {
        let pList = [];
        pList.push(list[i]);
        pList.push(list[i + 1]);
        pList.push(list[i + 2]);
        pList.push(list[i + 3]);

        let PList = [];
        pList.forEach(point => {
            let coordinates = point.split(",");
            let obj = {
                x: coordinates[0],
                y: coordinates[1]
            };
            PList.push(obj);
        });
        allPathDataList.push(PList);
    }
    return allPathDataList
}

// function polyToMultiple() {
//     pathList.forEach(path => {
//         let pathArr = [];
//         let pointArr = extractPointsB4(path);
//         //console.log(pointArr);
//         for (let i = 0; i < pointArr.length; i++) {
//             let obj = {
//                 name: `Path_${i + 1}`,
//                 data: pointArr[i]
//             }
//             pathArr.push(obj);
//         }
//         path.data = pathArr;
//     })
//     console.log(pathList);

//     let Count = 0;
//     let pathsArr = [];
//     pathList.forEach(poly => {
//         pathsArr.push(`id: ${poly.name}`);
//         let polyArr = allOfEquationsB4(poly.data);
//         polyArr.forEach(elt => pathsArr.push(elt));
//         pathsArr.push(``);
//         Count += poly.data.length;
//     })
//     //pathsArr.splice(-1, 1);
//     pathsArr.push(`Count: ${Count}`)
//     saveStrings(pathsArr, "All Parametric in SVG_B4.txt");
// }

function allOfEquationsB4(pathList) {
    let polyArr = [];
    pathList.forEach(path => {
        CoeffFromList(path.data);
        let paramStr = makeParamB4();
        polyArr.push(paramStr);
    });
    //console.log(polyArr);
    return polyArr
}

function makeParamB4() {
    let xStr = `${aCoeff}*t^3 + ${bCoeff}*t^2 + ${cCoeff}*t + ${dCoeff}`;
    let yStr = `${pCoeff}*t^3 + ${qCoeff}*t^2 + ${rCoeff}*t + ${sCoeff}`;

    xStr = repStr(xStr);
    yStr = repStr(yStr);

    let paramStr = `(${xStr}, ${yStr})`;
    return paramStr
}