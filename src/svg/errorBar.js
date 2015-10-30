import d3 from 'd3';

// Renders an error bar series as an SVG path based on the given array of datapoints.
export default function() {

    var x = function(d, i) { return d.x; },
        y = function(d, i) { return d.y; },
        xHigh = function(d, i) { return d.xHigh; },
        xLow = function(d, i) { return d.xLow; },
        yHigh = function(d, i) { return d.yHigh; },
        yLow = function(d, i) { return d.yLow; },
        width = d3.functor(3);

    var errorBar = function(data) {

        return data.map(function(d, i) {
            var halfWidth = width(d, i) / 2,
                yTotal = yHigh(d, i) - yLow(d, i),
                yBottom = y(d, i) - yLow(d, i),
                yUpper = yHigh(d, i) - y(d, i),
                xTotal = xHigh(d, i) - xLow(d, i),
                xBottom = x(d, i) - xLow(d, i),
                xUpper = xHigh(d, i) - x(d, i);

            var errorVertical = '';
            var errorHorizontal = '';

            if (yTotal !== 0) {
                var horizontalBar = 'h' + (-halfWidth) + 'h' + (2 * halfWidth) + 'h' + (-halfWidth),
                    verticalToHigh = 'v' + (-yTotal);
                errorVertical = 'M0,' + yBottom + horizontalBar + verticalToHigh + horizontalBar + 'M0,' + yUpper;
            }

            if (xTotal !== 0) {
                var verticalBar = 'v' + (-halfWidth) + 'v' + (2 * halfWidth) + 'v' + (-halfWidth),
                    horizontalToHigh = 'h' + (-xTotal);
                errorHorizontal = 'M' + xBottom + ',0' + verticalBar + horizontalToHigh + verticalBar + 'M' + xUpper + ',0';
            }

            return errorVertical + errorHorizontal;
        })
        .join('');
    };

    errorBar.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return errorBar;
    };
    errorBar.y = function(_x) {
        if (!arguments.length) {
            return y;
        }
        y = d3.functor(_x);
        return errorBar;
    };
    errorBar.xHigh = function(_x) {
        if (!arguments.length) {
            return xHigh;
        }
        xHigh = d3.functor(_x);
        return errorBar;
    };
    errorBar.xLow = function(_x) {
        if (!arguments.length) {
            return xLow;
        }
        xLow = d3.functor(_x);
        return errorBar;
    };
    errorBar.yHigh = function(_x) {
        if (!arguments.length) {
            return yHigh;
        }
        yHigh = d3.functor(_x);
        return errorBar;
    };
    errorBar.yLow = function(_x) {
        if (!arguments.length) {
            return yLow;
        }
        yLow = d3.functor(_x);
        return errorBar;
    };
    errorBar.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return errorBar;
    };

    return errorBar;

}
