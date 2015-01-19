(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var annotation = function(selection) {
            selection.each(function(data) {
                var yValue = annotation.yValue.value,
                    x = annotation.xScale.value,
                    y = function(d) { return annotation.yScale.value(yValue(d)); };

                var container = d3.select(this);

                // Create a group for each annotation
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, yValue);

                // Added the required elements - each annotation consists of a line and text label
                var enter = g.enter();
                enter.append('line');
                enter.append('text');

                // Update the line
                g.selectAll('line')
                    .attr('x1', x.range()[0])
                    .attr('y1', function(d) { return y(d); })
                    .attr('x2', x.range()[1])
                    .attr('y2', function(d) { return y(d); });

                // Update the text label
                var paddingValue = annotation.padding.value.apply(this, arguments);
                g.selectAll('text')
                    .attr('x', x.range()[1] - paddingValue)
                    .attr('y', function(d) { return y(d) - paddingValue; })
                    .text(annotation.label.value);

                annotation.decorate.value(container);
            });
        };

        annotation.xScale = fc.utilities.property(d3.time.scale());
        annotation.yScale = fc.utilities.property(d3.scale.linear());
        annotation.yValue = fc.utilities.functorProperty(fc.utilities.fn.identity);
        annotation.label = fc.utilities.functorProperty(annotation.yValue.value);
        annotation.padding = fc.utilities.functorProperty(2);
        annotation.decorate = fc.utilities.property(fc.utilities.fn.noop);

        return annotation;
    };

}(d3, fc));