import barSeries from './bar';
import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function() {

    var bar = barSeries(),
        barWidth = fractionalBarWidth(0.75),
        decorate = noop,
        xScale = d3.scale.linear(),
        offsetScale = d3.scale.linear(),
        values = function(d) { return d.values; };

    var dataJoin = dataJoinUtil()
        .selector('g.stacked')
        .element('g')
        .attr('class', 'stacked');

    var x = function(d, i) { return xScale(bar.xValue()(d, i)); };

    var groupedBar = function(selection) {
        selection.each(function(data) {

            var width = barWidth(values(data[0]).map(x));
            var subBarWidth = width / (data.length - 1);
            bar.barWidth(subBarWidth);

            var halfWidth = width / 2;
            offsetScale.domain([0, data.length - 1])
                .range([-halfWidth, halfWidth]);

            var g = dataJoin(this, data);

            g.enter().append('g');

            g.select('g')
                .datum(values)
                .each(function(series, index) {
                    var container = d3.select(this);

                    // create a composite scale that applies the required offset
                    var compositeScale = function(_x) {
                        return xScale(_x) + offsetScale(index);
                    };
                    bar.xScale(compositeScale);

                    // adapt the decorate function to give each series the correct index
                    bar.decorate(function(s, d) {
                        decorate(s, d, index);
                    });

                    container.call(bar);
                });
        });
    };

    groupedBar.groupWidth = function(_x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(_x);
        return groupedBar;
    };
    groupedBar.decorate = function(_x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = _x;
        return groupedBar;
    };
    groupedBar.xScale = function(_x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = _x;
        return groupedBar;
    };
    groupedBar.values = function(_x) {
        if (!arguments.length) {
            return values;
        }
        values = _x;
        return groupedBar;
    };

    d3.rebind(groupedBar, bar, 'yValue', 'xValue', 'yScale');

    return groupedBar;
}
