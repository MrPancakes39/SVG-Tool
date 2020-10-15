// Calculates a simpler form of Lagrange Interpolation Polynomial.
function getSimpleLIP() {
  let eq = "";
  for (let i = xValues.length - 1; i > 0; i--) {
    let Ci = getCi(i);
    eq += `(${Ci})*x^${i} + `;
  }
  let C0 = getCi(0);
  eq += `(${C0})`;
  return eq;
}

function getCi(i) {
  let numArr = [];
  let denArr = [];
  let n = xValues.length - 1;

  // First row in matrix.
  numArr.push(yValues);

  // Creates all rows (in array form) for both matrices.
  for (let p = n; p > -1; p--) {
    if (p !== i) {
      numArr.push(Array.from(xValues, x => x ** p));
    }
    denArr.push(Array.from(xValues, x => x ** p));
  }

  // Creates string from both arrays.
  let numStr = "";
  let denStr = "";

  for (let k = 0; k < numArr.length - 1; k++) {
    numStr += `[${numArr[k].toString()}],`;
    denStr += `[${denArr[k].toString()}],`;
  }
  numStr += `[${numArr[numArr.length - 1].toString()}]`;
  denStr += `[${denArr[denArr.length - 1].toString()}]`;

  // Creates both matrices from string.
  nerdamer.setVar("M", `matrix(${numStr})`);
  nerdamer.setVar("N", `matrix(${denStr})`);

  // Finds the determinant of each.
  let num = nerdamer("determinant(M)");
  let den = nerdamer("determinant(N)");

  // Calculates Ci.
  let mult = pow(-1, n - i);
  let frac = nerdamer(num.toString())
    .divide(den.toString())
    .expand();
  let Ci = nerdamer(frac.toString()).multiply(mult.toString());
  return Ci.toString();
}

// ============================================================================

function setupCubic() {
  select("#cubicIF").mousePressed(cubicIF);
  select("#interPt").mousePressed(interPt);
  select("#bézierPF").mousePressed(bézierPF);
  select("#bézierIF").mousePressed(bézierIF);
}

function interPt() {
  nerdamer.setVar("a", select("#aVal").value());
  nerdamer.setVar("b", select("#bVal").value());
  nerdamer.setVar("c", select("#cVal").value());
  nerdamer.setVar("d", select("#dVal").value());

  nerdamer.setVar("p", select("#pVal").value());
  nerdamer.setVar("q", select("#qVal").value());
  nerdamer.setVar("r", select("#rVal").value());
  nerdamer.setVar("s", select("#sVal").value());

  let uVal = nerdamer("(b*r - c*q)/(a*q - b*p)").toString();
  let vVal = nerdamer("(a*r - p*c)/(b*p - a*q)").toString();

  nerdamer.setVar("u", uVal);
  nerdamer.setVar("v", vVal);
  //console.log(uVal, vVal);
  
  sol = nerdamer.solve("x^2 + v*x + (v^2 - u)", "x").text("decimals");
  tSolArr = sol.replace("[", "").replace("]", "").split(",");
  //console.log(sol);
  console.log(tSolArr);

  nerdamer.setVar("t", tSolArr[0]);

  let xVal = round(nerdamer("a*t^3 + b*t^2 + c*t + d").text("decimals"), 4);
  let yVal = round(nerdamer("p*t^3 + q*t^2 + r*t + s").text("decimals"), 4);

  output(`x: ${xVal}, y: ${yVal}`);
  console.log(`x: ${xVal}, y: ${yVal}`);
}

// For Cubic Parametric Equation.
function cubicIF() {
  nerdamer.setVar("a", select("#aVal").value());
  nerdamer.setVar("b", select("#bVal").value());
  nerdamer.setVar("c", select("#cVal").value());
  nerdamer.setVar("d", select("#dVal").value());

  nerdamer.setVar("p", select("#pVal").value());
  nerdamer.setVar("q", select("#qVal").value());
  nerdamer.setVar("r", select("#rVal").value());
  nerdamer.setVar("s", select("#sVal").value());

  implicitForm();
}

