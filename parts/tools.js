function setupTools() {
    select("#loadButton").mousePressed(loadSVG);
    select("#orgSize").mousePressed(originalSize);
    select("#revSize").mousePressed(revertSize);

    setW = select("#setW");
    select("#setWButton").mousePressed(setWidth);

    setH = select("#setH");
    select("#setHButton").mousePressed(setHeight);
}

function loadSVG() {
    // Checks run before SVG Loads.
    let canLoad = true;
    let viewDiv = $("#view")[0];
    if ($("#placeholder")[0]) {
        viewDiv.removeChild($("#placeholder")[0]);
    } else if ($("#svg")[0]) {
        viewDiv.removeChild($("#svg")[0]);
    } else {
        viewDiv.innerHTML = "<h2><ins>View SVG:</ins></h2>";
    }

    // If the SVG can be loaded, load it.
    if (canLoad) {
        $("#view")[0].innerHTML += $("#svgLoad").val();

        let svg = $("#svg")[0];
        if (svg) {
            nPaths = svg.childElementCount;

            propObj.npProp = nPaths;
            updateProperties();

            selPathSetup(nPaths);

            w = svg.getAttribute("width");
            h = svg.getAttribute("height");

            takeM.w = w;
            takeM.h = h;

            // Scales the svg to fit the div.
            let scale;
            if (w <= h) {
                scale = 240 / h;
            } else {
                scale = 240 / w;
            }

            newH = String(h * scale);
            newW = String(w * scale);

            // <Start> For the canvas calculation.
            canvScale = 240 / w;
            takeM.wSVG = String(w * canvScale);
            takeM.hSVG = String(h * canvScale);
            // <End> Used for tthe mapping.

            svg.setAttribute("width", newW);
            svg.setAttribute("height", newH);

            propObj.wProp = newW;
            propObj.hProp = newH;
            updateProperties();
        } else {
            viewDiv.innerHTML = `<h2><ins>View SVG:</ins></h2>
                                 <img id="placeholder" src="images/placeholder_alt.png">`;
            output(`Can't Load SVG or It's an Invalid SVG!!`);
        }
    }
}

// Tests if the width of the SVG. If it is too big for the div, it resize it.
function resizeDiv(wid) {
    if (wid > 350) {
        tdivWidth = float(wid) + 350;
        mdivWidth = tdivWidth + 300;
        topDiv = $("#top").css("width", `${tdivWidth}px`);
        mainDiv = $("#main").css("width", `${mdivWidth}px`);
    } else {
        topDiv = $("#top").css("width", `650px`);
        mainDiv = $("#main").css("width", `950px`);
    }
}

// The following functions is to set the size of the SVG.
function originalSize() {
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    resizeDiv(w);

    propObj.wProp = w;
    propObj.hProp = h;
    updateProperties();
}

function revertSize() {
    svg.setAttribute("width", newW);
    svg.setAttribute("height", newH);
    resizeDiv(newW);

    propObj.wProp = newW;
    propObj.hProp = newH;
    updateProperties();
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
                resizeDiv(customW);

                propObj.wProp = customW;
                propObj.hProp = customH;
                updateProperties();
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
                resizeDiv(customW);

                propObj.wProp = customW;
                propObj.hProp = customH;
                updateProperties();
            }
        } catch (error) {
            console.error(error);
            output("There is an error in console.");
        }
    }
}