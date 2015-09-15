import _line from '../line';
import _stack from './stack';
import {rebind} from '../../util/rebind';

export default function() {

    var line = _line()
        .yValue(function(d) { return d.y0 + d.y; });

    var stack = _stack()
        .series(line);

    var stackedLine = function(selection) {
        selection.call(stack);
    };

    return rebind(stackedLine, line, {
        decorate: 'decorate',
        xScale: 'xScale',
        yScale: 'yScale',
        xValue: 'xValue',
        yValue: 'yValue'
    });
}
