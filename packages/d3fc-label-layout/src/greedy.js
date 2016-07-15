import d3 from 'd3';
import {totalCollisionArea} from './util/collision';
import intersect from './intersect';
import minimum from './util/minimum';
import placements from './util/placements';

export default function() {

    var bounds = [0, 0];

    const scorer = (layout) => {
        var areaOfCollisions = totalCollisionArea(layout);

        var areaOutsideContainer = 0;
        if (bounds[0] !== 0 && bounds[1] !== 0) {
            var containerRect = {
                x: 0, y: 0, width: bounds[0], height: bounds[1]
            };
            areaOutsideContainer = d3.sum(layout.map((d) => {
                var areaOutside = d.width * d.height - intersect(d, containerRect);
                // this bias is twice as strong as the overlap penalty
                return areaOutside * 2;
            }));
        }

        return areaOfCollisions + areaOutsideContainer;
    };

    const strategy = (data) => {
        var rectangles = [];

        data.forEach((rectangle) => {
            // add this rectangle - in all its possible placements
            var candidateConfigurations = placements(rectangle)
                .map((placement) => {
                    var copy = rectangles.slice();
                    copy.push(placement);
                    return copy;
                });

            // keep the one the minimises the 'score'
            rectangles = minimum(candidateConfigurations, scorer)[1];
        });

        return rectangles;
    };

    strategy.bounds = function(x) {
        if (!arguments.length) {
            return bounds;
        }
        bounds = x;
        return strategy;
    };

    return strategy;
}
