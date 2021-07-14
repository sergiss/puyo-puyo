/*
 * 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 */
import Cell from "./cell.js";

var Pair = function() {

    this.a = new Cell(2, 1);
    this.b = new Cell(2, 0);
    this.rotation = 0;

    this.render = function(ctx, cw, ch, colors) {

        const { a, b } = this;

        let r1 = cw * 0.5;
        let r2 = ch * 0.5;

        ctx.fillStyle = colors[a.color];
        //ctx.fillRect(a.x * cw, a.y * ch, cw, ch);
        ctx.beginPath();
        ctx.ellipse(a.x * cw + r1, (a.y - 1) * ch + r2, r1, r2, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = colors[b.color];
        //ctx.fillRect(b.x * cw, b.y * ch, cw, ch);
        ctx.beginPath();
        ctx.ellipse(b.x * cw + r1, (b.y - 1) * ch + r2, r1, r2, 0, 0, 2 * Math.PI);
        ctx.fill();

    }

    this.moveX = function(grid, v) {

        const { a, b } = this;

        let x1 = a.x + v;
        if (x1 < 0 || x1 >= grid.cols || grid.getCell(x1, a.y) != -1) return;
        let x2 = b.x + v;
        if (x2 < 0 || x2 >= grid.cols || grid.getCell(x2, b.y) != -1) return;

        a.x = x1;
        b.x = x2;

    }

    this.moveDown = function(grid) {
        const { a, b } = this;

        let y1 = a.y + 1;
        if (y1 >= grid.rows || grid.getCell(a.x, y1) != -1) {
            return false;
        }

        let y2 = b.y + 1;
        if (y2 >= grid.rows || grid.getCell(b.x, y2) != -1) {
            return false;
        }

        a.y = y1;
        b.y = y2;

        return true;
    }

    this.rotate = function(grid) {

        const { a, b } = this;

        let r = (this.rotation + 1) % 4;

        let x1 = a.x,
            y1 = a.y,
            x2, y2;

        switch (r) {
            case 0:
                x2 = x1;
                y2 = y1 - 1;
                break;
            case 1:
                if (x1 + 1 >= grid.cols) {
                    x1--; // offset
                } else if (grid.getCell(x1 + 1, y1) != -1) {
                    return; // rotation not allowed
                }
                x2 = x1 + 1;
                y2 = y1;
                break;
            case 2:
                if (y1 + 1 >= grid.rows) {
                    y1--; // offset
                } else if (grid.getCell(x1, y1 + 1) != -1) {
                    return; // rotation not allowed
                }
                x2 = x1;
                y2 = y1 + 1;
                break;
            case 3:
                if (x1 - 1 < 0) {
                    x1++; // offset
                } else if (grid.getCell(x1 - 1, y1) != -1) {
                    return; // rotation not allowed
                }
                x2 = x1 - 1;
                y2 = y1;
                break;
        }

        if (grid.getCell(x1, y1) != -1) {
            return; // rotation not allowed
        }

        // update
        this.rotation = r;

        a.x = x1;
        a.y = y1;

        b.x = x2;
        b.y = y2;

    }

}

export default Pair;