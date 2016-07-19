import { sum } from 'd3-array';
import { collisionArea } from './util/collision';
import intersect from './util/intersect';
import placements from './util/placements';
import layout from './util/layout';

export default () => {

    let bounds = [0, 0];
    let containerRect = {
        x: 0, y: 0, width: bounds[0], height: bounds[1]
    };

    const containerPenalty = (rectangle) =>
        bounds[0] !== 0 && bounds[1] !== 0
            ? rectangle.width * rectangle.height - intersect(rectangle, containerRect)
            : 0;

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
        containerRect = {
            x: 0, y: 0, width: bounds[0], height: bounds[1]
        };
        return strategy;
    };

    return strategy;
};
