import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import {noop} from '../util/fn';
import xyBase from './xyBase';

export default function() {

    var decorate = noop;

    var base = xyBase();

    var lineData = d3.svg.line()
        .defined(base.defined)
        .x(base.x)
        .y(base.y);

    var dataJoin = _dataJoin()
        .selector('path.line')
        .element('path')
        .attr('class', 'line');

    var line = function(selection) {

        selection.each(function(data, index) {

            var path = dataJoin(this, [data]);
            path.attr('d', lineData);

            decorate(path, data, index);
        });
    };

    line.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return line;
    };

    d3.rebind(line, base, 'xScale', 'x', 'yScale', 'y');
    d3.rebind(line, dataJoin, 'key');
    d3.rebind(line, lineData, 'interpolate', 'tension');

    return line;
}
