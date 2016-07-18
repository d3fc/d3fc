import { sum } from 'd3-array';
import { totalCollisionArea } from './util/collision';
import intersect from './intersect';
import minimum from './util/minimum';
import placements from './util/placements';

export default () => {

    let bounds = [0, 0];

    const scorer = (layout) => {
        const areaOfCollisions = totalCollisionArea(layout);

        let areaOutsideContainer = 0;
        if (bounds[0] !== 0 && bounds[1] !== 0) {
            const containerRect = {
                x: 0, y: 0, width: bounds[0], height: bounds[1]
            };
            areaOutsideContainer = sum(layout.map((d) => {
                const areaOutside = d.width * d.height - intersect(d, containerRect);
                // this bias is twice as strong as the overlap penalty
                return areaOutside * 2;
            }));
        }

        return areaOfCollisions + areaOutsideContainer;
    };

    const strategy = (data) => {
        let rectangles = [];

        data.forEach((rectangle) => {
            // add this rectangle - in all its possible placements
            const candidateConfigurations = placements(rectangle)
                .map((placement) => {
                    const copy = rectangles.slice();
                    copy.push(placement);
                    return copy;
                });

            // keep the one the minimises the 'score'
            rectangles = minimum(candidateConfigurations, scorer)[1];
        });

        return rectangles;
    };

    strategy.bounds = (...args) => {
        if (!args.length) {
            return bounds;
        }
        bounds = args[0];
        return strategy;
    };

    return strategy;
};
