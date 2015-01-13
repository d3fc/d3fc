(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var annotation = function(selection) {
            selection.each(function(data) {
                var x = annotation.xScale.value,
                    y = annotation.yScale.value,
                    yValue = annotation.yValue.value;

                var container = d3.select(this);

                // Create a group for each annotation
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, yValue);

                // Added the required elements - each annotation consists of a line and text label
                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'marker');
                enter.append('text')
                    .attr('class', 'label');

                // Update the line
                g.selectAll('line.marker').attr('x1', x.range()[0])
                    .attr('y1', function(d) {
                        return y(yValue(d));
                    })
                    .attr('x2', x.range()[1])
                    .attr('y2', function(d) {
                        return y(yValue(d));
                    });

                // Update the text label
                var paddingValue = annotation.padding.value.apply(this, arguments);
                g.selectAll('text.label').attr('x', x.range()[1] - paddingValue)
                    .attr('y', function(d) {
                        return y(yValue(d)) - paddingValue;
                    })
                    .attr('style', 'text-anchor: end;')
                    .text(annotation.formatLabel.value);

                annotation.decorate.value(container);
            });
        };

        annotation.xScale = fc.utilities.property(d3.time.scale());
        annotation.yScale = fc.utilities.property(d3.scale.linear());
        annotation.yValue = fc.utilities.functorProperty(fc.utilities.fn.identity);
        annotation.formatLabel = fc.utilities.functorProperty(annotation.yValue.value);
        annotation.padding = fc.utilities.functorProperty(2);
        annotation.decorate = fc.utilities.property(fc.utilities.fn.noop);

        return annotation;
    };
}(d3, fc));