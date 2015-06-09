(function(d3, fc) {
    'use strict';

    fc.tools.horizontalLine = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = fc.utilities.fn.identity,
            keyValue = fc.utilities.fn.index,
            label = yValue,
            decorate = fc.utilities.fn.noop;

        var horizontalLine = function(selection) {
            selection.each(function(data) {
                var xScaleRange = xScale.range(),
                    containerTransform = function(d) {
                        return 'translate(' + xScaleRange[0] + ', ' + yScale(yValue(d)) + ')';
                    },
                    xScaleWidth = xScaleRange[1] - xScaleRange[0];

                var container = d3.select(this);

                // Create a group for each horizontalLine
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, keyValue);

                // create the outer container and line
                var enter = g.enter()
                    .attr('transform', containerTransform);
                enter.append('line')
                    .attr('x2', xScaleWidth);
                // create an empty left container
                enter.append('g')
                    .classed('left-handle', true);
                // create a right container with a text label
                enter.append('g')
                    .classed('right-handle', true)
                    .attr('transform', 'translate(' + xScaleWidth + ', 0)')
                    .append('text')
                    .attr({x: -5, y: -5});

                // Update

                // translate the parent container to the left hand edge of the annotation
                g.attr('transform', containerTransform);

                // Update the text label
                g.select('text')
                    .text(label);

                decorate(g);
            });
        };

        horizontalLine.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return horizontalLine;
        };
        horizontalLine.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return horizontalLine;
        };
        horizontalLine.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = d3.functor(x);
            return horizontalLine;
        };
        horizontalLine.keyValue = function(x) {
            if (!arguments.length) {
                return keyValue;
            }
            keyValue = d3.functor(x);
            return horizontalLine;
        };
        horizontalLine.label = function(x) {
            if (!arguments.length) {
                return label;
            }
            label = d3.functor(x);
            return horizontalLine;
        };
        horizontalLine.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return horizontalLine;
        };

        return horizontalLine;
    };

}(d3, fc));
