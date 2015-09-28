import _bar from './bar';
import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import {noop} from '../util/fn';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function() {

    var bar = _bar(),
        barWidth = fractionalBarWidth(0.75),
        decorate = noop,
        offsetScale = d3.scale.linear();

    var x = function(d, i) { return bar.xScale()(bar.xValue()(d, i)); };

    var groupedBar = function(selection) {
        selection.each(function(data) {

            var width = barWidth(data[0].map(x));
            var subBarWidth = width / (data.length - 1);
            bar.barWidth(subBarWidth);

            var halfWidth = width / 2;
            offsetScale.domain([0, data.length - 1])
                .range([-halfWidth, halfWidth]);

            var dataJoin = _dataJoin()
                .selector('g.stacked')
                .element('g')
                .attr('class', 'stacked');

            var g = dataJoin(this, data);

            bar.decorate(function(sel, data, index) {
                sel.select('path')
                    .attr('transform', 'translate(' + offsetScale(index) + ',0)');

                decorate(sel, data, index);
            });

            g.call(bar);
        });
    };

    groupedBar.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return groupedBar;
    };

    d3.rebind(groupedBar, bar, 'yValue', 'xValue', 'xScale', 'yScale');

    return groupedBar;
}
