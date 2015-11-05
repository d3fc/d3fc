import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import svgErrorBar from '../svg/errorBar';
import {rebindAll} from '../util/rebind';
import errorBase from './errorBase';

export default function(drawMethod) {

    var decorate = noop,
        barWidth = 5,
        orient = 'vertical',
        base = errorBase();

    var dataJoin = dataJoinUtil()
        .selector('g.errorBar')
        .element('g')
        .attr('class', 'errorBar');

    var errorBar = function(selection) {
        base.orient(errorBar.orient());
        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);

            g.enter()
                .append('path');

            var pathGenerator = svgErrorBar()
                .orient(errorBar.orient())
                .barWidth(base.width(filteredData));

            g.each(function(d, i) {
                var values = base.values(d, i);

                var g = d3.select(this)
                    .attr('transform', 'translate(' + values.x + ', ' + values.y + ')');

                pathGenerator
                    .x(values.x)
                    .errorHigh(values.errorHigh)
                    .errorLow(values.errorLow)
                    .y(values.y);

                g.select('path')
                    .attr('d', pathGenerator([d]))
                    .attr('stroke', 'black');
            });

            decorate(g, data, index);
        });
    };

    errorBar.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = x;
        return errorBar;
    };

    errorBar.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return errorBar;
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
