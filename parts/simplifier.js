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
    let num = nerdamer('determinant(M)');
    let den = nerdamer('determinant(N)');

    // Calculates Ci.
    let mult = pow(-1, n - i);
    let frac = nerdamer(num.toString()).divide(den.toString()).expand();
    let Ci = nerdamer(frac.toString()).multiply(mult.toString());
    return Ci.toString();
}