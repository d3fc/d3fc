import { randomNormal as _randomNormal } from 'd3-random';

export default function() {
    let period = 1;
    let steps = 20;
    let mu = 0.1;
    let sigma = 0.1;
    let randomNormal = _randomNormal();

    var geometricBrownianMotion = value => {
        const timeStep = period / steps;
        const pathData = [];

        for (let i = 0; i < steps + 1; i++) {
            pathData.push(value);
            const increment = (randomNormal() * Math.sqrt(timeStep) * sigma) +
                 ((mu - sigma * sigma / 2) * timeStep);
            value = value * Math.exp(increment);
        }

        return pathData;
    };

    geometricBrownianMotion.period = (...args) => {
        if (!args.length) {
            return period;
        }
        period = args[0];
        return geometricBrownianMotion;
    };

    geometricBrownianMotion.steps = (...args) => {
        if (!args.length) {
            return steps;
        }
        steps = args[0];
        return geometricBrownianMotion;
    };

    geometricBrownianMotion.mu = (...args) => {
        if (!args.length) {
            return mu;
        }
        mu = args[0];
        return geometricBrownianMotion;
    };

    geometricBrownianMotion.sigma = (...args) => {
        if (!args.length) {
            return sigma;
        }
        sigma = args[0];
        return geometricBrownianMotion;
    };

    geometricBrownianMotion.randomNormal = (...args) => {
        if (!args.length) {
            return randomNormal;
        }
        randomNormal = args[0];
        return geometricBrownianMotion;
    };

    return geometricBrownianMotion;
}
