import minimum from './util/minimum';
import { rebindAll } from 'd3fc-rebind';
import { collisionArea } from './util/collision';

// iteratively remove the rectangle with the greatest area of collision
export default (adaptedStrategy) => {

    adaptedStrategy = adaptedStrategy || ((x) => x);

    const removeOverlaps = (layout) => {

        layout = adaptedStrategy(layout);

        // returns a function that computes the area of overlap for rectangles
        // in the given layout array
        const scorerForLayout = (layout) => (_, i) => -collisionArea(layout, i);

        let iterate = true;
        do {
            // apply the overlap calculation to visible rectangles
            let filteredLayout = layout.filter((d) => !d.hidden);
            let min = minimum(filteredLayout, scorerForLayout(filteredLayout));
            if (min[0] < 0) {
                // hide the rectangle with the greatest collision area
                min[1].hidden = true;
            } else {
                iterate = false;
            }
        } while (iterate);

        return layout;
    };

    rebindAll(removeOverlaps, adaptedStrategy);

    return removeOverlaps;
};
