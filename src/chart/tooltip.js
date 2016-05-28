import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';

export default function() {

    var split = 50,
        decorate = noop;

    var items = [
        ['datum:', function(d) { return d.datum; }]
    ];

    var dataJoin = dataJoinUtil()
        .selector('g.cell')
        .element('g')
        .attr('class', 'cell tooltip');

    var tooltip = function(selection) {
        selection.each(function(data, index) {
            var container = d3.select(this);

            var legendData = items.map(function(item, i) {
                return {
                    datum: data,
                    label: d3.functor(item[0]),
                    value: d3.functor(item[1])
                };
            });

            var g = dataJoin(container, legendData);

            g.enter()
                .layout({
                    'flex': 1,
                    'flexDirection': 'row'
                });

            g.enter().append('text')
                .attr('class', 'label')
                .attr('dy', '0.71em')
                .layout('flex', split);
            g.enter().append('text')
                .attr('class', 'value')
                .attr('dy', '0.71em')
                .layout('flex', 100 - split);

            g.select('.label')
                .text(function(d, i) {
                    return d.label.call(this, d.datum, i);
                });

            g.select('.value')
                .text(function(d, i) {
                    return d.value.call(this, d.datum, i);
                });

            decorate(g, data, index);

            container.layout();
        });
    };

    tooltip.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return tooltip;
    };

    tooltip.split = function(x) {
        if (!arguments.length) {
            return split;
        }
        split = x;
        return tooltip;
    };

    tooltip.items = function(x) {
        if (!arguments.length) {
            return items;
        }
        items = x;
        return tooltip;
    };

    return tooltip;
}
