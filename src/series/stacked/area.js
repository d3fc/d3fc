import _area from '../area';
import _stack from './stack';
import {rebindAll} from '../../util/rebind';

export default function() {

    var area = _area()
        .yValue(function(d) { return d.y0 + d.y; })
        .y0Value(function(d) { return d.y0; });

    var stack = _stack()
        .series(area);

    var stackedArea = function(selection) {
        selection.call(stack);
    };

    rebindAll(stackedArea, area);

    return stackedArea;
}