// Gets the Parametric Coefficients.
function getCoeff() {
  P0 = select("#P0").value().split(",");
  P1 = select("#P1").value().split(",");
  P2 = select("#P2").value().split(",");
  P3 = select("#P3").value().split(",");

  // x0 = float(select("#xP0").value());
  // x1 = float(select("#xP1").value());
  // x2 = float(select("#xP2").value());
  // x3 = float(select("#xP3").value());
  // y0 = 11.356 - float(select("#yP0").value());
  // y1 = 11.356 - float(select("#yP1").value());
  // y2 = 11.356 - float(select("#yP2").value());
  // y3 = 11.356 - float(select("#yP3").value());

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

// For Cubic Bézier Parametric.
function bézierPF() {
  getCoeff();

  let paramArr = [
    `a: ${aCoeff}, b: ${bCoeff}, c: ${cCoeff}, d: ${dCoeff}`,
    `p: ${pCoeff}, q: ${qCoeff}, r: ${rCoeff}, s: ${sCoeff}`,
    ``,
    `X = ${aCoeff}*t^3 + ${bCoeff}*t^2 + ${cCoeff}*t + ${dCoeff}`,
    `Y = ${pCoeff}*t^3 + ${qCoeff}*t^2 + ${rCoeff}*t + ${sCoeff}`
  ];
  saveStrings(paramArr, "Parametric Curve.txt");
}

// For Cubic Bézier Curve.
function bézierIF() {
  getCoeff();

  nerdamer.setVar("a", aCoeff.toString());
  nerdamer.setVar("b", bCoeff.toString());
  nerdamer.setVar("c", cCoeff.toString());
  nerdamer.setVar("d", dCoeff.toString());

  nerdamer.setVar("p", pCoeff.toString());
  nerdamer.setVar("q", qCoeff.toString());
  nerdamer.setVar("r", rCoeff.toString());
  nerdamer.setVar("s", sCoeff.toString());

  implicitForm();
}

// Calculates Implicit Form
function implicitForm() {
  // Nerdamer Method.
  let matrix =
    `  [a, b, c, d-x, 0, 0]` +
    `, [0, a, b, c, d-x, 0]` +
    `, [0, 0, a, b, c, d-x]` +
    `, [p, q, r, s-y, 0, 0]` +
    `, [0, p, q, r, s-y, 0]` +
    `, [0, 0, p, q, r, s-y]`;
  nerdamer.setVar("M", `matrix(${matrix})`);
  let resultant = nerdamer("determinant(M)");
  let resStr = resultant.toString() + " = 0";
  let resDec = resultant.text("decimals") + " = 0";
  let resTex = resultant.toTeX() + " = 0";

  // Calculation of variables.
  let AVal = nerdamer("a*p^2").toString();
  let BVal = nerdamer("-2*a^2 *p").toString();
  let CVal = nerdamer("a^3").toString();
  let DVal = nerdamer("2*a^2 *p*s -a^2 *q*r +a*b*q^2 -a*c*p*q -2*a*d*p^2 -b^2 *p*q +2*b*c*p^2").toString();
  let EVal = nerdamer("-2*a^3 *s +a^2 *b*r +2*a^2 *c*q +2*a^2 *d*p -a*b^2 *q -3*a*b*c*p +b^3 *p").toString();
  let FVal = nerdamer("a^3 *s^2 -a^2 *b*r*s -2*a^2 *c*q*s +a^2 *c*r^2 -2*a^2 *d*p*s +a^2 *d*q*r +a*b^2 *q*s +3*a*b*c*p*s -a*b*c*q*r -a*b*d*q^2 -2*a*c^2 *p*r +a*c^2 *q^2 +a*c*d*p*q +a*d^2 *p^2 -b^3 *p*s +b^2 *c*p*r +b^2 *d*p*q -b*c^2 *p*q -2*b*c*d*p^2 + c^3 *p^2").toString();

  let HVal = nerdamer("p^3").toString();
  let IVal = nerdamer("-2*a*p^2").toString();
  let JVal = nerdamer("a^2 *p").toString();
  let KVal = nerdamer("2*a*p^2 *s -3*a*p*q*r +a*q^3 +2*b*p^2 *r -b*p*q^2 +c*p^2 *q -2*d*p^3").toString();
  let LVal = nerdamer("-2*a^2 *p*s +2*a^2 *q*r -a*b*p*r -a*b*q^2 +2*a*d*p^2 +b^2 *p*q -b*c*p^2").toString();
  let MVal = nerdamer("a^2 *p*s^2 -2*a^2 *q*r*s +a^2 *r^3 +a*b*p*r*s +a*b*q^2 *s -a*b*q*r^2 -2*a*c*p*r^2 +a*c*q^2 *r -2*a*d*p^2 *s +3*a*d*p*q*r -a*d*q^3 -b^2 *p*q*s +b^2 *p*r^2 +b*c*p^2 *s -b*c*p*q*r -2*b*d*p^2 *r +b*d*p*q^2 +c^2 *p^2 *r -c*d*p^2 *q +d^2 *p^3").toString();

  // Wolfram Alpha Method.
  let wolfEq =
    nerdamer(`(s-y)*(${AVal}*x^2 + ${BVal}*xy + ${CVal}*y^2 + ${DVal}*x + ${EVal}*y + ${FVal}) - (d-x)*(${HVal}*x^2 + ${IVal}*xy + ${JVal}*y^2 + ${KVal}*x + ${LVal}*y + ${MVal})`).toString() + " = 0";
  //console.log(wolfEq);

  // Salman's Method.
  coeff1 = nerdamer(`${HVal}`).text("decimals");
  coeff2 = nerdamer(`${IVal} - ${AVal}`).text("decimals");
  coeff3 = nerdamer(`${JVal} - ${BVal}`).text("decimals");
  coeff4 = nerdamer(`-1*${CVal}`).text("decimals");
  coeff5 = nerdamer(`${KVal} - d * ${HVal} + s * ${AVal}`).text("decimals");
  coeff6 = nerdamer(`${LVal} - d * ${IVal} - ${DVal} + s * ${BVal}`).text("decimals");
  coeff7 = nerdamer(`-1 * d * ${JVal} - ${EVal} + s * ${CVal}`).text("decimals");
  coeff8 = nerdamer(`${MVal} - d * ${KVal} + s * ${DVal}`).text("decimals");
  coeff9 = nerdamer(`-1 * d * ${LVal} - ${FVal} + s * ${EVal}`).text("decimals");
  coeff10 = nerdamer(`-1 * d * ${MVal} + s * ${FVal}`).text("decimals");

  simpleEq = `${coeff1}*x^3 + ${coeff2}*x^2 *y + ${coeff3}*x*y^2 + ${coeff4}*y^3 + ${coeff5}*x^2 + ${coeff6}*xy + ${coeff7}*y^2 + ${coeff8}*x + ${coeff9}*y + ${coeff10} = 0`;
  //console.log(simpleEq);

  tempArr = [coeff1,coeff2,coeff3,coeff4,coeff5,coeff6,coeff7,coeff8,coeff9,coeff10];
  tempCoeffList = [];
  for (let i = 0; i < tempArr.length; i++) {
    tempCoeffList.push(abs(float(tempArr[i])));
  }
  sizeArr = tempCoeffList.slice().sort(function(a, b) {
    return a - b;
  });
  smallest = sizeArr[0];
  biggest = sizeArr[sizeArr.length - 1];
  coeffList = [];
  for (let i = 0; i < tempArr.length; i++) {
    let num = float(tempArr[i]);
    let coeff = num / biggest;
    coeffList.push(coeff);
  }
  for (let j = 0; j < tempArr.length; j++) {
    let num = float(tempArr[j]);
    let coeff = num / smallest;
    coeffList.push(coeff);
  }
  //console.log(coeffList);
  simplestEq = `${coeffList[0]}*x^3 + ${coeffList[1]}*x^2 *y + ${coeffList[2]}*x*y^2 + ${coeffList[3]}*y^3 + ${coeffList[4]}*x^2 + ${coeffList[5]}*xy + ${coeffList[6]}*y^2 + ${coeffList[7]}*x + ${coeffList[8]}*y + ${coeffList[9]} = 0`;
  //console.log(simplestEq);
  bestEq = `${coeffList[10]}*x^3 + ${coeffList[11]}*x^2 *y + ${coeffList[12]}*x*y^2 + ${coeffList[13]}*y^3 + ${coeffList[14]}*x^2 + ${coeffList[15]}*xy + ${coeffList[16]}*y^2 + ${coeffList[17]}*x + ${coeffList[18]}*y + ${coeffList[19]} = 0`;

  //let salArr = ["Salman's Method:", "================", simpleEq];
  //let wolfArr = ["Wolfram Alpha Method:", "=====================", wolfEq];
  //let nerdArr = ["Nerdamer Method:", "================", "", "Original:", resStr, "", "Decimal:", resDec, "", "LaTeX:", resTex];

  let saveArr = [
    "Salman's Method:",
    "================",
    simpleEq,
    "",
    simplestEq,
    "",
    bestEq,
    "",
    "Wolfram Alpha Method:",
    "=====================",
    wolfEq,
    "",
    "Nerdamer Method:",
    "================",
    "",
    "Original:",
    resStr,
    "",
    "Decimal:",
    resDec,
    "",
    "LaTeX:",
    resTex
  ];
  saveStrings(saveArr, "Implicit Curve.txt");
}

// ============================================================================


