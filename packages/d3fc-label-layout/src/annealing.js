import { sum } from 'd3-array';
import {totalCollisionArea} from './util/collision';
import intersect from './intersect';
import placements from './util/placements';

const randomItem = (array) => array[randomIndex(array)];

const randomIndex = (array) => Math.floor(Math.random() * array.length);

const cloneAndReplace = (array, index, replacement) => {
    var clone = array.slice();
    clone[index] = replacement;
    return clone;
};

export default () => {

    var temperature = 1000;
    var cooling = 1;
    var bounds = [0, 0];

    function getPotentialState(originalData, iteratedData) {
        // For one point choose a random other placement.
        var victimLabelIndex = randomIndex(originalData);
        var label = originalData[victimLabelIndex];

        var replacements = placements(label);
        var replacement = randomItem(replacements);

        return cloneAndReplace(iteratedData, victimLabelIndex, replacement);
    }

    function scorer(layout) {
        // penalise collisions
        var collisionArea = totalCollisionArea(layout);

        // penalise rectangles falling outside of the bounds
        var areaOutsideContainer = 0;
        if (bounds[0] !== 0 && bounds[1] !== 0) {
            var containerRect = {
                x: 0, y: 0, width: bounds[0], height: bounds[1]
            };
            areaOutsideContainer = sum(layout.map((d) => {
                var areaOutside = d.width * d.height - intersect(d, containerRect);
                // this bias is twice as strong as the overlap penalty
                return areaOutside * 2;
            }));
        }

        // penalise certain orientations
        var orientationBias = sum(layout.map((d) => {
            // this bias is not as strong as overlap penalty
            var area = d.width * d.height / 4;
            if (d.location === 'bottom-right') {
                area = 0;
            }
            if (d.location === 'middle-right' || d.location === 'bottom-center') {
                area = area / 2;
            }
            return area;
        }));

        return collisionArea + areaOutsideContainer + orientationBias;
    }

    var strategy = (data) => {

        var originalData = data;
        var iteratedData = data;

        var lastScore = Infinity;
        var currentTemperature = temperature;
        while (currentTemperature > 0) {

            var potentialReplacement = getPotentialState(originalData, iteratedData);

            var potentialScore = scorer(potentialReplacement);

            // Accept the state if it's a better state
            // or at random based off of the difference between scores.
            // This random % helps the algorithm break out of local minima
            var probablityOfChoosing = Math.exp((lastScore - potentialScore) / currentTemperature);
            if (potentialScore < lastScore || probablityOfChoosing > Math.random()) {
                iteratedData = potentialReplacement;
                lastScore = potentialScore;
            }

            currentTemperature -= cooling;
        }
        return iteratedData;
    };

    strategy.temperature = function(x) {
        if (!arguments.length) {
            return temperature;
        }

        temperature = x;
        return strategy;
    };

    strategy.cooling = function(x) {
        if (!arguments.length) {
            return cooling;
        }

        cooling = x;
        return strategy;
    };

    strategy.bounds = function(x) {
        if (!arguments.length) {
            return bounds;
        }
        bounds = x;
        return strategy;
    };

    return strategy;
};
