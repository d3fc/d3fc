import _area from '../area';
import _stack from './stack';
import {rebind} from '../../util/rebind';

export default function() {

    var area = _area()
        .yValue(function(d) { return d.y0 + d.y; })
        .y0Value(function(d) { return d.y0; });

    var stack = _stack()
        .series(area);

    var stackedArea = function(selection) {
        selection.call(stack);
    };

    return rebind(stackedArea, area, {
        decorate: 'decorate',
        xScale: 'xScale',
        yScale: 'yScale',
        xValue: 'xValue',
        y0Value: 'y0Value',
        y1Value: 'y1Value',
        yValue: 'yValue'
    });
}
