//let pathList = [];
//let pointList = [];

function getAllPaths() {
  pathList = [];
  let svg = document.querySelector("svg");
  let pathNodes = svg.querySelectorAll("path");
  pathNodes.forEach(Node => {
    let name = Node.getAttribute("id");
    let data = Node.getAttribute("d");
    let obj = {
      name: name,
      data: data
    };
    pathList.push(obj);
  });
  //console.log(pathList);
  return pathList;
}

function extractPoints(path) {
  let d = path.data;
  let pointTempList = d
    .replace("M ", "")
    .replace("C ", "")
    .split(" ");
  //console.log(pointList);
  //console.log(pointTempList);
  let pointList = parsePoint(pointTempList);
  return pointList;
}

function parsePoint(list) {
  //console.log(list);
  let pointList = [];
  list.forEach(point => {
    let coordinates = point.split(",");
    let obj = {
      x: coordinates[0],
      y: coordinates[1]
    };
    pointList.push(obj);
  });
  //console.log(pointList);
  return pointList;
}

// ============================================================================

function Wifey() {
  let listOfLists = [];
  let pathList = getAllPaths();
  pathList.forEach(path => {
    let list = extractPoints(path);
    listOfLists.push(list);
  });
  for (let i = 0; i < pathList.length; i++) {
    pathList[i].data = listOfLists[i];
  }
  console.log(pathList);
  allOfEquations(pathList);
}

function allOfEquations(pathList) {
  let downArr = [];
  pathList.forEach(path => {
    let paramArr = bézierPF(path);
    paramArr.forEach(elt => downArr.push(elt));
    downArr.push(``);
    downArr.push(``);
    downArr.push(``);
  });
  downArr.splice(-3, 3);
  saveStrings(downArr, "Test.txt");
}

function bézierPF(path) {
  //console.log(path.name);
  getCoeff(path.data);

  //let name = path.name;
  let paramArr = [
    `id: ${path.name}`,
    `a: ${aCoeff}, b: ${bCoeff}, c: ${cCoeff}, d: ${dCoeff}`,
    `p: ${pCoeff}, q: ${qCoeff}, r: ${rCoeff}, s: ${sCoeff}`,
    ``,
    `X = ${aCoeff}*t^3 + ${bCoeff}*t^2 + ${cCoeff}*t + ${dCoeff}`,
    `Y = ${pCoeff}*t^3 + ${qCoeff}*t^2 + ${rCoeff}*t + ${sCoeff}`
  ];
  //console.log(paramArr);
  return paramArr;
}

function getCoeff(points) {
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
