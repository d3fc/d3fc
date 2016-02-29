import d3 from 'd3';
import expandRect from '../util/expandRect';

export default function() {
    var attrArguments,
        margin = {};

    var measureText = function(text) {
        var svg = d3.select('body')
            .append('svg');

        var textElement = svg.append('text')
            .text(text);

        textElement.attr.apply(textElement, attrArguments);

        var bbox = textElement[0][0].getBBox();
        svg.remove();

        var expandedMargin = expandRect(margin);

        var width = bbox.width + expandedMargin.left + expandedMargin.right;
        var height = bbox.height + expandedMargin.top + expandedMargin.bottom;

        return [width, height];
    };

    measureText.margin = function(x) {
        if (!arguments.length) {
            return margin;
        }
        margin = x;
        return measureText;
    };

    measureText.attr = function(x) {
        if (!arguments.length) {
            return attrArguments;
        }
        attrArguments = arguments;
        return measureText;
    };

    return measureText;
}
