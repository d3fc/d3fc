import { select } from 'd3-selection';
import { dataJoin as dataJoinUtil } from 'd3fc-data-join';

export default (layoutStrategy) => {

    var padding = 2;
    var value = (x) => x;

    var textJoin = dataJoinUtil('text');

    var rectJoin = dataJoinUtil('rect');

    var pointJoin = dataJoinUtil('circle');

    var textLabel = (selection) => {
        selection.each(function(data, index) {

            var width = Number(this.getAttribute('layout-width'));
            var height = Number(this.getAttribute('layout-height'));
            var rect = rectJoin(select(this), [data]);
            rect.attr('width', width)
                .attr('height', height);

            var anchorX = Number(this.getAttribute('anchor-x'));
            var anchorY = Number(this.getAttribute('anchor-y'));
            var circle = pointJoin(select(this), [data]);
            circle.attr('r', 2)
                .attr('cx', anchorX)
                .attr('cy', anchorY);

            var text = textJoin(select(this), [data]);
            text.enter()
                .attr('dy', '0.9em')
                .attr('transform', `translate(${padding}, ${padding})`);
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
        value = typeof x === 'function' ? x : () => x;
        return textLabel;
    };

    return textLabel;
};
