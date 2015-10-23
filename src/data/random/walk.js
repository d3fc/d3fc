import d3 from 'd3';

export default function() {
    var period = 1,
        steps = 20,
        mu = 0.1,
        sigma = 0.1;

    var walk = function(initial) {
        var randomNormal = d3.random.normal(),
            timeStep = period / steps,
            increments = new Array(steps + 1),
            increment,
            step;

        // Compute step increments for the discretized GBM model.
        for (step = 1; step < increments.length; step += 1) {
            increment = randomNormal();
            increment *= Math.sqrt(timeStep);
            increment *= sigma;
            increment += (mu - ((sigma * sigma) / 2)) * timeStep;
            increments[step] = Math.exp(increment);
        }
        // Return the cumulative product of increments from initial value.
        increments[0] = initial;
        for (step = 1; step < increments.length; step += 1) {
            increments[step] = increments[step - 1] * increments[step];
        }
        return increments;
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
