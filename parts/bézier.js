// Sets EventListeners For Bézier Calculations.
function setupBézier() {
    select("#paramSend").mousePressed(getParamEqFromInput);
    select("#cubicIF").mousePressed(getImplicitEqFromParam);
    select("#interPt").mousePressed(getInterceptionPoint);

    select("#bézierPF").mousePressed(getParamEqFromPoints);
    select("#bézierIF").mousePressed(getImplicitEqFromInput);

    select("#allParamPath").mousePressed(svgToParam);
    select("#bézierPFPath").mousePressed(pathSelToParam);
    select("#bézierIFPath").mousePressed(pathSelToImplicit);

    select("#paramSend1").mousePressed(param1);
}

// Extracts Points from Bézier or PolyBézier Curve.
function extractPoints(path) {
    let d = path.data;
    let filteredPList = d
        .replace("M ", "")
        .replace("C ", "")
        .replace(" Z", "")
        .split(" ");

    try {
        let pointList = parsePList(filteredPList);
        return pointList;
    } catch (err) {
        return new Error(`${path.name} isn't formatted correctly.`);
    }
}

// Parses Filtred Points List.
function parsePList(list) {
    let parsedList = [];
    let numPoints = list.length;
    if (numPoints == 2) {
        // If the path is a line.
        let coorList = [];
        list.forEach(point => {
            let coordinates = point.split(",");
            coorList.push({
                x: coordinates[0],
                y: coordinates[1]
            });
        });
        parsedList.push(coorList);
    } else {
        // If the path is a bézier or polybézier.
        let END_SET_POINTS = list.length - 1;
        for (let i = 0; i < END_SET_POINTS; i += 3) {
            let pList = [list[i], list[i + 1], list[i + 2], list[i + 3]];

            let coorList = [];
            pList.forEach(point => {
                let coordinates = point.split(",");
                coorList.push({
                    x: coordinates[0],
                    y: coordinates[1]
                });
            });
            parsedList.push(coorList);
        }
    }
    return parsedList
}

function svgToParam() {
    try {
        pathList.forEach(path => {
            // Checks if the path has V or H.
            if (path.data.includes("V") || path.data.includes("H")) {
                let BreakException = `Error! ${path.name} has either a H or V in the d attribute.`;
                throw BreakException;
            } else {
                let pointArr = extractPoints(path);
                if (pointArr instanceof Error) throw pointArr;
                if (pointArr.length == 1) {
                    // If It's Bézier Curve.
                    path.data = pointArr[0];
                } else {
                    // If It's PolyBézier Curve.
                    let pathData = [];
                    for (let i = 0; i < pointArr.length; i++) {
                        pathData.push({
                            name: `Path_${i + 1}`,
                            data: pointArr[i]
                        });
                    }
                    path.data = pathData;
                }
            }
        });
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
        let pathClass = $(`#${path.name}`)[0].getAttribute("class");
        let curveType =
            (path.name.includes("st-line") || (path.data[0].x && path.data.length == 2) || pathClass == "st-line") ? "st-line" :
            (typeof path.data[0].x === "undefined") ? "poly" :
            "norm"

        if (curveType == "st-line") {
            let lineArr = makeLineArr(path);
            lineColl = lineColl.concat(lineArr, [``, ``]);
            Count++
        } else if (curveType == "poly") {
            downArr.push(`id: ${path.name}`);
            let polyArr = allEquationsInPoly(path.data);
            downArr = downArr.concat(polyArr, [``]);
            Count += path.data.length;
        } else {
            downArr.push(`id: ${path.name}`);
            CoeffFromList(path.data);
            let paramStr = makeParam();
            downArr = downArr.concat([paramStr, ``]);
            Count++
        }
    });
    downArr = downArr.concat(lineColl);
    if (downArr.slice().splice(-2, 1)[0] == "") {
        downArr.splice(-2, 1);
    }
    //console.log(downArr);
    downArr.push(`Count: ${Count}`);
    saveStrings(downArr, "All Parametric in SVG.txt");
}

