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

function interPt() {
  let uVal = nerdamer("(b*r - c*q)/(a*q - b*p)").toString();
  let vVal = nerdamer("(a*r - p*c)/(b*p - a*q)").toString();

  nerdamer.setVar("u", uVal);
  nerdamer.setVar("v", vVal);

  sol = nerdamer.solve("x^2 - v*x + (v^2 - u)", "x").text("decimals");
  tSolArr = sol.replace("[", "").replace("]", "").split(",");

  if (!(tSolArr[0].includes("i"))) {
    nerdamer.setVar("t", tSolArr[0]);
    let xVal = round(nerdamer("a*t^3 + b*t^2 + c*t + d").text("decimals"), 4);
    let yVal = round(nerdamer("p*t^3 + q*t^2 + r*t + s").text("decimals"), 4);

    output(`(${xVal},${yVal})`);
    console.log(`(${xVal},${yVal})`);
  } else {
    output(`There exist no Intersection`);
    console.log(`There exist no Intersection`);
  }
}

// Calculates Implicit Form
function implicitForm() {
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

  coeffList = [coeff1, coeff2, coeff3, coeff4, coeff5, coeff6, coeff7, coeff8, coeff9, coeff10];
  let smallestCoeff = min(Array.from(coeffList, coeff => abs(float(coeff))));
  coeffList = Array.from(coeffList, coeff => round(float(coeff) / smallestCoeff, 5));

  bestEq = `${coeffList[0]}*x^3 + ${coeffList[1]}*x^2 *y + ${coeffList[2]}*x*y^2 + ${coeffList[3]}*y^3 + ${coeffList[4]}*x^2 + ${coeffList[5]}*xy + ${coeffList[6]}*y^2 + ${coeffList[7]}*x + ${coeffList[8]}*y + ${coeffList[9]} = 0`;
  bestEq = repStr(bestEq);
  //console.log(bestEq);

  return bestEq;
  //let saveArr = ["Implicit Form:", "==============", bestEq];
  //saveStrings(saveArr, "Implicit Curve.txt");
}

// ============================================================================