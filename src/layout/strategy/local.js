import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import minimum from '../../util/minimum';
import {allCollisionIndices, collisionArea, totalCollisionArea} from './collision';
import containerUtils from './container';
import {getAllPlacements} from './placement';

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
        var collidingPoints = allCollisionIndices(iteratedData);
        var totalNoOfCollisions = totalCollisionArea(iteratedData);

        // Try to resolve collisions from each node which has a collision
        collidingPoints.forEach(function(pointIndex) {
            var pointA = originalData[pointIndex];

            var placements = getAllPlacements(pointA);
            var candidateReplacements = getCandidateReplacements(iteratedData, placements, pointIndex);

            var bestPlacement = minimum(candidateReplacements, getScorer(pointIndex));
            var bestScore = totalCollisionArea(bestPlacement);

            if (bestScore < totalNoOfCollisions) {
                iteratedData = bestPlacement;
            }
        });
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
            var areaOfCollisions = collisionArea(placement, index);
            var isOnScreen = container(placement[index]);
            return areaOfCollisions + (isOnScreen ? 0 : Infinity);
        };
    }

    return strategy;
}
