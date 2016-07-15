import d3 from 'd3';
import dataJoinUtil from './util/dataJoin';

export default (layoutStrategy) => {

    var padding = 2;
    var value = (x) => x;

    var textJoin = dataJoinUtil()
        .selector('text')
        .element('text');

    var rectJoin = dataJoinUtil()
        .selector('rect')
        .element('rect');

    var pointJoin = dataJoinUtil()
        .selector('circle')
        .element('circle');

    var textLabel = (selection) => {
        selection.each(function(data, index) {

            var width = Number(this.getAttribute('layout-width'));
            var height = Number(this.getAttribute('layout-height'));
            var rect = rectJoin(this, [data]);
            rect.attr({
                'width': width,
                'height': height
            });

            var anchorX = Number(this.getAttribute('anchor-x'));
            var anchorY = Number(this.getAttribute('anchor-y'));
            var circle = pointJoin(this, [data]);
            circle.attr({
                'r': 2,
                'cx': anchorX,
                'cy': anchorY
            });

            var text = textJoin(this, [data]);
            text
                .enter()
                .attr({
                    'dy': '0.9em',
                    'transform': 'translate(' + padding + ', ' + padding + ')'
                });
            text.text(value);

        });
    };

    textLabel.padding = function(x) {
        if (!arguments.length) {
            return padding;
        }
        padding = x;
        return textLabel;
    };

    textLabel.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(x);
        return textLabel;
    };

    return textLabel;
};
