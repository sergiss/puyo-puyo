var AI = function() {

    this.computeBestMove = function(pair, grid) {

        let result = null;
        let p, g, rate;
        for (let i = 0; i < grid.cols; ++i) {
            p = pair.clone();
            p.a.x = i;
            p.b.x = i;

            for (let j = 0; j < 4; ++j) {

                g = grid.clone();

                if (j != 0) {
                    p.rotate(g);
                }

                // Perform move
                while (p.moveDown(g)) {}

                if (p.a.y >= p.b.y)
                    while (p.a.y + 1 < g.rows && g.getCell(p.a.x, p.a.y + 1) == -1) {
                        p.a.y++;
                    }
                g.setCell(p.a.x, p.a.y, p.a.color);
                if (p.b.y >= p.a.y)
                    while (p.b.y + 1 < g.rows && g.getCell(p.b.x, p.b.y + 1) == -1) {
                        p.b.y++;
                    }
                g.setCell(p.b.x, p.b.y, p.b.color);

                // Rate move
                rate = 0;
                g.findNeighbors(p.a.x, p.a.y, function(list) {
                    rate += list.length - (g.rows - p.a.y) * 0.01;
                });

                g.findNeighbors(p.b.x, p.b.y, function(list) {
                    rate += list.length - (g.rows - p.b.y) * 0.01;
                });

                // update result
                if (result == null || result.rate < rate) {
                    // console.log(rate);
                    result = {
                        move: {
                            c: i,
                            r: j
                        },
                        rate: rate // move rate
                    }
                }

            }

        }
    
        return result.move;

    }

}

export default AI;
