import d3 from 'd3';

// Renders a box plot series as an SVG path based on the given array of datapoints.
export default function() {

    var x = function(d, i) { return d.x; },
        y = function(d, i) { return d.y; },
        boxHigh = function(d, i) { return d.boxHigh; },
        boxLow = function(d, i) { return d.boxLow; },
        whiskerHigh = function(d, i) { return d.whiskerHigh; },
        whiskerLow = function(d, i) { return d.whiskerLow; },
        orient = 'vertical',
        barWidth = d3.functor(5);

    var boxPlot = function(data) {

        return data.map(function(d, i) {
            var halfWidth = barWidth(d, i) / 2,
                whiskerTotal = whiskerHigh(d, i) - whiskerLow(d, i),
                yBottom = y(d, i) - whiskerLow(d, i),
                yTop = whiskerHigh(d, i) - y(d, i),
                xBottom = x(d, i) - whiskerLow(d, i),
                xTop = whiskerHigh(d, i) - x(d, i);

            var whiskerVertical = '';
            var whiskerHorizontal = '';

            if (orient === 'vertical') {
                var horizontalBar = 'h' + (-halfWidth) + 'h' + (2 * halfWidth) + 'h' + (-halfWidth),
                    verticalToHigh = 'v' + (-whiskerTotal);
                whiskerVertical = 'M0,' + yBottom + horizontalBar + verticalToHigh + horizontalBar + 'M0,' + yTop;
            } else {
                var verticalBar = 'v' + (-halfWidth) + 'v' + (2 * halfWidth) + 'v' + (-halfWidth),
                    horizontalToHigh = 'h' + (-whiskerTotal);
                whiskerHorizontal = 'M' + xBottom + ',0' + verticalBar + horizontalToHigh + verticalBar + 'M' + xTop + ',0';
            }

            return whiskerVertical + whiskerHorizontal;
        })
        .join('');
    };

    boxPlot.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.y = function(_x) {
        if (!arguments.length) {
            return y;
        }
        y = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.boxHigh = function(_x) {
        if (!arguments.length) {
            return boxHigh;
        }
        boxHigh = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.boxLow = function(_x) {
        if (!arguments.length) {
            return boxLow;
        }
        boxLow = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.whiskerHigh = function(_x) {
        if (!arguments.length) {
            return whiskerHigh;
        }
        whiskerHigh = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.whiskerLow = function(_x) {
        if (!arguments.length) {
            return whiskerLow;
        }
        whiskerLow = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.barWidth = function(_x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.orient = function(_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return boxPlot;
    };

    return boxPlot;

}
