(function(d3, fc) {
    'use strict';

    /**
    * This component provides a scale primarily used on the Y axis of charts and extends the d3.scale.linear
    * scale. This scale contains an option to pixel align when calculating the screen pixel from the real value.
    * This generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.linear
    */
    fc.scale.linear = function() {
        return linearScale();
    };

    function linearScale(linear) {

        var alignPixels = true;

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        /**
        * Used to scale a value from domain space to pixel space. This function is used primarily
        * to position elements on the scales axis.
        *
        * @memberof fc.scale.linear
        * @method scale
        * @param {decimal} x the real world domain value to be scaled.
        * @returns the converted pixel aligned value in pixel space.
        */
        function scale(x) {
            var n = linear(x);
            return alignPixels ? Math.round(n) : n;
        }

        /**
        * Used to create a copy of the current scale. When scales are added to D3 axes the scales
        * are copied rather than a reference being stored.
        * This function facilities a deep copy.
        *
        * @memberof fc.scale.linear
        * @method copy
        * @returns the copy.
        */
        scale.copy = function() {
            return linearScale(linear.copy());
        };

        /**
        * Used to get or set the option to align ticks to pixel columns/rows.
        * Pixel aligning yields crisper chart graphics.
        *
        * @memberof fc.scale.linear
        * @method alignPixels
        * @param {boolean} value if set to `true` values will be pixel aligned.
        * If no value argument is passed the current setting will be returned.
        */
        scale.alignPixels = function(value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        return d3.rebind(scale, linear, 'domain', 'ticks', 'tickFormat', 'range', 'rangeRound', 'interpolate', 'clamp',
            'invert', 'nice');
    }
}(d3, fc));