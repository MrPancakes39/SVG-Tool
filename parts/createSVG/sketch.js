let svg, path;
let w, h, d;
let button, mainDiv;

function setup() {
    noCanvas();

    svg = document.getElementById("svg")
    path = document.getElementById("Path")

    mainDiv = createDiv("");
    mainDiv.attribute("id", "main")

    let div = createDiv("");
    div.attribute("id", "tools")

    let h1 = createElement("h2");
    let title1 = createElement("ins", "Tools:");
    title1.parent(h1);
    div.child(h1);

    let p1 = createP("width");
    w = createInput("");
    div.child(p1);
    div.child(w);

    let p2 = createP("height");
    h = createInput("");
    div.child(p2);
    div.child(h);

    let p3 = createP("d value");
    d = createInput("");
    div.child(p3);
    div.child(d);

    let p4 = createP("scale");
    scale = createInput("100");
    div.child(p4);
    div.child(scale);

    let p5 = createP("");
    button = createButton("Generate SVG");
    button.mousePressed(generateSVG);
    div.child(p5);
    div.child(button);

    let div2 = select("#preview")

    let p6 = createP("");
    let h2 = createElement("h2");
    let title2 = createElement("ins", "Preview SVG:")
    title2.parent(h2);
    div2.child(p6);
    div2.child(h2);
    posSVG();

    mainDiv.child(div);
    mainDiv.child(div2);

    mainDiv.style("width", "500px")
}

function posSVG() {
    let p5svg = select("#svg");
    p5svg.hide();

    let temp = document.createElement("p");
    temp.setAttribute("id", "temp");
    document.getElementById("preview").appendChild(temp);

    svgMove = document.getElementById("svg");
    document.getElementById("preview").insertBefore(svgMove, temp);

    p5svg.show();
    document.getElementById("preview").removeChild(temp);
}

function generateSVG() {
    let newW = String(float(w.value()) * (float(scale.value()) / 100));
    let newH = String(float(w.value()) * (float(scale.value()) / 100));

    let viewBox = "0 0 " + w.value() + " " + h.value();

    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("width", newW);
    svg.setAttribute("height", newH);

    path.setAttribute("d", d.value());
    mainDiv.style("width", String((float(newW) + 260)) + "px");
    //console.log(String((float(w.value()) + 200)) + "px");
}