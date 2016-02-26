import minimum from '../../util/minimum';
import {collisionArea} from './collision';

// iteratively remove the rectangle with the greatest area of collision
export default function() {

    var removeOverlaps = function(layout) {
        var filteredLayout = layout.slice();

        function scorer(d, i) {
            return -collisionArea(filteredLayout, i);
        }

        var iterate = true;
        do {
            var min = minimum(filteredLayout, scorer);
            if (min[0] < 0) {
                filteredLayout.splice(min[2], 1);
            } else {
                iterate = false;
            }
        } while (iterate);
        return filteredLayout;
    };

    return removeOverlaps;
}
