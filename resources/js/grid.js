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

    this.clear();
}

export default Grid;