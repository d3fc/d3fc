(function(d3, fc) {
    'use strict';

    // Renders a bar series as an SVG path based on the given array of datapoints. Each
    // bar has a fixed width, whilst the x, y and height are obtained from each data
    // point via the supplied accessor functions.
    fc.svg.bar = function() {

        var x = function(d, i) { return d.x; },
            y = function(d, i) { return d.y; },
            align = 'center',
            height = function(d, i) { return d.height; },
            width = d3.functor(3);

        var bar = function(data, index) {

            return data.map(function(d, i) {
                var xValue = x.call(this, d, index || i),
                    yValue = y.call(this, d, index || i),
                    barHeight = height.call(this, d, index || i),
                    barWidth = width.call(this, d, index || i);

                var offset;

                switch (align) {
                    case 'left':
                        offset = barWidth;
                        break;
                    case 'right':
                        offset = 0;
                        break;
                    case 'center':
                        offset = barWidth / 2;
                        break;
                    default:
                        throw new Error('Invalid alignment');
                }

                // Move to the start location
                var body = 'M' + (xValue - offset) + ',' + yValue +
                    // Draw the width
                    'h' + barWidth +
                    // Draw to the top
                    'v' + barHeight +
                    // Draw the width
                    'h' + -barWidth +
                    // Close the path
                    'z';
                return body;
            }, this)
            .join('');
        };

        bar.x = function(_x) {
            if (!arguments.length) {
                return x;
            }
            x = d3.functor(_x);
            return bar;
        };
        bar.y = function(x) {
            if (!arguments.length) {
                return y;
            }
            y = d3.functor(x);
            return bar;
        };
        bar.width = function(x) {
            if (!arguments.length) {
                return width;
            }
            width = d3.functor(x);
            return bar;
        };
        bar.align = function(x) {
            if (!arguments.length) {
                return align;
            }
            align = x;
            return bar;
        };
        bar.height = function(x) {
            if (!arguments.length) {
                return height;
            }
            height = d3.functor(x);
            return bar;
        };
        return bar;

    };
}(d3, fc));
