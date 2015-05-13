(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {


        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = fc.utilities.fn.identity,
            keyValue = fc.utilities.fn.index,
            label = yValue,
            padding = d3.functor(2),
            decorate = fc.utilities.fn.noop;

        var annotation = function(selection) {
            selection.each(function(data) {
                var xScaleRange = xScale.range(),
                    y = function(d) { return yScale(yValue(d)); };

                var container = d3.select(this);

                // Create a group for each annotation
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, keyValue);

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
                var paddingValue = padding.apply(this, arguments);
                g.select('text')
                    .attr('x', xScaleRange[1] - paddingValue)
                    .attr('y', function(d) { return y(d) - paddingValue; })
                    .text(label);

                decorate(g);
            });
        };

        annotation.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return annotation;
        };
        annotation.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return annotation;
        };
        annotation.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = d3.functor(x);
            return annotation;
        };
        annotation.keyValue = function(x) {
            if (!arguments.length) {
                return keyValue;
            }
            keyValue = d3.functor(x);
            return annotation;
        };
        annotation.label = function(x) {
            if (!arguments.length) {
                return label;
            }
            label = d3.functor(x);
            return annotation;
        };
        annotation.padding = function(x) {
            if (!arguments.length) {
                return padding;
            }
            padding = d3.functor(x);
            return annotation;
        };
        annotation.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return annotation;
        };

        return annotation;
    };

}(d3, fc));
