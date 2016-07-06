import {scaleTime} from 'd3-scale';
import {rebind} from 'd3fc-rebind';
import identity from './discontinuity/identity';

// obtains the ticks from the given scale, transforming the result to ensure
// it does not include any discontinuities
export function tickTransformer(ticks, discontinuityProvider, domain) {
    var clampedTicks = ticks.map(function(tick, index) {
        if (index < ticks.length - 1) {
            return discontinuityProvider.clampUp(tick);
        } else {
            var clampedTick = discontinuityProvider.clampUp(tick);
            return clampedTick < domain[1] ? clampedTick : discontinuityProvider.clampDown(tick);
        }
    });
    var uniqueTicks = clampedTicks.reduce(function(arr, tick) {
        if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
            arr.push(tick);
        }
        return arr;
    }, []);
    return uniqueTicks;
}

function dateTimeScale(adaptedScale, discontinuityProvider) {

    if (!arguments.length) {
        adaptedScale = scaleTime();
        discontinuityProvider = identity();
    }

    function scale(date) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        // The discontinuityProvider is responsible for determine the distance between two points
        // along a scale that has discontinuities (i.e. sections that have been removed).
        // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
        // over the domain of this axis, versus the discontinuous distance to 'x'
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = discontinuityProvider.distance(domain[0], date);
        var ratioToX = distanceToX / totalDomainDistance;
        var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
        return scaledByRange;
    }

    scale.invert = function(x) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        var ratioToX = (x - range[0]) / (range[1] - range[0]);
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = ratioToX * totalDomainDistance;
        return discontinuityProvider.offset(domain[0], distanceToX);
    };

    scale.domain = function(x) {
        if (!arguments.length) {
            return adaptedScale.domain();
        }
        // clamp the upper and lower domain values to ensure they
        // do not fall within a discontinuity
        var domainLower = discontinuityProvider.clampUp(x[0]);
        var domainUpper = discontinuityProvider.clampDown(x[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.nice = function() {
        adaptedScale.nice();
        var domain = adaptedScale.domain();
        var domainLower = discontinuityProvider.clampUp(domain[0]);
        var domainUpper = discontinuityProvider.clampDown(domain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.ticks = function() {
        var ticks = adaptedScale.ticks.apply(this, arguments);
        return tickTransformer(ticks, discontinuityProvider, scale.domain());
    };

    scale.copy = function() {
        return dateTimeScale(adaptedScale.copy(), discontinuityProvider.copy());
    };

    scale.discontinuityProvider = function(x) {
        if (!arguments.length) {
            return discontinuityProvider;
        }
        discontinuityProvider = x;
        return scale;
    };

    rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp', 'tickFormat');

    return scale;
}

function exportedScale() {
    return dateTimeScale();
}
exportedScale.tickTransformer = tickTransformer;

export default exportedScale;
