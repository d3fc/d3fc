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
        * Used to set or get the domain for this scale. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.linear
        * @method domain
        * @param {array} domain the real world domain value as an array of 2 decimal numbers,
        * Min and Max respectively.
        * @returns the current domain if no arguments are passed.
        */
        scale.domain = function(domain) {
            linear.domain(domain);
            return scale;
        };

        /**
        * Used to get an array of tick mark locations which can be used to display labels and
        * tick marks on the associated axis.
        *
        * @memberof fc.scale.linear
        * @method ticks
        * @param {integer} n the number of ticks to try and display within the scale domain.
        * (This value is used as a guide for a best fit approach)
        * @returns an array of values denoting real world positions within the scale.
        * These can be converted to pixel locations using the `scale` function.
        */
        scale.ticks = function(n) {
            return linear.ticks(n);
        };

        /**
        * Used to scale a value from pixel space to domain space. This function is the inverse of
        * the `scale` function.
        *
        * @memberof fc.scale.linear
        * @method invert
        * @param {decimal} pixel the pixel value to be scaled.
        * @returns the converted value in real world space. In most cases this value will only be
        * accurate to the precision of the pixel width of the scale.
        */
        scale.invert = function(pixel) {
            return linear.invert(pixel);
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

        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice');
    }
}(d3, fc));