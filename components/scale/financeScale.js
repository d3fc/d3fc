(function (d3, sl) {
    'use strict';

    var weekday = sl.utilities.weekday

    sl.scale.finance = function () {
        return financialScale();
    };

    function financialScale(linear) {

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        function scale(x) {
            if (typeof x === 'number') {
                // When scaling ticks.
                return linear(x);
            } else {
                // When scaling dates.
                return linear(weekday(x));
            }
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

        return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp", "nice");
    }
}(d3, sl));