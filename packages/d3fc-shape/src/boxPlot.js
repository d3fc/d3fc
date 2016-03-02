import d3 from 'd3';

// Renders a box plot series as an SVG path based on the given array of datapoints.
export default function(context) {

    var value = function(d) { return d.value; },
        median = function(d) { return d.median; },
        upperQuartile = function(d) { return d.upperQuartile; },
        lowerQuartile = function(d) { return d.lowerQuartile; },
        high = function(d) { return d.high; },
        low = function(d) { return d.low; },
        orient = 'vertical',
        width = d3.functor(5),
        cap = d3.functor(0.5);

    var boxPlot = function(data) {
        var path = context();

        data.forEach(function(d, i) {
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
                upperQuartileToLowerQuartile = _lowerQuartile - _upperQuartile;

            if (orient === 'vertical') {
                // Upper whisker
                path.moveTo(_value - halfCapWidth, _high);
                path.lineTo(_value + halfCapWidth, _high);
                path.moveTo(_value, _high);
                path.lineTo(_value, _upperQuartile);

                // Box
                path.rect(_value - halfWidth, _upperQuartile, _width, upperQuartileToLowerQuartile);
                path.moveTo(_value - halfWidth, _median);
                // Median line
                path.lineTo(_value + halfWidth, _median);

                // Lower whisker
                path.moveTo(_value, _lowerQuartile);
                path.lineTo(_value, _low);
                path.moveTo(_value - halfCapWidth, _low);
                path.lineTo(_value + halfCapWidth, _low);
            } else {
                // Lower whisker
                path.moveTo(_low, _value - halfCapWidth);
                path.lineTo(_low, _value + halfCapWidth);
                path.moveTo(_low, _value);
                path.lineTo(_lowerQuartile, _value);

                // Box
                path.rect(_lowerQuartile, _value - halfWidth, -upperQuartileToLowerQuartile, _width);
                path.moveTo(_median, _value - halfWidth);
                path.lineTo(_median, _value + halfWidth);

                // Upper whisker
                path.moveTo(_upperQuartile, _value);
                path.lineTo(_high, _value);
                path.moveTo(_high, _value - halfCapWidth);
                path.lineTo(_high, _value + halfCapWidth);
            }
        });

        return path.toString();
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
