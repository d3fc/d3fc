import d3 from 'd3';
import {rebindAll} from '../../util/rebind';
import {totalCollisionArea} from './collision';
import containerUtils from './container';
import minimum from '../../util/minimum';
import {getAllPlacements} from './placement';

export default function() {

    var container = containerUtils();

    var strategy = function(data) {
        var rectangles = [];

        data.forEach(function(rectangle) {
            // add this rectangle - in all its possible placements
            var candidateConfigurations = getAllPlacements(rectangle)
                .map(function(placement) {
                    var copy = rectangles.slice();
                    copy.push(placement);
                    return copy;
                });

            // keep the one the minimises the 'score'
            rectangles = minimum(candidateConfigurations, scorer);
        });

        return rectangles;
    };

    d3.rebind(strategy, container, 'bounds');

    function scorer(placement) {
        var areaOfCollisions = totalCollisionArea(placement);
        var isOnScreen = true;
        for (var i = 0; i < placement.length && isOnScreen; i++) {
            var point = placement[i];
            isOnScreen = container(point);
        }
        return areaOfCollisions + (isOnScreen ? 0 : container.area());
    }

    return strategy;
}
