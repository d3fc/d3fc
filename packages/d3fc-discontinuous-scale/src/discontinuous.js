import {scaleIdentity} from 'd3-scale';
import {rebindAll, include} from '@d3fc/d3fc-rebind';
import identity from './discontinuity/identity';
import tickFilter from './tickFilter';

function discontinuous(adaptedScale) {

    if (!arguments.length) {
        adaptedScale = scaleIdentity();
    }

    var discontinuityProvider = identity();

    const scale = value => {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        // The discontinuityProvider is responsible for determine the distance between two points
        // along a scale that has discontinuities (i.e. sections that have been removed).
        // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
        // over the domain of this axis, versus the discontinuous distance to 'x'
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = discontinuityProvider.distance(domain[0], value);
        var ratioToX = distanceToX / totalDomainDistance;
        var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
        return scaledByRange;
    };

    scale.invert = x => {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        var ratioToX = (x - range[0]) / (range[1] - range[0]);
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = ratioToX * totalDomainDistance;
        return discontinuityProvider.offset(domain[0], distanceToX);
    };

    scale.domain = (...args) => {
        if (!args.length) {
            return adaptedScale.domain();
        }
        const newDomain = args[0];

        // clamp the upper and lower domain values to ensure they
        // do not fall within a discontinuity
        var domainLower = discontinuityProvider.clampUp(newDomain[0]);
        var domainUpper = discontinuityProvider.clampDown(newDomain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.nice = () => {
        adaptedScale.nice();
        var domain = adaptedScale.domain();
        var domainLower = discontinuityProvider.clampUp(domain[0]);
        var domainUpper = discontinuityProvider.clampDown(domain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.ticks = (...args) => {
        var ticks = adaptedScale.ticks.apply(this, args);
        return tickFilter(ticks, discontinuityProvider);
    };

    scale.copy = () =>
        discontinuous(adaptedScale.copy())
          .discontinuityProvider(discontinuityProvider.copy());

    scale.discontinuityProvider = (...args) => {
        if (!args.length) {
            return discontinuityProvider;
        }
        discontinuityProvider = args[0];
        return scale;
    };

    rebindAll(scale, adaptedScale, include('range', 'rangeRound', 'interpolate', 'clamp', 'tickFormat'));

    return scale;
}

export default discontinuous;
