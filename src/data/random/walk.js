import d3 from 'd3';

export default function() {
    var period = 1,
        steps = 20,
        mu = 0.1,
        sigma = 0.1;

    var walk = function(value) {
        var randomNormal = d3.random.normal(),
            timeStep = period / steps,
            walkData = [];

        for (var i = 0; i < steps; i++) {
            walkData.push(value);
            var increment = (randomNormal() * Math.sqrt(timeStep) * sigma) +
                 ((mu - sigma * sigma / 2) * timeStep);
            value = value * Math.exp(increment);
        }

        return walkData;
    };

    walk.period = function(x) {
        if (!arguments.length) {
            return period;
        }
        period = x;
        return walk;
    };

    walk.steps = function(x) {
        if (!arguments.length) {
            return steps;
        }
        steps = x;
        return walk;
    };

    walk.mu = function(x) {
        if (!arguments.length) {
            return mu;
        }
        mu = x;
        return walk;
    };

    walk.sigma = function(x) {
        if (!arguments.length) {
            return sigma;
        }
        sigma = x;
        return walk;
    };

    return walk;
}
