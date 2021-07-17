/*
 * 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 */
var Cell = function(x, y) {

    this.x = x;
    this.y = y;
    this.color = Math.floor(Math.random() * 5);
}

export default Cell;