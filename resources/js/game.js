/*
 * 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 */

import Pair from "./pair.js";
import Grid from "./grid.js";

"use strict";

const CLEAR_COLOR = "#e1e1e1";

window.onload = function() {

    let colors = ["#2d89ef", "#ffc40d", "#ee1111", "#00a300", "#7e3878", "#1d1d1d"];

    let grid;

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let space, left, right, down;
    let tLeft = 0,
        tRight = 0,
        tDown = 0;

    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "ArrowLeft":
                left = true;
                break;
            case "ArrowRight":
                right = true;
                break;
            case "ArrowDown":
                down = true;
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.code) {
            case "Space":
                space = true;
                break;
            case "ArrowLeft":
                left = false;
                tLeft = 0;
                break;
            case "ArrowRight":
                right = false;
                tRight = 0;
                break;
            case "ArrowDown":
                down = false;
                tDown = 0;
                break;
        }
        e.preventDefault();
    });

    let lastTime = 0;

    function step(timestamp) {
        requestAnimationFrame(step);
        let dt = (timestamp - lastTime) / 1000.0;
        lastTime = timestamp;
        update(dt);
        render();
    }
    requestAnimationFrame(step);

    let updateTime = 1;
    let time = 0;
    let score = 0;
    let pair;
    let next = new Pair();

    let columns = document.getElementById("columns");
    columns.value = 6;
    columns.addEventListener("input", function(e) {
        restart();
        updateUI();
    });

    document.getElementById("restart").addEventListener("click", function() {
        restart();
        updateUI();
    });

    document.getElementById("random").addEventListener("click", function() {
        restart();
        for (let a = 0, n = grid.cols * grid.rows; a < n; ++a) {
            if (Math.random() > 0.5) {
                grid.setCellIndex(a, Math.floor(Math.random() * 5));
            }
        }
        updateUI();
    });

    restart();

    function update(dt) {

        if (pair) {
            if (space) {
                space = false;
                pair.rotate(grid);
            }

            if (left) {
                if (tLeft == 0 || tLeft > 0.25) {
                    pair.moveX(grid, -1);
                }
                tLeft += dt;
            }

            if (right) {
                if (tRight == 0 || tRight > 0.25) {
                    pair.moveX(grid, 1);
                }
                tRight += dt;
            }

            if (down) {
                if (tDown == 0 || tDown > 0.3) {
                    if (!pair.moveDown(grid)) {
                        grid.setCell(pair.a.x, pair.a.y, pair.a.color);
                        grid.setCell(pair.b.x, pair.b.y, pair.b.color);
                        pair = null;
                    }
                }
                tDown += tDown;
            }
        }

        // Controls
        time += dt;
        if (time > updateTime) {
            time = 0;

            if (pair && !pair.moveDown(grid)) {
                grid.setCell(pair.a.x, pair.a.y, pair.a.color);
                grid.setCell(pair.b.x, pair.b.y, pair.b.color);
                pair = null;
            }

            // Update
            let falling = false;
            for (let j = grid.rows - 2; j >= 0; --j) {
                for (let i = 0; i < grid.cols; ++i) {
                    let color = grid.getCell(i, j);
                    if (color > -1 && grid.getCell(i, j + 1) == -1) {
                        grid.setCell(i, j, -1);
                        grid.setCell(i, j + 1, color);
                        falling = true;
                    }
                }
            }

            // Clear
            if (!falling) {
                let removed = 0;
                for (let j = 0; j < grid.rows; ++j) {
                    for (let i = 0; i < grid.cols; ++i) {

                        let idx = i * grid.rows + j;
                        let color = grid.getCellIndex(idx);

                        if (color > -1) {

                            let resultList = [idx];
                            let visitedList = [idx];
                            let queue = [{
                                x: i,
                                y: j
                            }];

                            do {

                                let v = queue.shift();
                                // up
                                if (v.y - 1 > -1) {
                                    idx = v.x * grid.rows + v.y - 1;
                                    if (!visitedList.includes(idx)) {
                                        visitedList.push(idx);
                                        if (grid.getCellIndex(idx) == color) {
                                            resultList.push(idx);
                                            queue.push({
                                                x: v.x,
                                                y: v.y - 1
                                            });
                                        }
                                    }
                                }

                                // down
                                if (v.y + 1 < grid.rows) {
                                    idx = v.x * grid.rows + v.y + 1;
                                    if (!visitedList.includes(idx)) {
                                        visitedList.push(idx);
                                        if (grid.getCellIndex(idx) == color) {
                                            resultList.push(idx);
                                            queue.push({
                                                x: v.x,
                                                y: v.y + 1
                                            });
                                        }
                                    }
                                }

                                // left
                                if (v.x - 1 > -1) {
                                    idx = (v.x - 1) * grid.rows + v.y;
                                    if (!visitedList.includes(idx)) {
                                        visitedList.push(idx);
                                        if (grid.getCellIndex(idx) == color) {
                                            resultList.push(idx);
                                            queue.push({
                                                x: v.x - 1,
                                                y: v.y
                                            });
                                        }
                                    }
                                }

                                // right
                                if (v.x + 1 < grid.cols) {
                                    idx = (v.x + 1) * grid.rows + v.y;
                                    if (!visitedList.includes(idx)) {
                                        visitedList.push(idx);
                                        if (grid.getCellIndex(idx) == color) {
                                            resultList.push(idx);
                                            queue.push({
                                                x: v.x + 1,
                                                y: v.y
                                            });
                                        }
                                    }
                                }
                            } while (queue.length > 0);

                            if (resultList.length > 3) {
                                removed += resultList.length;
                                score += resultList.length;
                                grid.clearList(resultList);
                                // console.log(score);
                            }

                        }
                    }
                }

                if (removed == 0) {
                    if (!pair) {
                        if (grid.getCell(2, 1) != -1) {
                            restart();
                        }
                        pair = next;
                        next = new Pair();
                        updateUI();
                    }
                } else {
                    let maxScore = 1000;
                    updateTime = 1.0 - Math.min(score, maxScore) * 0.9 / maxScore; // Increase speed
                    updateUI();
                }

            }

            if (!pair) {
                time += updateTime * 0.75;
            }

        }

    }

    function restart() {
        let cols = columns.value;
        if (cols > 100) cols = 100;
        else if (cols < 6) cols = 6;
        columns.value = cols;

        grid = new Grid(cols, Math.floor(cols * 13 / 6));
        updateTime = 1;
        score = 0;
        next = new Pair();
        pair = null;
    }

    function updateUI() {
        let p = document.getElementById("score");
        p.innerHTML = "Score: " + score;
        let c = document.getElementById("next");
        let ctx = c.getContext("2d");
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
        ctx.fillStyle = CLEAR_COLOR;
        ctx.fillRect(0, 0, c.offsetWidth, c.offsetHeight);

        let x = c.offsetWidth * 0.5;
        let y = c.offsetHeight * 0.5;

        let size = 45;
        let radius = size * 0.5;

        ctx.fillStyle = colors[next.b.color];
        ctx.beginPath();
        ctx.ellipse(x, y - radius, radius, radius, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = colors[next.a.color];
        ctx.beginPath();
        ctx.ellipse(x, y + radius, radius, radius, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    updateUI();

    function render() {

        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;
        canvas.width = w;
        canvas.height = h;

        let cw = w / grid.cols;
        let ch = h / (grid.rows - 1);

        // Clear screen
        ctx.fillStyle = CLEAR_COLOR;
        ctx.fillRect(0, 0, w, h);

        let r1 = cw * 0.5;
        let r2 = ch * 0.5;
        // Draw grid
        for (let i = 0; i < grid.cols; ++i) {
            for (let j = 1; j < grid.rows; ++j) {
                let color = grid.getCell(i, j);
                if (color > -1) {
                    ctx.fillStyle = colors[color];
                    // ctx.fillRect(i * cw, j * ch, cw, ch);
                    ctx.beginPath();
                    ctx.ellipse(i * cw + r1, (j - 1) * ch + r2, r1, r2, 0, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }

        if (pair) {
            pair.render(ctx, cw, ch, colors);
        }

    }

}