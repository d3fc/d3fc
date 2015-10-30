import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import xyBase from './xyBase';

export default function() {

    var decorate = noop,
        symbol = d3.svg.symbol();

    var base = xyBase();

    var dataJoin = dataJoinUtil('point');

    var containerTransform = function(d, i) {
        return 'translate(' + base.x(d, i) + ', ' + base.y(d, i) + ')';
    };

    var point = function(selection) {

        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);
            g.enter()
                .attr('transform', containerTransform)
                .append('path')
                .attr('d', symbol);

            g.attr('transform', containerTransform);

            decorate(g, data, index);
        });
    };

    point.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return point;
    };

    d3.rebind(point, base, 'xScale', 'xValue', 'yScale', 'yValue');
    d3.rebind(point, dataJoin, 'key');
    d3.rebind(point, symbol, 'size', 'type');

    return point;
}
