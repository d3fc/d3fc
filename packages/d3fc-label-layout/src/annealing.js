import { sum } from 'd3-array';
import { totalCollisionArea } from './util/collision';
import intersect from './intersect';
import placements from './util/placements';

const randomItem = (array) => array[randomIndex(array)];

const randomIndex = (array) => Math.floor(Math.random() * array.length);

const cloneAndReplace = (array, index, replacement) => {
    const clone = array.slice();
    clone[index] = replacement;
    return clone;
};

export default () => {

    let temperature = 1000;
    let cooling = 1;
    let bounds = [0, 0];

    const getPotentialState = (originalData, iteratedData) => {
        // For one point choose a random other placement.
        const victimLabelIndex = randomIndex(originalData);
        const label = originalData[victimLabelIndex];

        const replacements = placements(label);
        const replacement = randomItem(replacements);

        return cloneAndReplace(iteratedData, victimLabelIndex, replacement);
    };

    const scorer = (layout) => {
        // penalise collisions
        const collisionArea = totalCollisionArea(layout);

        // penalise rectangles falling outside of the bounds
        let areaOutsideContainer = 0;
        if (bounds[0] !== 0 && bounds[1] !== 0) {
            const containerRect = {
                x: 0, y: 0, width: bounds[0], height: bounds[1]
            };
            areaOutsideContainer = sum(layout.map((d) => {
                const areaOutside = d.width * d.height - intersect(d, containerRect);
                // this bias is twice as strong as the overlap penalty
                return areaOutside * 2;
            }));
        }

        // penalise certain orientations
        const orientationBias = sum(layout.map((d) => {
            // this bias is not as strong as overlap penalty
            let area = d.width * d.height / 4;
            if (d.location === 'bottom-right') {
                area = 0;
            }
            if (d.location === 'middle-right' || d.location === 'bottom-center') {
                area = area / 2;
            }
            return area;
        }));

        return collisionArea + areaOutsideContainer + orientationBias;
    };

    const strategy = (data) => {

        const originalData = data;
        let iteratedData = data;

        let lastScore = Infinity;
        let currentTemperature = temperature;
        while (currentTemperature > 0) {

            const potentialReplacement = getPotentialState(originalData, iteratedData);

            const potentialScore = scorer(potentialReplacement);

            // Accept the state if it's a better state
            // or at random based off of the difference between scores.
            // This random % helps the algorithm break out of local minima
            const probablityOfChoosing = Math.exp((lastScore - potentialScore) / currentTemperature);
            if (potentialScore < lastScore || probablityOfChoosing > Math.random()) {
                iteratedData = potentialReplacement;
                lastScore = potentialScore;
            }

            currentTemperature -= cooling;
        }
        return iteratedData;
    };

    strategy.temperature = (...args) => {
        if (!args.length) {
            return temperature;
        }
        temperature = args[0];
        return strategy;
    };

    strategy.cooling = (...args) => {
        if (!args.length) {
            return cooling;
        }
        cooling = args[0];
        return strategy;
    };

    strategy.bounds = (...args) => {
        if (!args.length) {
            return bounds;
        }
        bounds = args[0];
        return strategy;
    };

    return strategy;
};
