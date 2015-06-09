(function(d3, fc) {
    'use strict';

    fc.tools.horizontalLineAnnotation = function() {


        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = fc.utilities.fn.identity,
            keyValue = fc.utilities.fn.index,
            label = yValue,
            decorate = fc.utilities.fn.noop;

        var horizontalLineAnnotation = function(selection) {
            selection.each(function(data) {
                var xScaleRange = xScale.range(),
                    y = function(d) { return yScale(yValue(d)); };

                var container = d3.select(this);

                // Create a group for each horizontalLineAnnotation
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

                // Update the text label - TODO: Add padding
                g.select('text')
                    .attr('x', xScaleRange[1])
                    .attr('y', function(d) { return y(d); })
                    .text(label);

                decorate(g);
            });
        };

        horizontalLineAnnotation.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return horizontalLineAnnotation;
        };
        horizontalLineAnnotation.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return horizontalLineAnnotation;
        };
        horizontalLineAnnotation.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = d3.functor(x);
            return horizontalLineAnnotation;
        };
        horizontalLineAnnotation.keyValue = function(x) {
            if (!arguments.length) {
                return keyValue;
            }
            keyValue = d3.functor(x);
            return horizontalLineAnnotation;
        };
        horizontalLineAnnotation.label = function(x) {
            if (!arguments.length) {
                return label;
            }
            label = d3.functor(x);
            return horizontalLineAnnotation;
        };
        horizontalLineAnnotation.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return horizontalLineAnnotation;
        };

        return horizontalLineAnnotation;
    };

}(d3, fc));
