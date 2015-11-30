import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import {areaOfCollisions} from './collision';
import containerUtils from './container';
import minimum from '../../util/minimum';
import {getAllPlacements} from './placement';

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

    return strategy;
}
