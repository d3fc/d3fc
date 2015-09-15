import d3 from 'd3';

export default function(period, steps, mu, sigma, initial) {
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
}
