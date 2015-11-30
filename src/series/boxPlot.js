import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import svgBoxPlot from '../svg/boxPlot';
import {rebindAll} from '../util/rebind';
import boxBase from './boxBase';

export default function() {

    var decorate = noop,
        barWidth = 5,
        orient = 'vertical',
        base = boxBase();

    var dataJoin = dataJoinUtil()
        .selector('g.boxPlot')
        .element('g')
        .attr('class', 'boxPlot');

    var boxPlot = function(selection) {
        base.orient(boxPlot.orient());
        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);

            g.enter()
                .append('path');

            var pathGenerator = svgBoxPlot()
                .orient(boxPlot.orient())
                .barWidth(base.width(filteredData));

            g.each(function(d, i) {
                var values = base.values(d, i);

                var gboxPlot = d3.select(this)
                    .attr('transform', 'translate(' + values.x + ', ' + values.y + ')');

                pathGenerator
                    .y(values.y)
                    .x(values.x)
                    .boxHigh(values.boxHigh)
                    .boxLow(values.boxLow)
                    .whiskerHigh(values.whiskerHigh)
                    .whiskerLow(values.whiskerLow);

                gboxPlot.select('path')
                    .attr('d', pathGenerator([d]))
                    .attr('stroke', 'black');
            });

            decorate(g, data, index);
        });
    };

    boxPlot.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = x;
        return boxPlot;
    };

    boxPlot.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return boxPlot;
    };

    boxPlot.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return boxPlot;
    };

    d3.rebind(boxPlot, dataJoin, 'key');
    rebindAll(boxPlot, base);

    return boxPlot;
}
