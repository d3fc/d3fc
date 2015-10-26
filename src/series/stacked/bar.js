import _bar from '../bar';
import _stack from './stack';
import {rebindAll} from '../../util/rebind';

export default function () {

    var bar = _bar()
        .yValue(function (d) { return d.y0 + d.y; })
        .y0Value(function (d) { return d.y0; });

    var stack = _stack()
        .series(bar);

    var stackedBar = function (selection) {
        selection.call(stack);
    };

    rebindAll(stackedBar, bar);

    return stackedBar;
}
