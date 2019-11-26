import { rebindAll } from '@d3fc/d3fc-rebind';
import { scan } from 'd3-array';
import { collisionArea } from './util/collision';

const scanForObject = (array, comparator) => array[scan(array, comparator)];

export default (adaptedStrategy) => {

    adaptedStrategy = adaptedStrategy || ((x) => x);

    const removeOverlaps = (layout) => {
        layout = adaptedStrategy(layout);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // find the collision area for all overlapping rectangles, hiding the one
            // with the greatest overlap
            const visible = layout.filter((d) => !d.hidden);
            const collisions = visible.map((d, i) => [d, collisionArea(visible, i)]);
            const maximumCollision = scanForObject(collisions, (a, b) => b[1] - a[1]);
            if (maximumCollision[1] > 0) {
                maximumCollision[0].hidden = true;
            } else {
                break;
            }
        }
        return layout;
    };

    rebindAll(removeOverlaps, adaptedStrategy);

    return removeOverlaps;
};
