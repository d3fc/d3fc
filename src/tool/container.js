import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import expandRect from '../util/expandRect';

export default function() {

    var padding = 0,
        component = noop,
        decorate = noop;

    var dataJoin = dataJoinUtil()
        .selector('g.container')
        .element('g')
        .attr({
            'class': 'container',
            'layout-style': 'flex: 1'
        });

    var container = function(selection) {
        selection.each(function(data, index) {
            var expandedPadding = expandRect(padding);

            var g = dataJoin(this, [data]);

            g.enter()
                .append('rect')
                .layout('flex', 1);

            g.enter()
                .append('g')
                .layout({
                    position: 'absolute',
                    top: expandedPadding.top,
                    left: expandedPadding.left,
                    bottom: expandedPadding.bottom,
                    right: expandedPadding.right
                });

            d3.select(this).layout();

            g.select('g').call(component);

            decorate(g, data, index);
        });
    };

    container.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return container;
    };

    container.padding = function(x) {
        if (!arguments.length) {
            return padding;
        }
        padding = x;
        return container;
    };

    container.component = function(x) {
        if (!arguments.length) {
            return component;
        }
        component = x;
        return container;
    };

    return container;
}
