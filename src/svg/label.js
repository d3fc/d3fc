import d3 from 'd3';
import {identity} from '../util/fn';
import expandRect from '../util/expandRect';
import _dataJoin from '../util/dataJoin';

export default function() {
    var attrArguments,
        margin = {},
        value = identity;

    var textDataJoin = _dataJoin()
        .selector('text')
        .element('text');

    var rectDataJoin = _dataJoin()
        .selector('rect')
        .element('rect');

    var label = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this);

            var rectElement = rectDataJoin(container, [data]);
            rectElement.enter()
                .layout('flex', 1);

            var textElement = textDataJoin(container, [data]);

            var expandedMargin = expandRect(margin);
            textElement.enter()
                    .layout({
                        position: 'absolute',
                        bottom: expandedMargin.top,
                        left: expandedMargin.left
                    })
                    .attr({
                        'dominant-baseline': 'middle',
                        'dy': '-0.5em'
                    });
            textElement.attr.apply(textElement, attrArguments);

            textElement.text(value);

            container.layout();
        });
    };

    label.margin = function(x) {
        if (!arguments.length) {
            return margin;
        }
        margin = x;
        return label;
    };

    label.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return label;
    };

    label.attr = function(x) {
        if (!arguments.length) {
            return attrArguments;
        }
        attrArguments = arguments;
        return label;
    };

    return label;
}
