// For the properties div.
// ============================================================================
const propObj = {
    wProp: "-",
    hProp: "-",
    npProp: "-",
    plProp: "-"
}

function updateProperties() {
    let pdiv = $("#properties")[0];
    pdiv.innerHTML = `<h2><ins>Properties:</ins></h2>
                      <p>Width: ${propObj.wProp}<p>
                      <p>Height: ${propObj.hProp}<p>
                      <p>Number of Paths: ${propObj.npProp}<p>
                      <p>Selected Path Length: ${propObj.plProp}<p>`;
}

// For the canvas.
// ============================================================================
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 4;
        this.colorU = "#d101c0";
        this.colorP = "#00cf07";
        this.color = this.colorU;
        this.collision = false;
    }

    show() {
        strokeWeight(0.8);
        fill(this.color);
        ellipse(this.x, this.y, 2 * this.r);
    }

    pointInEllipse(x, y) {
        let d = dist(this.x, this.y, x, y);
        if (d <= this.r) {
            return true;
        } else {
            return false;
        }
    }

    changeColor() {
        if (this.color == this.colorU) {
            this.color = this.colorP;
        } else {
            this.color = this.colorU;
        }
    }
}