function makeLineArr(path) {
    let index = (path.data.length == 2) ? 1 : 3
    let lineEq = getLineEq(path.data, index);

    let sx = round(path.data[0].x, 4);
    let sy = round(11.356 - path.data[0].y, 4);
    let ex = round(path.data[index].x, 4);
    let ey = round(11.356 - path.data[index].y, 4);

    let bX = (sx > ex) ? sx : ex;
    let sX = (sx > ex) ? ex : sx;

    let arrTemp = [
        `id: ${path.name}`,
        `(${path.data[0].x},${path.data[0].y})`,
        `(${path.data[index].x},${path.data[index].y})`,
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

function getLineEq(data, i) {
    let Xa = data[0].x;
    let Ya = 11.356 - data[0].y;
    let Xb = data[i].x;
    let Yb = 11.356 - data[i].y;

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

function allEquationsInPoly(dataList) {
    let polyArr = [];
    dataList.forEach(path => {
        CoeffFromList(path.data);
        let paramStr = makeParam();
        polyArr.push(paramStr);
    });
    return polyArr
}

function makeParam() {
    let xStr = `${aCoeff}*t^3 + ${bCoeff}*t^2 + ${cCoeff}*t + ${dCoeff}`;
    let yStr = `${pCoeff}*t^3 + ${qCoeff}*t^2 + ${rCoeff}*t + ${sCoeff}`;

    xStr = repStr(xStr);
    yStr = repStr(yStr);

    let paramStr = `(${xStr}, ${yStr})`;
    return paramStr
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

// ============================================================================

function pathSelToParam() {
    try {
        if (typeof path == "undefined") throw "Path is Not Selected.";

        let pathName = path.getAttribute("id");
        if (pathName.includes("st-line")) throw "Error: The Path is a line.";

        let index = pathList.findIndex(obj => obj.name === pathName);
        let pointArr = extractPoints(pathList[index]);
        if (pointArr[0].length == 2) throw "Error: The Path is Secretly a line.";

        getParamEqFromSel(pathName, pointArr);
    } catch (err) {
        console.error(err);
        output(err);
    }
}

function getParamEqFromSel(pathName, pathData) {
    let downArr = [];
    downArr.push(`id: ${pathName}`);

    let curveType = (pathData.length !== 1) ? "poly" : "norm";
    if (curveType == "poly") {
        pathData.forEach(dataList => {
            CoeffFromList(dataList);
            let paramStr = makeParam();
            downArr.push(paramStr);
        });
    } else {
        let pointArr = pathData[0];
        CoeffFromList(pointArr);
        let paramStr = makeParam();
        downArr.push(paramStr);
    }
    saveStrings(downArr, "Selected Path to Parametric.txt");
}

function pathSelToImplicit() {
    try {
        if (typeof path == "undefined") throw "Path is Not Selected.";

        let pathName = path.getAttribute("id");
        if (pathName.includes("st-line")) throw "Error: The Path is a line.";

        let index = pathList.findIndex(obj => obj.name === pathName);
        let pointArr = extractPoints(pathList[index]);
        if (pointArr.length !== 1) throw "Error: PolyBézier Curves are not Supported."
        if (pointArr[0].length == 2) throw "Error: The Path is Secretly a line.";

        //console.log(pointArr);
        getImplicitEqFromSel(pathName, pointArr);
    } catch (err) {
        console.error(err);
        output(err);
    }
}

function getImplicitEqFromSel(pathName, pathData) {
    let downArr = [];
    downArr.push(`id: ${pathName}`);
    downArr.push("===============");
    let pointArr = pathData[0];
    CoeffFromList(pointArr);
    setNerdCoeff();
    let eq = implicitForm();
    downArr.push(eq);
    let domain = getDomain();
    downArr.push(``);
    downArr.push(`(${domain[0].x},${domain[0].y})`)
    downArr.push(`(${domain[1].x},${domain[1].y})`)
    saveStrings(downArr, "Selected Path to Implicit Form.txt");
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

// Gets Bézier Curve's Domain.
function getDomain() {
    let paramStr = makeParam();
    let paramArr = paramStr.replace("(", "").replace(")", "").split(", ");

    let xParam = nerdamer(paramArr[0]);
    let yParam = nerdamer(paramArr[1]);

    let xStart = dCoeff;
    let yStart = sCoeff;
    let xFinal = round(float(xParam.evaluate({
        t: '1'
    }).text("decimal")), 4);
    let yFinal = round(float(yParam.evaluate({
        t: '1'
    }).text("decimal")), 4);

    let sPoint = {
        x: xStart,
        y: yStart
    }
    let fPoint = {
        x: xFinal,
        y: yFinal
    }

    let domainArr = [sPoint, fPoint];
    return domainArr
}

// ============================================================================

const defaultXEq = "X = a*t^3 + b*t^2 + c*t + d";
const defaultYEq = "Y = p*t^3 + q*t^2 + r*t + s";

function getParamEqFromInput() {
    let eq = $("#paramEq").val();
    if (eq === "") {
        $("#xEqP")[0].textContent = defaultXEq;
        $("#yEqP")[0].textContent = defaultYEq;
        output("Please put a Parametric Equation in.");
    } else try {
        eq = parseEqStr(eq);
        getCoeffFromEq(eq);

        let Eqs = eq[2];
        $("#xEqP")[0].textContent = `X = ${Eqs[0]}`;
        $("#yEqP")[0].textContent = `Y = ${Eqs[1]}`;
    } catch (err) {
        output("Invalid Parametric Equation!!!");
        console.error(err, "\nInvalid Parametric Equation!!!");
    }
}

function parseEqStr(str) {
    let Eqs = str.replace("(", "").replace(")", "").split(", ");
    let xEq = unRepStr(Eqs[0]).split(" + ");
    let yEq = unRepStr(Eqs[1]).split(" + ");
    xEq = Array.from(xEq, elt => elt.split("*"));
    yEq = Array.from(yEq, elt => elt.split("*"));
    return [xEq, yEq, Eqs];
}

function getCoeffFromEq(eq) {
    xEq = eq[0];
    yEq = eq[1];

    aCoeff = xEq[0][0];
    bCoeff = xEq[1][0];
    cCoeff = xEq[2][0];
    dCoeff = xEq[3][0];

    pCoeff = yEq[0][0];
    qCoeff = yEq[1][0];
    rCoeff = yEq[2][0];
    sCoeff = yEq[3][0];
}

function getImplicitEqFromParam() {
    let downArr = [];
    downArr.push(`id: Path_1`);
    downArr.push("===============");
    setNerdCoeff();
    let eq = implicitForm();
    downArr.push(eq);
    let domain = getDomain();
    downArr.push(``);
    downArr.push(`(${domain[0].x},${domain[0].y})`)
    downArr.push(`(${domain[1].x},${domain[1].y})`)
    saveStrings(downArr, "Input Param to Implicit Form.txt");
}

function getInterceptionPoint() {
    setNerdCoeff();
    interPt();
}

// ============================================================================

function getPointsFromInput() {
    let P0 = $("#P0").val().split(",");
    let P1 = $("#P1").val().split(",");
    let P2 = $("#P2").val().split(",");
    let P3 = $("#P3").val().split(",");

    let points = [P0, P1, P2, P3];
    points = Array.from(points, pt => pt = {
        x: pt[0],
        y: pt[1]
    });
    //console.log(points);
    return points
}

function getImplicitEqFromInput() {
    let downArr = [];
    downArr.push(`id: Path_1`);
    downArr.push(`===========`);
    let points = getPointsFromInput();
    CoeffFromList(points);
    setNerdCoeff();
    let eq = implicitForm();
    downArr.push(eq);
    let domain = getDomain();
    downArr.push(``);
    downArr.push(`(${domain[0].x},${domain[0].y})`)
    downArr.push(`(${domain[1].x},${domain[1].y})`)
    saveStrings(downArr, "Bézier Implicit Form.txt");
}

function getParamEqFromPoints() {
    let downArr = [];
    downArr.push(`id: Path_1`);
    downArr.push(`===========`);
    let points = getPointsFromInput();
    CoeffFromList(points);
    let paramStr = makeParam();
    downArr.push(paramStr);
    saveStrings(downArr, "Bézier Parametric Form.txt");
}

// ============================================================================

function param1() {
    let eq = $("#paramEq1").val();
    if (eq !== "") {
        eq = changeParamToCF(eq);
        eq = parseEq1(eq);
        getCoeffFromEq(eq);

        let downArr = [];
        downArr.push(`id: Path_1`);
        downArr.push("===============");
        setNerdCoeff();
        eq = implicitForm();
        eq = eq.split(" ").join("");
        downArr.push(eq);
        let domain = getDomain();
        downArr.push(``);
        downArr.push(`(${domain[0].x},${domain[0].y})`);
        downArr.push(`(${domain[1].x},${domain[1].y})`);
        downArr.push(``);

        let xCFun = genCFun(float(domain[0].x), float(domain[1].x));
        let yCFun = genCFun(float(domain[0].y), float(domain[1].y));
        yCFun = yCFun.split("x").join("y").replace("y", "x");

        downArr.push(xCFun);
        downArr.push(yCFun);
        saveStrings(downArr, "Input Param to Implicit Form.txt");
    }
}

function changeParamToCF(str) {
    let eq = str.split("+-").join("-");
    eq = eq.split("-").join("+-");
    eq = eq.replace("(+-", "(-");
    eq = eq.replace(",+-", ",-");
    return eq;
}

function parseEq1(str) {
    let Eqs = str.replace("(", "").replace(")", "").split(",");
    let xEq = unRepStr(Eqs[0]).split("+");
    let yEq = unRepStr(Eqs[1]).split("+");
    xEq = Array.from(xEq, elt => elt.split("*"));
    yEq = Array.from(yEq, elt => elt.split("*"));
    return [xEq, yEq, Eqs];
}

function genCFun(C, D) {
    let Sum = round((D + C) / 2, 5);
    let Dif = round((D - C) / 2, 5);
    return `y=sqrt((abs(abs(x-${Sum})-${Dif}))/(${Dif}-abs(x-${Sum})))`
}