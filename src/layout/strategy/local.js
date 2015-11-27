import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import minimum from '../../util/minimum';
import {allWithCollisions, areaOfCollisions} from './collision';
import containerUtils from './container';

export default function() {

    var container = containerUtils();
    var iterations = 1;

    var originalData = [];
    var iteratedData = originalData;

    var strategy = function(data) {

        originalData = data;
        iteratedData = data;

        var lastIterationScore = Infinity;
        for (var i = 0; i < iterations; i++) {
            iteratedData = strategy.iterate();

            // Reached a local minimum?
            var thisIterationScore = areaOfCollisions(iteratedData);
            if (lastIterationScore === thisIterationScore) {
                return iteratedData;
            }
        }
        return iteratedData;
    };

    strategy.iterate = function() {
        var collidingPoints = allWithCollisions(iteratedData);
        var totalNoOfCollisions = areaOfCollisions(iteratedData);

        // Try to resolve collisions from each node which has a collision
        for (var i = 0; i < collidingPoints.length; i++) {

            var pointIndex = collidingPoints[i];
            var pointA = originalData[pointIndex];

            var placements = getAllPlacements(pointA);
            var candidateReplacements = getCandidateReplacements(iteratedData, placements, pointIndex);

            var bestPlacement = minimum(candidateReplacements, scorer, pointIndex);
            var bestScore = areaOfCollisions(bestPlacement);

            if (bestScore < totalNoOfCollisions) {
                iteratedData = bestPlacement;
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

    d3.rebind(strategy, container, 'containerWidth');
    d3.rebind(strategy, container, 'containerHeight');

    function getCandidateReplacements(allPoints, placements, indexToReplace) {
        return placements.map(function(placement) {
            var allPointsCopy = allPoints.slice();
            allPointsCopy[indexToReplace] = placement;
            return allPointsCopy;
        });
    }

    function scorer(placement, index) {
        var collisionArea = areaOfCollisions(placement, index);
        var isOnScreen = container(placement[index]);
        return collisionArea + (isOnScreen ? 0 : Infinity);
    }

    function getAllPlacements(point) {
        var x = point.x;
        var y = point.y;
        var width = point.width;
        var height = point.height;
        return [
            getPlacement(x, y, width, height), // Same location
            getPlacement(x - width, y, width, height), // Left
            getPlacement(x - width, y - height, width, height), // Up, left
            getPlacement(x, y - height, width, height), // Up
            getPlacement(x, y - height / 2, width, height), // Half up
            getPlacement(x - width / 2, y, width, height), // Half left
            getPlacement(x - width, y - height / 2, width, height), // Full left, half up
            getPlacement(x - width / 2, y - height, width, height) // Full up, half left
        ];
    }

    function getPlacement(x, y, width, height) {
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    return strategy;
}
