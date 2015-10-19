import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import xyBase from './xyBase';

export default function() {

    var decorate = noop,
        radius = d3.functor(5);

    var base = xyBase();

    var dataJoin = dataJoinUtil()
        .selector('g.point')
        .element('g')
        .attr('class', 'point series');

    var containerTransform = function(d, i) {
        return 'translate(' + base.x(d, i) + ', ' + base.y(d, i) + ')';
    };

    var point = function(selection) {

        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);

            g.enter()
                .attr('transform', containerTransform)
                .append('circle');

            g.attr('transform', containerTransform);

            g.select('circle')
                .attr('r', radius);

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
    point.radius = function(x) {
        if (!arguments.length) {
            return radius;
        }
        radius = x;
        return point;
    };

    d3.rebind(point, base, 'xScale', 'xValue', 'yScale', 'yValue');
    d3.rebind(point, dataJoin, 'key');

    return point;
}
