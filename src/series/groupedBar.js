import barSeries from './bar';
import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function () {

    var bar = barSeries(),
        barWidth = fractionalBarWidth(0.75),
        decorate = noop,
        xScale = d3.scale.linear(),
        offsetScale = d3.scale.linear();

    var dataJoin = dataJoinUtil()
        .selector('g.stacked')
        .element('g')
        .attr('class', 'stacked');

    var x = function (d, i) { return xScale(bar.xValue()(d, i)); };

    var groupedBar = function (selection) {
        selection.each(function (data) {

            var width = barWidth(data[0].map(x));
            var subBarWidth = width / (data.length - 1);
            bar.barWidth(subBarWidth);

            var halfWidth = width / 2;
            offsetScale.domain([0, data.length - 1])
                .range([-halfWidth, halfWidth]);

            var g = dataJoin(this, data);

            g.each(function (series, index) {
                var container = d3.select(this);

                // create a composite scale that applies the required offset
                var compositeScale = function (x) {
                    return xScale(x) + offsetScale(index);
                };
                bar.xScale(compositeScale);

                // adapt the decorate function to give each series teh correct index
                bar.decorate(function (s, d) {
                    decorate(s, d, index);
                });

                container.call(bar);
            });
        });
    };

    groupedBar.decorate = function (x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return groupedBar;
    };
    groupedBar.xScale = function (x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return groupedBar;
    };

    d3.rebind(groupedBar, bar, 'yValue', 'xValue', 'yScale');

    return groupedBar;
}
