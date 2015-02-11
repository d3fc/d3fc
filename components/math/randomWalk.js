(function(d3, fc) {
    'use strict';

    fc.math.randomWalk = function(years, steps, mu, sigma, initial) {
        var randomNormal = d3.random.normal(),
            timeStep = years / steps,
            increments = new Array(steps);

        // Compute step increments for the discretized GBM model.
        for (var i = 0; i < steps; i += 1) {
            var r = randomNormal();
            r *= Math.sqrt(timeStep);
            r *= sigma;
            r += (mu - ((sigma * sigma) / 2)) * timeStep;
            increments[i] = Math.exp(r);
        }
        // Return the cumulative product of increments from initial value.
        increments[0] *= initial;
        for (i = 1; i < steps; i += 1) {
            increments[i] = increments[i - 1] * increments[i];
        }
        return increments;
    };
}(d3, fc));