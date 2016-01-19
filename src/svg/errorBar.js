import d3 from 'd3';

// Renders an error bar series as an SVG path based on the given array of datapoints.
export default function() {

    var value = function(d, i) { return d.x; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        orient = 'vertical',
        width = d3.functor(5);

    var errorBar = function(data) {

        return data.map(function(d, i) {
            // naming convention is for vertical orientation
            var _value = value(d, i),
                _width = width(d, i),
                halfWidth = _width / 2,
                _high = high(d, i),
                _low = low(d, i),
                height = _high - _low;

            if (orient === 'vertical') {
                // start top center
                return 'M' + _value + ',' + _high +
                    'h' + (-halfWidth) +
                    'h' + _width +
                    'h' + (-halfWidth) +
                    'v' + (-height) +
                    'h' + (-halfWidth) +
                    'h' + _width +
                    'h' + (-halfWidth);
            } else {
                // start middle left
                return 'M' + _low + ',' + _value +
                    'v' + (-halfWidth) +
                    'v' + _width +
                    'v' + (-halfWidth) +
                    'h' + height +
                    'v' + (-halfWidth) +
                    'v' + _width +
                    'v' + (-halfWidth);
            }
        })
        .join('');
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
