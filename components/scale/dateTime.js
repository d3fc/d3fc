(function(d3, fc) {
    'use strict';

    fc.scale.dateTime = function() {
        return dateTimeScale();
    };


    function dateTimeScale(adaptedScale, discontinuityProvider) {

        if (!arguments.length) {
            adaptedScale = d3.time.scale();
        }

        function scale(x) {
            // the discontinuityProvider is responsible for determinine the distance between two points
            // along a scale that has discontinuities (i.e. sections that have been removed). 
            var totalDomainDistance = scale.discontinuityProvider.value.getDistance(adaptedScale.domain());
            var distanceToX = scale.discontinuityProvider.value.getDistance(adaptedScale.domain()[0], x);
            var ratioToX = distanceToX / totalDomainDistance;
            var scaledByRange = ratioToX * (adaptedScale.range()[1] - adaptedScale.range()[0]) + adaptedScale.range()[0];
            return scaledByRange;
        }

        scale.invert = function(x) {
            // TODO: this aint right!
            return adaptedScale.invert(x);
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

        scale.discontinuityProvider = fc.utilities.property(fc.scale.discontinuity.identity());

        return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice', 'ticks', 'tickFormat', 'invert');
    }

}(d3, fc));