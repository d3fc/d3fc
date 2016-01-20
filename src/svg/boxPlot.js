import d3 from 'd3';

// Renders a box plot series as an SVG path based on the given array of datapoints.
export default function() {

    var value = function(d, i) { return d.value; },
        median = function(d, i) { return d.median; },
        upperQuartile = function(d, i) { return d.upperQuartile; },
        lowerQuartile = function(d, i) { return d.lowerQuartile; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        orient = 'vertical',
        width = d3.functor(5),
        cap = d3.functor(0.5);

    var boxPlot = function(data) {

        return data.map(function(d, i) {
            // naming convention is for vertical orientation
            var _value = value(d, i),
                _width = width(d, i),
                halfWidth = _width / 2,
                capWidth = _width * cap(d, i),
                halfCapWidth = capWidth / 2,
                _high = high(d, i),
                _upperQuartile = upperQuartile(d, i),
                _median = median(d, i),
                _lowerQuartile = lowerQuartile(d, i),
                _low = low(d, i),
                highToUpperQuartile = _upperQuartile - _high,
                upperQuartileToMedian = _median - _upperQuartile,
                upperQuartileToLowerQuartile = _lowerQuartile - _upperQuartile,
                medianToLowerQuartile = _lowerQuartile - _median,
                lowerQuartileToLow = _low - _lowerQuartile;

            if (orient === 'vertical') {
                // start top center
                return 'M' + _value + ',' + _high +
                    'h' + (-halfCapWidth) +
                    'h' + capWidth +
                    'h' + (-halfCapWidth) +
                    'v' + highToUpperQuartile +
                    'h' + (-halfWidth) +
                    'v' + upperQuartileToLowerQuartile +
                    'h' + _width +
                    'v' + (-upperQuartileToLowerQuartile) +
                    'h' + (-halfWidth) +
                    'm' + (-halfWidth) + ',' + upperQuartileToMedian +
                    'h' + _width +
                    'm' + (-halfWidth) + ',' + medianToLowerQuartile +
                    'v' + lowerQuartileToLow +
                    'h' + (-halfCapWidth) +
                    'h' + capWidth +
                    'h' + (-halfCapWidth);
            } else {
                // start middle left
                return 'M' + _low + ',' + _value +
                    'v' + (-halfCapWidth) +
                    'v' + capWidth +
                    'v' + (-halfCapWidth) +
                    'h' + (-lowerQuartileToLow) +
                    'v' + (-halfWidth) +
                    'h' + (-upperQuartileToLowerQuartile) +
                    'v' + _width +
                    'h' + upperQuartileToLowerQuartile +
                    'v' + (-halfWidth) +
                    'm' + (-medianToLowerQuartile) + ',' + (-halfWidth) +
                    'v' + _width +
                    'm' + (-upperQuartileToMedian) + ',' + (-halfWidth) +
                    'h' + (-highToUpperQuartile) +
                    'v' + (-halfCapWidth) +
                    'v' + capWidth +
                    'v' + (-halfCapWidth);
            }
        })
        .join('');
    };

    boxPlot.value = function(_x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.median = function(_x) {
        if (!arguments.length) {
            return median;
        }
        median = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.upperQuartile = function(_x) {
        if (!arguments.length) {
            return upperQuartile;
        }
        upperQuartile = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.lowerQuartile = function(_x) {
        if (!arguments.length) {
            return lowerQuartile;
        }
        lowerQuartile = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.high = function(_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.low = function(_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.orient = function(_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return boxPlot;
    };
    boxPlot.cap = function(_x) {
        if (!arguments.length) {
            return cap;
        }
        cap = d3.functor(_x);
        return boxPlot;
    };

    return boxPlot;

}
