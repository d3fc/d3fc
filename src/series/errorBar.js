import d3 from 'd3';
import svgErrorBar from '../svg/errorBar';
import dataJoinUtil from '../util/dataJoin';
import {defined, noop} from '../util/fn';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        value = function(d, i) { return d.value; },
        orient = 'vertical',
        barWidth = fractionalBarWidth(0.5),
        decorate = noop;

    var dataJoin = dataJoinUtil()
        .selector('g.errorBar')
        .element('g')
        .attr('class', 'errorBar');

    var pathGenerator = svgErrorBar()
        .value(0);

    var errorBar = function(selection) {
        selection.each(function(data, index) {

            var filteredData = data.filter(defined(low, high, value, value));

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
                var origin, _high, _low;
                if (orient === 'vertical') {
                    var y = yScale(high(d, i));
                    origin = xScale(value(d, i)) + ',' + y;
                    _high = 0;
                    _low = yScale(low(d, i)) - y;
                } else {
                    var x = xScale(low(d, i));
                    origin = x + ',' + yScale(value(d, i));
                    _high = xScale(high(d, i)) - x;
                    _low = 0;
                }

                pathGenerator.high(_high)
                    .low(_low);

                d3.select(this)
                    .attr('transform', 'translate(' + origin + ')')
                    .select('path')
                    .attr('d', pathGenerator([d]));
            });

            decorate(g, data, index);
        });
    };

    errorBar.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return errorBar;
    };
    errorBar.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return errorBar;
    };
    errorBar.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return errorBar;
    };
    errorBar.low = function(x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(x);
        return errorBar;
    };
    errorBar.high = function(x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(x);
        return errorBar;
    };
    errorBar.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(x);
        return errorBar;
    };
    errorBar.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
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

    return errorBar;
}
