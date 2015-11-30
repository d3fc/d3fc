import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import minimum from '../../util/minimum';
import {allWithCollisions, areaOfCollisions} from './collision';
import containerUtils from './container';
import {getAllPlacements} from './placement';

export default function() {

    var container = containerUtils();
    var iterations = 1;

    var strategy = function(data) {

        var originalData = data;
        var iteratedData = data;

        var lastIterationScore = Infinity;
        for (var i = 0; i < iterations; i++) {
            iteratedData = iterate(originalData, iteratedData);

            // Reached a local minimum?
            var thisIterationScore = areaOfCollisions(iteratedData);
            if (lastIterationScore === thisIterationScore) {
                return iteratedData;
            }
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
        var collidingPoints = allWithCollisions(iteratedData);
        var totalNoOfCollisions = areaOfCollisions(iteratedData);

        // Try to resolve collisions from each node which has a collision
        for (var i = 0; i < collidingPoints.length; i++) {

            var pointIndex = collidingPoints[i];
            var pointA = originalData[pointIndex];

            var placements = getAllPlacements(pointA);
            var candidateReplacements = getCandidateReplacements(iteratedData, placements, pointIndex);

            var bestPlacement = minimum(candidateReplacements, getScorer(pointIndex));
            var bestScore = areaOfCollisions(bestPlacement);

            if (bestScore < totalNoOfCollisions) {
                iteratedData = bestPlacement;
            }
        }
        return iteratedData;
    }

    d3.rebind(strategy, container, 'containerWidth');
    d3.rebind(strategy, container, 'containerHeight');

    function getCandidateReplacements(allPoints, placements, indexToReplace) {
        return placements.map(function(placement) {
            var allPointsCopy = allPoints.slice();
            allPointsCopy[indexToReplace] = placement;
            return allPointsCopy;
        });
    }

    function getScorer(index) {
        return function(placement) {
            var collisionArea = areaOfCollisions(placement, index);
            var isOnScreen = container(placement[index]);
            return collisionArea + (isOnScreen ? 0 : Infinity);
        };
    }

    return strategy;
}
