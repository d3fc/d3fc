import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import {areaOfCollisions} from './collision';
import containerUtils from './container';
import minimum from '../../util/minimum';

export default function() {

    var container = containerUtils();

    var strategy = function(data) {
        var builtPoints = [];

        data.forEach(function(point) {
            var allPointPlacements = getAllPlacements(point);
            var candidateReplacements = allPointPlacements.map(function(placement) {
                return getCandidateReplacement(builtPoints, placement);
            });

            builtPoints = minimum(candidateReplacements, scorer);
        });

        return builtPoints;
    };

    d3.rebind(strategy, container, 'containerWidth');
    d3.rebind(strategy, container, 'containerHeight');

    function getCandidateReplacement(allPoints, point) {
        var allPointsCopy = allPoints.slice();
        allPointsCopy.push(point);

        return allPointsCopy;
    }

    function scorer(placement) {

        var collisionArea = areaOfCollisions(placement);
        var isOnScreen = true;
        for (var i = 0; i < placement.length && isOnScreen; i++) {
            var point = placement[i];
            isOnScreen = container(point);
        }
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
