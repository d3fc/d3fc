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

                // create the outer container and line
                var enter = g.enter();
                enter.append('line')
                    .attr('x2', xScaleRange[1] - xScaleRange[0]);
                // create an empty left container
                enter.append('g')
                    .classed('left-handle', true);
                // create a right container with a text label
                enter.append('g')
                    .classed('right-handle', true)
                    .attr('transform', function(d) {
                        return 'translate(' + (xScaleRange[1] - xScaleRange[0]) + ', 0)';
                    })
                    .append('text')
                    .attr('transform', 'translate(-5, -5)');

                // Update

                // translate the parent container to the left hand edge of the annotation
                g.attr('transform', function(d) {
                    return 'translate(' + xScaleRange[0] + ', ' + y(d) + ')';
                });

                // Update the text label
                g.select('text')
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
