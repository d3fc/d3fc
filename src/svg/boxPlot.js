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
                whiskerToBotBox = boxLow(d, i) - whiskerLow(d, i),
                boxToMid = y(d, i) - boxLow(d, i),
                midToBox = boxHigh(d, i) - y(d, i),
                boxToWhiskerHigh = whiskerHigh(d, i) - boxHigh(d, i),
                yBottom = y(d, i) - whiskerLow(d, i),
                yTop = whiskerHigh(d, i) - y(d, i),
                xBottom = x(d, i) - whiskerLow(d, i),
                xTop = whiskerHigh(d, i) - x(d, i);

            var boxSeriesVertical = '';
            var boxSeriesHorizontal = '';

            if (orient === 'vertical') {

                var horizontalBar = 'h' + (-halfWidth) + 'h' + (2 * halfWidth) + 'h' + (-halfWidth),
                    verticalToBotBox = 'v' + (-whiskerToBotBox),
                    verticalToMidBox = 'v' + (-boxToMid),
                    verticalToMidBoxDown = 'v' + (boxToMid),
                    verticalToTopBox = 'v' + (-midToBox),
                    verticalToTopBoxDown = 'v' + (midToBox),
                    verticalToWhisker = 'v' + (-boxToWhiskerHigh);

                boxSeriesVertical = 'M0,' + yBottom
                    + horizontalBar + verticalToBotBox
                    + 'h' + (-halfWidth)
                    + verticalToMidBox
                    + 'h' + (2 * halfWidth)
                    + verticalToMidBoxDown
                    + 'h' + (-2 * halfWidth)
                    + verticalToMidBox
                    + verticalToTopBox
                    + 'h' + (2 * halfWidth)
                    + verticalToTopBoxDown
                    + 'h' + (-2 * halfWidth)
                    + verticalToTopBox
                    + 'h' + (halfWidth)
                    + verticalToWhisker
                    + horizontalBar + 'M0,' + yTop;

            } else {

                var verticalBar = 'v' + (-halfWidth) + 'v' + (2 * halfWidth) + 'v' + (-halfWidth),
                    horizontalToBotBox = 'h' + (-whiskerToBotBox),
                    horizontalToMidBox = 'h' + (-boxToMid),
                    horizontalToMidBoxDown = 'h' + (boxToMid),
                    horizontalToTopBox = 'h' + (-midToBox),
                    horizontalToTopBoxDown = 'h' + (midToBox),
                    horizontalToWhisker = 'h' + (-boxToWhiskerHigh);

                boxSeriesHorizontal = 'M' + xBottom + ',0'
                    + verticalBar + horizontalToBotBox
                    + 'v' + (-halfWidth)
                    + horizontalToMidBox
                    + 'v' + (2 * halfWidth)
                    + horizontalToMidBoxDown
                    + 'v' + (-2 * halfWidth)
                    + horizontalToMidBox
                    + horizontalToTopBox
                    + 'v' + (2 * halfWidth)
                    + horizontalToTopBoxDown
                    + 'v' + (-2 * halfWidth)
                    + horizontalToTopBox
                    + 'v' + (halfWidth)
                    + horizontalToWhisker
                    + verticalBar + 'M' + xTop + ',0';
            }

            return boxSeriesVertical + boxSeriesHorizontal;
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
