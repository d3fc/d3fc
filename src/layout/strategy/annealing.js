import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import minimum from '../../util/minimum';
import {allWithCollisions, totalCollisionArea} from './collision';
import containerUtils from './container';
import {getAllPlacements} from './placement';
import {random, randomIndex, cloneAndReplace} from '../../util/array';

export default function() {

    var container = containerUtils();
    var temperature = 1000;
    var cooling = 1;

    var strategy = function(data) {

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

    strategy.temperature = function(i) {
        if (!arguments.length) {
            return temperature;
        }

        temperature = i;
        return strategy;
    };

    strategy.cooling = function(i) {
        if (!arguments.length) {
            return cooling;
        }

        cooling = i;
        return strategy;
    };

    function getPotentialState(originalData, iteratedData) {
        // For one point choose a random other placement.

        var victimLabelIndex = randomIndex(originalData);
        var label = originalData[victimLabelIndex];

        var replacements = getAllPlacements(label);
        var replacement = random(replacements);

        return cloneAndReplace(iteratedData, victimLabelIndex, replacement);
    }

    d3.rebind(strategy, container, 'containerWidth');
    d3.rebind(strategy, container, 'containerHeight');

    function scorer(placement) {
        var collisionArea = totalCollisionArea(placement);
        var pointsOnScreen = 1;
        for (var i = 0; i < placement.length; i++) {
            var point = placement[i];
            pointsOnScreen += container(point) ? 0 : 100;
        }
        return collisionArea * pointsOnScreen;
    }

    return strategy;
}
