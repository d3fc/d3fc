(function (d3, fc) {
    'use strict';

    var weekday = fc.utilities.weekday

    fc.scale.finance = function () {
        return financialScale();
    };

    function financialScale(linear) {

    	var alignPixels = true;

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        function scale(x) {
            var n = 0;
            if (typeof x === 'number') {
                // When scaling ticks.
                n = linear(x);
            } else {
                // When scaling dates.
                n = linear(weekday(x));
            }
        	var m = Math.round(n);
            return alignPixels ? (n > m ? m + 0.5 : m - 0.5) : n;
        };

        scale.copy = function () {
            return financialScale(linear.copy());
        };

        scale.domain = function (domain) {
            if (!arguments.length) {
                return linear.domain().map(weekday.invert);
            }
            if (typeof domain[0] === 'number') {
                linear.domain(domain);
            } else {
                linear.domain(domain.map(weekday));
            }
            return scale;
        };

        scale.ticks = function (n) {
            return arguments.length ? linear.ticks(n) : linear.ticks();
        };

        scale.tickFormat = function (count, f) {
            return function(n) {
                var date = weekday.invert(n);
                return d3.time.format('%b %e')(date);
            };
        };

        scale.invert = function (pixel) {
            return weekday.invert(linear.invert(pixel))
        };

        scale.alignPixels = function (value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp", "nice");
    }
}(d3, fc));