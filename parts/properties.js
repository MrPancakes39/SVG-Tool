function setupProperties() {
    wProp = "-";
    hProp = "-";
    npProp = "-";
    plProp = "-";
}

function updateProperties() {
    let pdiv = document.getElementById("properties");
    pdiv.innerHTML = `<h2><ins>Properties:</ins></h2>`;

    let pw = document.createElement("p");
    let ph = document.createElement("p");
    let np = document.createElement("p");
    let pl = document.createElement("p");

    pw.textContent = `Width: ${wProp}`;
    ph.textContent = `Height: ${hProp}`;
    np.textContent = `Number of Paths: ${npProp}`;
    pl.textContent = `Selected Path Length: ${plProp}`;

    pw.setAttribute("id", "pw");
    ph.setAttribute("id", "ph");
    np.setAttribute("id", "np");
    pl.setAttribute("id", "pl");

    pdiv.append(pw, ph, np, pl);
}