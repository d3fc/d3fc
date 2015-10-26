import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import line from '../series/line';
import {noop} from '../util/fn';

export default function () {

    var decorate = noop,
        xScale = d3.scale.linear(),
        yScale = d3.scale.linear(),
        xValue = function (d, i) { return d.date.getDay(); },
        subScale = d3.scale.linear(),
        subSeries = line(),
        barWidth = fractionalBarWidth(0.75);

    var dataJoin = dataJoinUtil()
        .selector('g.cycle')
        .element('g')
        .attr('class', 'cycle');

    var cycle = function (selection) {

        selection.each(function (data, index) {

            var dataByX = d3.nest()
                .key(xValue)
                .map(data);

            var xValues = Object.keys(dataByX);

            var width = barWidth(xValues.map(xScale)),
                halfWidth = width / 2;

            var g = dataJoin(this, xValues);

            g.each(function (d, i) {

                var g = d3.select(this);

                g.attr('transform', 'translate(' + xScale(d) + ', 0)');

                (subScale.rangeBands || subScale.range)([-halfWidth, halfWidth]);

                subSeries.xScale(subScale)
                    .yScale(yScale);

                d3.select(this)
                    .datum(dataByX[d])
                    .call(subSeries);

            });

            decorate(g, xValues, index);
        });
    };

    cycle.decorate = function (x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return cycle;
    };
    cycle.xScale = function (x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return cycle;
    };
    cycle.yScale = function (x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return cycle;
    };
    cycle.xValue = function (x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return cycle;
    };
    cycle.subScale = function (x) {
        if (!arguments.length) {
            return subScale;
        }
        subScale = x;
        return cycle;
    };
    cycle.subSeries = function (x) {
        if (!arguments.length) {
            return subSeries;
        }
        subSeries = x;
        return cycle;
    };
    cycle.barWidth = function (x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return cycle;
    };

    d3.rebind(cycle, dataJoin, 'key');

    return cycle;

}
