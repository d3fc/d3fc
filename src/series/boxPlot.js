import d3 from 'd3';
import { boxPlot as svgBoxPlot } from 'd3fc-shape';
import dataJoinUtil from '../util/dataJoin';
import { defined, noop } from '../util/fn';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        upperQuartile = function(d, i) { return d.upperQuartile; },
        lowerQuartile = function(d, i) { return d.lowerQuartile; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        value = function(d, i) { return d.value; },
        median = function(d, i) { return d.median; },
        orient = 'vertical',
        barWidth = fractionalBarWidth(0.5),
        decorate = noop;

    var dataJoin = dataJoinUtil()
        .selector('g.box-plot')
        .element('g')
        .attr('class', 'box-plot');

    var pathGenerator = svgBoxPlot()
        .value(0);

    var boxPlot = function(selection) {
        selection.each(function(data, index) {

            var filteredData = data.filter(defined(low, high, lowerQuartile, upperQuartile, value, median));

            var g = dataJoin(this, filteredData);

            g.enter()
                .append('path');

            var scale = (orient === 'vertical') ? xScale : yScale;
            var width = barWidth(filteredData.map(function(d, i) {
                return scale(value(d, i));
            }));

            pathGenerator.orient(orient)
                .width(width);

            g.each(function(d, i) {
                var origin, _median, _upperQuartile, _lowerQuartile, _high, _low;

                if (orient === 'vertical') {
                    var y = yScale(high(d, i));
                    origin = xScale(value(d, i)) + ',' + y;
                    _high = 0;
                    _upperQuartile = yScale(upperQuartile(d, i)) - y;
                    _median = yScale(median(d, i)) - y;
                    _lowerQuartile = yScale(lowerQuartile(d, i)) - y;
                    _low = yScale(low(d, i)) - y;
                } else {
                    var x = xScale(low(d, i));
                    origin = x + ',' + yScale(value(d, i));
                    _high = xScale(high(d, i)) - x;
                    _upperQuartile = xScale(upperQuartile(d, i)) - x;
                    _median = xScale(median(d, i)) - x;
                    _lowerQuartile = xScale(lowerQuartile(d, i)) - x;
                    _low = 0;
                }

                pathGenerator.median(_median)
                    .upperQuartile(_upperQuartile)
                    .lowerQuartile(_lowerQuartile)
                    .high(_high)
                    .low(_low);

                d3.select(this)
                    .attr('transform', 'translate(' + origin + ')')
                    .select('path')
                    .attr('d', pathGenerator([d]));
            });

            decorate(g, data, index);
        });
    };

    boxPlot.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return boxPlot;
    };
    boxPlot.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return boxPlot;
    };
    boxPlot.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return boxPlot;
    };
    boxPlot.lowerQuartile = function(x) {
        if (!arguments.length) {
            return lowerQuartile;
        }
        lowerQuartile = d3.functor(x);
        return boxPlot;
    };
    boxPlot.upperQuartile = function(x) {
        if (!arguments.length) {
            return upperQuartile;
        }
        upperQuartile = d3.functor(x);
        return boxPlot;
    };
    boxPlot.low = function(x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(x);
        return boxPlot;
    };
    boxPlot.high = function(x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(x);
        return boxPlot;
    };
    boxPlot.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(x);
        return boxPlot;
    };
    boxPlot.median = function(x) {
        if (!arguments.length) {
            return median;
        }
        median = d3.functor(x);
        return boxPlot;
    };
    boxPlot.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
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
    d3.rebind(boxPlot, pathGenerator, 'cap');

    return boxPlot;
}
