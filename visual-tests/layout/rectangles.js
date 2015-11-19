(function(d3, fc) {
    'use strict';

    /*eslint-disable */
    function strategy() {

        var width = d3.functor(0),
            height = d3.functor(0),
            x = function(d, i) { return d.x; },
            y = function(d, i) { return d.y; },
            containerWidth = 1,
            containerHeight = 1;

        var strategy = function(data) {

            var boundingBoxes = data;

            var padding = 5,
                spacing = 5,
                rounded = 0,
                rotationStart = 20,
                rotationSteps = 20,
                stalkLength = 0;

            function rectanglesIntersect(rr1, rr2) {
                return !(rr2.left() > rr1.right() ||
                    rr2.right() < rr1.left() ||
                    rr2.top() > rr1.bottom() ||
                    rr2.bottom() < rr1.top());
            }

            var sortedRects = boundingBoxes.sort(function(a, b) {
                if (a.y < b.y) {
                    return -1;
                }
                if (a.y > b.y) {
                    return 1;
                }
                return 0;
            });

            var currentRotation = rotationStart;
            for (var i = 0; i < sortedRects.length; i++) {

                // Calculate the x and y components of the stalk
                var offsetX = stalkLength * Math.sin(currentRotation * (Math.PI / 180));
                sortedRects[i].x += offsetX;
                var offsetY = stalkLength * Math.cos(currentRotation * (Math.PI / 180));
                sortedRects[i].y -= offsetY;

                currentRotation += rotationSteps;
            }

            // Tree sorting algo (Sudo code below)
            for (var r1 = 0; r1 < sortedRects.length; r1++) {
                for (var r2 = r1 + 1; r2 < sortedRects.length; r2++) {

                    if (!sortedRects[r1].left) {
                        sortedRects[r1].left = function() { return this.x - padding; };
                        sortedRects[r1].right = function() { return this.x + this.width + padding; };
                        sortedRects[r1].bottom = function() { return this.y + this.height + padding; };
                        sortedRects[r1].top = function() { return this.y - padding; };
                    }

                    if (!sortedRects[r2].left) {
                        sortedRects[r2].left = function() { return this.x - padding; };
                        sortedRects[r2].right = function() { return this.x + this.width + padding; };
                        sortedRects[r2].bottom = function() { return this.y + this.height + padding; };
                        sortedRects[r2].top = function() { return this.y - padding; };
                    }

                    if (rectanglesIntersect(sortedRects[r1], sortedRects[r2])) {

                        // Find the smallest move to correct the overlap
                        var smallest = 0; // 0=left, 1=right, 2=down
                        var left = sortedRects[r2].right() - sortedRects[r1].left();
                        var right = sortedRects[r1].right() - sortedRects[r2].left();
                        if (right < left) {
                            smallest = 1;
                        }
                        var down = sortedRects[r1].bottom() - sortedRects[r2].top();
                        if (down < right && down < left) {
                            smallest = 2;
                        }

                        if (smallest === 0) {
                            sortedRects[r2].x -= (left + spacing);
                        } else if (smallest === 1) {
                            sortedRects[r2].x += (right + spacing);
                        } else if (smallest === 2) {
                            sortedRects[r2].y += (down + spacing);
                        }
                    }
                }
            }

            return sortedRects;
        };

        strategy.containerWidth = function(value) {
            if (!arguments.length) {
                return containerWidth;
            }
            containerWidth = value;
            return strategy;
        };

        strategy.containerHeight = function(value) {
            if (!arguments.length) {
                return containerHeight;
            }
            containerHeight = value;
            return strategy;
        };

        return strategy;
    }


    /*eslint-enable */

    // a very simple example component
    function label(selection) {
        selection.append('rect')
            .attr({'width': itemWidth, 'height': itemHeight});
        selection.append('text')
            .text(function(d) { return d.data; })
            .attr({'y': 18, 'x': 20});
    }

    var data = [
        { x: 100, y: 100, data: 'hi'},
        { x: 50, y: 100, data: 'hello'},
        { x: 20, y: 75, data: 'W0Ot'},
        { x: 250, y: 200, data: 'Welcome'}
    ];

    var width = 600, height = 250;
    var itemWidth = 100, itemHeight = 30;

    var svg = d3.select('#tooltip')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var xScale = d3.scale.linear()
        .range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    var smart = fc.layout.rectangles(strategy())
        .xScale(xScale)
        .yScale(yScale)
        .size([itemWidth, itemHeight])
        .component(label);

    svg.datum(data)
        .call(smart);

})(d3, fc);
