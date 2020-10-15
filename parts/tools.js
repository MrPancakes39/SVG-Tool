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
    let canLoad = true;
    svg = document.getElementById("svg");
    placeholder = document.getElementById("placeholder");

    if (placeholder) {
        document.getElementById("view").removeChild(placeholder);
    } else {
        if (svg) {
            document.getElementById("view").removeChild(svg);
        } else {
            canLoad == false;
            //console.log("Can't Load SVG.");
            output("Can't Load SVG.");
        }
    }

    if (canLoad) {
        document.getElementById("view").innerHTML += svgLoad.value();

        svg = document.getElementById("svg");

        if (svg) {
            nPaths = svg.childElementCount;

            npProp = nPaths;
            updateProperties();

            selPathSetup(nPaths);

            w = svg.getAttribute("width");
            h = svg.getAttribute("height");

            takeM.w = w;
            takeM.h = h;

            let scale;
            if (w <= h) {
                scale = 240 / h;
            } else {
                scale = 240 / w;
            }

            newH = String(h * scale);
            newW = String(w * scale);

            takeM.wSVG = newW;
            takeM.hSVG = newH;

            svg.setAttribute("width", newW);
            svg.setAttribute("height", newH);

            wProp = newW;
            hProp = newH;
            updateProperties();
        } else {
            document.getElementById("view").innerHTML = `<h2><ins>View SVG:</ins></h2>
                                                         <img id="placeholder" src="images/placeholder_alt.png">`;
            //console.log("Invalid SVG!!");
            output(`Can't Load SVG or It's an Invalid SVG!!`);
        }
    }
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
            output("There is an error in console.");
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
                    topDiv = document.getElementById("top").style.width = `650px`;
                }
            }

        } catch (error) {
            console.error(error);
            output("There is an error in console.");
        }
    }
}