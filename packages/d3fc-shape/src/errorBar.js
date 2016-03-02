import d3 from 'd3';

// Renders an error bar series as an SVG path based on the given array of datapoints.
export default function(context) {

    var value = function(d) { return d.x; },
        high = function(d) { return d.high; },
        low = function(d) { return d.low; },
        orient = 'vertical',
        width = d3.functor(5);

    var errorBar = function(data) {
        var path = context();

        data.forEach(function(d, i) {
            // naming convention is for vertical orientation
            var _value = value(d, i),
                _width = width(d, i),
                halfWidth = _width / 2,
                _high = high(d, i),
                _low = low(d, i);

            if (orient === 'vertical') {
                path.moveTo(_value - halfWidth, _high);
                path.lineTo(_value + halfWidth, _high);
                path.moveTo(_value, _high);
                path.lineTo(_value, _low);
                path.moveTo(_value - halfWidth, _low);
                path.lineTo(_value + halfWidth, _low);
            } else {
                path.moveTo(_low, _value - halfWidth);
                path.lineTo(_low, _value + halfWidth);
                path.moveTo(_low, _value);
                path.lineTo(_high, _value);
                path.moveTo(_high, _value - halfWidth);
                path.lineTo(_high, _value + halfWidth);
            }
        });

        return path.toString();
    };

    errorBar.value = function(_x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(_x);
        return errorBar;
    };
    errorBar.high = function(_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return errorBar;
    };
    errorBar.low = function(_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return errorBar;
    };
    errorBar.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
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
