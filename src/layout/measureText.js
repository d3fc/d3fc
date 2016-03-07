import d3 from 'd3';

export default function() {
    var attrArguments;

    var measureText = function(text) {
        var svg = d3.select('body')
            .append('svg');

        var textElement = svg.append('text')
            .text(text);

        textElement.attr.apply(textElement, attrArguments);

        var bbox = textElement[0][0].getBBox();
        svg.remove();

        return [bbox.width, bbox.height];
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
