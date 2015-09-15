import _bar from '../bar';
import _stack from './stack';
import {rebind} from '../../util/rebind';

export default function() {

    var bar = _bar()
        .yValue(function(d) { return d.y0 + d.y; })
        .y0Value(function(d) { return d.y0; });

    var stack = _stack()
        .series(bar);

    var stackedBar = function(selection) {
        selection.call(stack);
    };

    return rebind(stackedBar, bar, {
        decorate: 'decorate',
        xScale: 'xScale',
        yScale: 'yScale',
        xValue: 'xValue',
        y0Value: 'y0Value',
        y1Value: 'y1Value',
        yValue: 'yValue',
        barWidth: 'barWidth'
    });
}
