import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import svgErrorBar from '../svg/errorBar';
import {rebindAll} from '../util/rebind';
import errorBase from './errorBase';

export default function(drawMethod) {

    var decorate = noop,
        base = errorBase();

    var dataJoin = dataJoinUtil()
        .selector('g.errorBar')
        .element('g')
        .attr('class', 'errorBar');

    var errorBar = function(selection) {
        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);

            g.enter()
                .append('path');

            var pathGenerator = svgErrorBar()
                    .width(base.width(filteredData));

            g.each(function(d, i) {
                var values = base.values(d, i);

                var g = d3.select(this)
                    .attr('transform', 'translate(' + values.x + ', ' + values.y + ')');

                pathGenerator
                    .x(values.x)
                    .xHigh(values.xHigh)
                    .xLow(values.xLow)
                    .yHigh(values.yHigh)
                    .yLow(values.yLow)
                    .y(values.y);

                g.select('path')
                    .attr('d', pathGenerator([d]))
                    .attr('stroke', 'black');
            });

            decorate(g, data, index);
        });
    };

    errorBar.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return errorBar;
    };

    d3.rebind(errorBar, dataJoin, 'key');
    rebindAll(errorBar, base);

    return errorBar;
}
