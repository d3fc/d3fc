(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var annotation = function(selection) {
            selection.each(function(data) {
                var xScaleRange = annotation.xScale.value.range(),
                    y = function(d) { return annotation.yScale.value(annotation.yValue.value(d)); };

                var container = d3.select(this);

                // Create a group for each annotation
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, annotation.keyFunction.value);

                // Added the required elements - each annotation consists of a line and text label
                var enter = g.enter();
                enter.append('line');
                enter.append('text');

                // Update the line
                g.select('line')
                    .attr('x1', xScaleRange[0])
                    .attr('y1', y)
                    .attr('x2', xScaleRange[1])
                    .attr('y2', y);

                // Update the text label
                var paddingValue = annotation.padding.value.apply(this, arguments);
                g.select('text')
                    .attr('x', xScaleRange[1] - paddingValue)
                    .attr('y', function(d) { return y(d) - paddingValue; })
                    .text(annotation.label.value);

                annotation.decorate.value(g);
            });
        };

        annotation.xScale = fc.utilities.property(d3.time.scale());
        annotation.yScale = fc.utilities.property(d3.scale.linear());
        annotation.yValue = fc.utilities.functorProperty(fc.utilities.fn.identity);
        annotation.keyFunction = fc.utilities.functorProperty(function(d, i) { return i; });
        annotation.label = fc.utilities.functorProperty(annotation.yValue.value);
        annotation.padding = fc.utilities.functorProperty(2);
        annotation.decorate = fc.utilities.property(fc.utilities.fn.noop);

        return annotation;
    };

}(d3, fc));