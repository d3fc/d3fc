(function (d3, fc) {
    'use strict';

    fc.tools.annotation = function () {

        var index = 0,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yLabel = '',
            yValue = 0,
            padding = 2,
            formatCallout = function(d) { return d; };

        var root = null,
            line = null,
            callout = null;

        var annotation = function (selection) {

            root = selection.append('g')
                .attr('id', 'annotation_' + index)
                .attr('class', 'annotation');

            line = root.append("line")
                .attr('class', 'marker')
                .attr('x1', xScale.range()[0]) 
                .attr('y1', yScale(yValue))
                .attr('x2', xScale.range()[1]) 
                .attr('y2', yScale(yValue));


            callout = root.append("text")
                .attr('class', 'callout')
                .attr('x', xScale.range()[1] - padding)
                .attr('y', yScale(yValue) - padding)
                .attr('style', 'text-anchor: end;')
                .text(yLabel + " : " + formatCallout(yValue));
        };

        annotation.index = function (value) {
            if (!arguments.length) {
                return index;
            }
            index = value;
            return annotation;
        };

        annotation.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return annotation;
        };

        annotation.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return annotation;
        };

        annotation.yValue = function (value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return annotation;
        };

        annotation.yLabel = function (value) {
            if (!arguments.length) {
                return yLabel;
            }
            yLabel = value;
            return annotation;
        };

        annotation.padding = function (value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return annotation;
        };

        annotation.formatCallout = function (value) {
            if (!arguments.length) {
                return formatCallout;
            }
            formatCallout = value;
            return annotation;
        };

        return annotation;
    };
}(d3, fc));