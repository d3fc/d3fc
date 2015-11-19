import d3 from 'd3';
import {rebindAll} from '../../util/rebind';

export default function() {

    var containerWidth = 1,
        containerHeight = 1;

    var strategy = function(data) {
        return data.map(function(d, i) {

            var tx = d.x, ty = d.y;
            if (tx + d.width > containerWidth) {
                tx -= d.width;
            }

            if (ty + d.height > containerHeight) {
                ty -= d.height;
            }
            return {x: tx, y: ty};
        });
    };

    strategy.containerWidth = function(value) {
        if (!arguments.length) {
            return containerWidth;
        }
        containerWidth = value;
        return strategy;
    };

    strategy.containerHeight = function(value) {
        if (!arguments.length) {
            return containerHeight;
        }
        containerHeight = value;
        return strategy;
    };

    return strategy;
}
