import d3 from 'd3';

// Renders an error bar series as an SVG path based on the given array of datapoints.
export default function() {

    var x = function(d, i) { return d.x; },
        y = function(d, i) { return d.y; },
        errorHigh = function(d, i) { return d.errorHigh; },
        errorLow = function(d, i) { return d.errorLow; },
        orient = 'vertical',
        barWidth = d3.functor(5);

    var errorBar = function(data) {

        return data.map(function(d, i) {
            var halfWidth = barWidth(d, i) / 2,
                errorTotal = errorHigh(d, i) - errorLow(d, i),
                yBottom = y(d, i) - errorLow(d, i),
                yTop = errorHigh(d, i) - y(d, i),
                xBottom = x(d, i) - errorLow(d, i),
                xTop = errorHigh(d, i) - x(d, i);

            var errorVertical = '';
            var errorHorizontal = '';

            if (orient === 'vertical') {
                var horizontalBar = 'h' + (-halfWidth) + 'h' + (2 * halfWidth) + 'h' + (-halfWidth),
                    verticalToHigh = 'v' + (-errorTotal);
                errorVertical = 'M0,' + yBottom + horizontalBar + verticalToHigh + horizontalBar + 'M0,' + yTop;
            } else {
                var verticalBar = 'v' + (-halfWidth) + 'v' + (2 * halfWidth) + 'v' + (-halfWidth),
                    horizontalToHigh = 'h' + (-errorTotal);
                errorHorizontal = 'M' + xBottom + ',0' + verticalBar + horizontalToHigh + verticalBar + 'M' + xTop + ',0';
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
    errorBar.errorHigh = function(_x) {
        if (!arguments.length) {
            return errorHigh;
        }
        errorHigh = d3.functor(_x);
        return errorBar;
    };
    errorBar.errorLow = function(_x) {
        if (!arguments.length) {
            return errorLow;
        }
        errorLow = d3.functor(_x);
        return errorBar;
    };
    errorBar.barWidth = function(_x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(_x);
        return errorBar;
    };
    errorBar.orient = function(_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return errorBar;
    };

    return errorBar;

}
