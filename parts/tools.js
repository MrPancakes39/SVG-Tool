function setupTools() {
    svgLoad = select("#svgLoad");
    let loadButton = select("#loadButton");
    loadButton.mousePressed(loadSVG);

    let orgSize = select("#orgSize");
    orgSize.mousePressed(originalSize);

    let revSize = select("#revSize");
    revSize.mousePressed(revertSize);

    setW = select("#setW");
    let setWButton = select("#setWButton");
    setWButton.mousePressed(setWidth);

    setH = select("#setH");
    let setHButton = select("#setHButton");
    setHButton.mousePressed(setHeight);
}

function loadSVG() {
    document.getElementById("view").removeChild(svg);
    document.getElementById("view").innerHTML += svgLoad.value();

    svg = document.getElementById("svg");
    nPaths = svg.childElementCount;

    npProp = nPaths;
    updateProperties();

    w = svg.getAttribute("width");
    h = svg.getAttribute("height");

    let scale;
    if (w <= h) {
        scale = 240 / h;
    } else {
        scale = 240 / w;
    }

    newH = String(h * scale);
    newW = String(w * scale);

    svg.setAttribute("width", newW);
    svg.setAttribute("height", newH);

    wProp = newW;
    hProp = newH;
    updateProperties();
}

function originalSize() {
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);

    wProp = w;
    hProp = h;
    updateProperties();

    if (w > 350) {
        divWidth = w + 350;
        topDiv = document.getElementById("top").style.width = `${divWidth}px`;
    } else {
        topDiv = document.getElementById("top").style.width = `650px`;
    }
}

function revertSize() {
    svg.setAttribute("width", newW);
    svg.setAttribute("height", newH);

    wProp = newW;
    hProp = newH;
    updateProperties();

    topDiv = document.getElementById("top").style.width = `650px`;
}

function setWidth() {
    if (setW.value() == "") {
        setW.value("Give me a number.")
    } else {
        try {
            number = float(setW.value());

            if (isNaN(number)) {
                setW.value("Not a Number!");
            } else {
                let customW = float(setW.value());
                let scale = customW / w;
                let customH = h * scale;

                svg.setAttribute("width", String(customW));
                svg.setAttribute("height", String(customH));

                wProp = customW;
                hProp = customH;
                updateProperties();

                if (customW > 350) {
                    divWidth = customW + 350;
                    topDiv = document.getElementById("top").style.width = `${divWidth}px`;
                } else {
                    topDiv = document.getElementById("top").style.width = `650px`;
                }
            }

        } catch (error) {
            console.error(error);
        }
    }
}

function setHeight() {
    if (setH.value() == "") {
        setH.value("Give me a number.")
    } else {
        try {
            number = float(setH.value());

            if (isNaN(number)) {
                setH.value("Not a Number!");
            } else {
                let customH = float(setH.value());
                let scale = customH / h;
                let customW = w * scale;

                svg.setAttribute("width", String(customW));
                svg.setAttribute("height", String(customH));

                wProp = customW;
                hProp = customH;
                updateProperties();

                if (customW > 350) {
                    divWidth = customW + 350;
                    topDiv = document.getElementById("top").style.width = `${divWidth}px`;
                } else {
                    topDiv = document.getElementById("top").style.width = `350px`;
                }
            }

        } catch (error) {
            console.error(error);
        }
    }
}