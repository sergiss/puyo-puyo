/*
 * 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 */
var Grid = function(cols, rows) {

    this.cols = cols;
    this.rows = rows;

    this.data = [];

    this.setCell = function(x, y, value) {
        this.setCellIndex(x * this.rows + y, value);
    }

    this.setCellIndex = function(index, value) {
        this.data[index] = value;
    }

    this.getCell = function(x, y) {
        return this.getCellIndex(x * this.rows + y);
    }

    this.getCellIndex = function(index) {
        return this.data[index];
    }

    this.clear = function() {
        let n = this.cols * this.rows;
        for (let i = 0; i < n; ++i) {
            this.data[i] = -1;
        }
    }

    this.clearList = function(list) {
        for (let i = 0; i < list.length; ++i) {
            this.data[list[i]] = -1;
        }
    }

    this.findNeighbors = function(col, row, callback) {


        let idx = col * this.rows + row;
        let color = this.getCellIndex(idx);

        if (color > -1) {

            let resultList = [idx];
            let visitedList = [idx];
            let queue = [{
                x: col,
                y: row
            }];

            do {

                let v = queue.shift();
                // up
                if (v.y > 0) {
                    idx = v.x * this.rows + v.y - 1;
                    if (!visitedList.includes(idx)) {
                        visitedList.push(idx);
                        if (this.getCellIndex(idx) == color) {
                            resultList.push(idx);
                            queue.push({
                                x: v.x,
                                y: v.y - 1
                            });
                        }
                    }
                }

                // down
                if (v.y + 1 < this.rows) {
                    idx = v.x * this.rows + v.y + 1;
                    if (!visitedList.includes(idx)) {
                        visitedList.push(idx);
                        if (this.getCellIndex(idx) == color) {
                            resultList.push(idx);
                            queue.push({
                                x: v.x,
                                y: v.y + 1
                            });
                        }
                    }
                }

                // left
                if (v.x > 0) {
                    idx = (v.x - 1) * this.rows + v.y;
                    if (!visitedList.includes(idx)) {
                        visitedList.push(idx);
                        if (this.getCellIndex(idx) == color) {
                            resultList.push(idx);
                            queue.push({
                                x: v.x - 1,
                                y: v.y
                            });
                        }
                    }
                }

                // right
                if (v.x + 1 < this.cols) {
                    idx = (v.x + 1) * this.rows + v.y;
                    if (!visitedList.includes(idx)) {
                        visitedList.push(idx);
                        if (this.getCellIndex(idx) == color) {
                            resultList.push(idx);
                            queue.push({
                                x: v.x + 1,
                                y: v.y
                            });
                        }
                    }
                }

            } while (queue.length > 0);

            callback(resultList);

        }

    }

    this.clone = function() {
        let tmp = new Grid(this.cols, this.rows);
        let n = this.cols * this.rows;
        for (let i = 0; i < n; ++i) {
            tmp.data[i] = this.data[i];
        }
        return tmp;
    }

    this.clear();
}

export default Grid;