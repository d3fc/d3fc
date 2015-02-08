(function(d3, fc) {
    'use strict';

    fc.scale.dateTime = function() {
        return dateTimeScale();
    };


    /**
    * The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
    * As an example, you can use this scale to render a chart where the weekends are skipped.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.dateTime
    */
    function dateTimeScale(adaptedScale, discontinuityProvider) {

        if (!arguments.length) {
            adaptedScale = d3.time.scale();
            discontinuityProvider = fc.scale.discontinuity.identity();
        }

        function discontinuities() { return scale.discontinuityProvider.value; }

        function scale(date) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            // The discontinuityProvider is responsible for determine the distance between two points
            // along a scale that has discontinuities (i.e. sections that have been removed).
            // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
            // over the domain of this axis, versus the discontinuous distance to 'x'
            var totalDomainDistance = discontinuities().distance(domain[0], domain[1]);
            var distanceToX = discontinuities().distance(domain[0], date);
            var ratioToX = distanceToX / totalDomainDistance;
            var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
            return scaledByRange;
        }

        scale.invert = function(x) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            var ratioToX = (x - range[0]) / (range[1] - range[0]);
            var totalDomainDistance = discontinuities().distance(domain[0], domain[1]);
            var distanceToX = ratioToX * totalDomainDistance;
            return discontinuities().offset(domain[0], distanceToX);
        };

        scale.domain = function(x) {
            if (!arguments.length) {
                return adaptedScale.domain();
            }
            // clamp the upper and lower domain values to ensure they
            // do not fall within a discontinuity
            var domainLower = discontinuities().clampUp(x[0]);
            var domainUpper = discontinuities().clampDown(x[1]);
            adaptedScale.domain([domainLower, domainUpper]);
            return scale;
        };

        scale.nice = function() {
            adaptedScale.nice();
            var domain = adaptedScale.domain();
            var domainLower = discontinuities().clampUp(domain[0]);
            var domainUpper = discontinuities().clampDown(domain[1]);
            adaptedScale.domain([domainLower, domainUpper]);
            return scale;
        };

        scale.ticks = function() {
            var ticks = adaptedScale.ticks();
            var clampedTicks = ticks.map(function(tick, index) {
                if (index < ticks.length - 1) {
                    return discontinuities().clampUp(tick);
                } else {
                    var clampedTick = discontinuities().clampUp(tick);
                    return clampedTick < scale.domain()[1] ?
                        clampedTick : discontinuities().clampDown(tick);
                }
            });
            var uniqueTicks = clampedTicks.reduce(function(arr, tick) {
                if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
                    arr.push(tick);
                }
                return arr;
            }, []);
            return uniqueTicks;
        };

        scale.copy = function() {
            return dateTimeScale(adaptedScale.copy(), discontinuities().copy());
        };

        scale.discontinuityProvider = fc.utilities.property(discontinuityProvider);

        return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
            'tickFormat');
    }

}(d3, fc));