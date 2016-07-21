import { sum } from 'd3-array';
import { collisionArea } from './util/collision';
import intersect from './util/intersect';
import placements from './util/placements';
import layout from './util/layout';

export default () => {

    let bounds;

    const containerPenalty = (rectangle) =>
        bounds ? rectangle.width * rectangle.height - intersect(rectangle, bounds) : 0;

    const penaltyForRectangle = (rectangles, index) =>
        collisionArea(rectangles, index) +
        containerPenalty(rectangles[index]);

    const strategy = (data) => {
        let rectangles = layout(data, penaltyForRectangle);
        data.forEach((rectangle, index) => {
            placements(rectangle).forEach((placement, placementIndex) => {
                rectangles = rectangles.tryLocation(placement, index);
            });
        });
        return rectangles.data();
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
