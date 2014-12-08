(function (d3, fc) {
    'use strict';

    fc.scale.linear = function () {
        return linearScale();
    };

    function linearScale(linear) {

        var alignPixels = true;

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        function scale(x) {
            var n = linear(x);
            var m = Math.round(n);
            return alignPixels ? (n > m ? m + 0.5 : m - 0.5) : n;
        }

        scale.copy = function () {
            return linearScale(linear.copy());
        };

        scale.domain = function (domain) {
            linear.domain(domain);
            return scale;
        };

        scale.ticks = function (n) {
            return linear.ticks(n);
        };

        scale.invert = function (pixel) {
            return linear.invert(pixel);
        };

        scale.alignPixels = function (value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice');
    }
}(d3, fc));