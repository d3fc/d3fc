import { collisionArea } from './util/collision';
import intersect from './util/intersect';
import placements from './util/placements';
import layout from './util/layout';

export default () => {

    let bounds;

    const containerPenalty = (rectangle) =>
        bounds ? rectangle.width * rectangle.height - intersect(rectangle, bounds) : 0;

    const penaltyForRectangle = (rectangle, index, rectangles) =>
        collisionArea(rectangles, index) +
        containerPenalty(rectangle);

    const strategy = (data) => {
        let rectangles = layout()
            .locationScore(penaltyForRectangle)
            .rectangles(data);

        data.forEach((rectangle, index) => {
            placements(rectangle).forEach((placement, placementIndex) => {
                rectangles = rectangles(placement, index);
            });
        });
        return rectangles.rectangles();
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
