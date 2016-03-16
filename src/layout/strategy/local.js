import d3 from 'd3';
import minimum from '../../util/minimum';
import {collisionArea, totalCollisionArea, collidingWith} from './collision';
import containerUtils from './container';
import {getAllPlacements} from './placement';
import {cloneAndReplace} from '../../util/array';

export default function() {

    var container = containerUtils();
    var iterations = 1;

    var strategy = function(data) {

        var originalData = data;
        var iteratedData = data;

        var thisIterationScore = Number.MAX_VALUE;
        var lastIterationScore = Infinity;
        var iteration = 0;

        // Keep going until there's no more iterations to do or
        // the solution is a local minimum
        while (iteration < iterations && thisIterationScore < lastIterationScore) {
            lastIterationScore = thisIterationScore;

            iteratedData = iterate(originalData, iteratedData);

            thisIterationScore = totalCollisionArea(iteratedData);
            iteration++;
        }
        return iteratedData;
    };

    strategy.iterations = function(i) {
        if (!arguments.length) {
            return iterations;
        }

        iterations = i;
        return strategy;
    };

    function iterate(originalData, iteratedData) {

        // Find rectangles with collisions or are outside of the bounds of the container
        iteratedData.map(function(d, i) {
            return [d, i];
        }).filter(function(d, i) {
            return collidingWith(iteratedData, d[1]).length || !container(d[0]);
        }).forEach(function(d) {

            // Use original data to stop wandering rectangles with each iteration
            var placements = getAllPlacements(originalData[d[1]]);

            // Create different states the algorithm could transition to
            var candidateReplacements = placements.map(function(placement) {
                return cloneAndReplace(iteratedData, d[1], placement);
            });

            // Choose the best state.
            var bestPlacement = minimum(candidateReplacements, function(placement) {
                var areaOfCollisions = collisionArea(placement, d[1]);
                var isOnScreen = container(placement[d[1]]);
                return areaOfCollisions + (isOnScreen ? 0 : container.area());
            })[1];

            iteratedData = bestPlacement;
        });
        return iteratedData;
    }

    d3.rebind(strategy, container, 'bounds');

    return strategy;
}
