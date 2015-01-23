(function(d3, fc) {
    'use strict';

    fc.scale.dateTime = function() {
        return dateTimeScale();
    };


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
            var totalDomainDistance = discontinuities().getDistance(domain);
            var distanceToX = discontinuities().getDistance(domain[0], date);
            var ratioToX = distanceToX / totalDomainDistance;
            var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
            return scaledByRange;
        }

        scale.invert = function(x) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            var ratioToX = (x - range[0]) / (range[1] - range[0]);
            var totalDomainDistance = discontinuities().getDistance(domain);
            var distanceToX = ratioToX * totalDomainDistance;
            return discontinuities().applyOffset(domain[0], distanceToX);
        };

        scale.domain = function(x) {
            if (!arguments.length) {
                return adaptedScale.domain();
            }
            // clamp the upper and lower domain values to ensure they
            // do not fall within a discontinuity
            var domainLower = scale.discontinuityProvider.value.clampUp(x[0]);
            var domainUpper = scale.discontinuityProvider.value.clampDown(x[1]);
            adaptedScale.domain([domainLower, domainUpper]);
            return scale;
        };

        scale.copy = function() {
            return dateTimeScale(adaptedScale.copy(), scale.discontinuityProvider.value);
        };

        scale.discontinuityProvider = fc.utilities.property(discontinuityProvider);

        return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
            'nice', 'ticks', 'tickFormat');
    }

}(d3, fc));