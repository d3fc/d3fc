import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {rebindAll, exclude} from 'd3fc-rebind';

export default function(series) {

    var barWidth = fractionalBarWidth(0.75),
        decorate = noop,
        xScale = d3.scale.linear(),
        values = function(d) { return d.values; };

    var dataJoin = dataJoinUtil()
        .selector('g.stacked')
        .element('g')
        .attr('class', 'stacked');

    var grouped = function(selection) {
        selection.each(function(data) {
            var value = series.xValue(),
                x = function(d, i) { return xScale(value(d, i)); },
                width = barWidth((data[0].values).map(x)),
                offsetScale = d3.scale.linear();

            if (series.barWidth) {
                var subBarWidth = width / (data.length - 1);
                series.barWidth(subBarWidth);
            }

            var halfWidth = width / 2;
            offsetScale.domain([0, data.length - 1])
                .range([-halfWidth, halfWidth]);

            var g = dataJoin(this, data);

            g.enter().append('g');

            g.select('g')
                .datum(values)
                .each(function(_, index) {
                    var container = d3.select(this);

                    // create a composite scale that applies the required offset
                    var compositeScale = function(_x) {
                        return xScale(_x) + offsetScale(index);
                    };
                    series.xScale(compositeScale);

                    // adapt the decorate function to give each series the correct index
                    series.decorate(function(s, d) {
                        decorate(s, d, index);
                    });

                    container.call(series);
                });
        });
    };

    grouped.groupWidth = function(_x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(_x);
        return grouped;
    };
    grouped.decorate = function(_x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = _x;
        return grouped;
    };
    grouped.xScale = function(_x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = _x;
        return grouped;
    };
    grouped.values = function(_x) {
        if (!arguments.length) {
            return values;
        }
        values = _x;
        return grouped;
    };

    rebindAll(grouped, series, exclude('decorate', 'xScale'));

    return grouped;
}
