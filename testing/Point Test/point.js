class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 12;
        this.colorU = "#d101c0";
        this.colorP = "#00cf07";
        this.color = this.colorU;
        this.collision = false;
    }

    show() {
        strokeWeight(1.2);
        fill(this.color);
        ellipse(this.x, this.y, this.r);
    }

    checkCollision() {
        let d = dist(this.x, this.y, mouseX, mouseY);
        if (d <= this.r) {
            this.collision = true;
        } else {
            this.collision = false;
        }
    }

    update() {
        if (this.collision) {
            this.color = this.colorP;
        } else {
            this.color = this.colorU;
        }
    }
}