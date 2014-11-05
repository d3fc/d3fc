define ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

    sl.tools.annotation = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yLabel = '',
            yValue = 0;

        var annotation = function (selection) {

            var line = selection.append("line")
                .attr('x1', xScale.range()[0]) 
                .attr('y1', yScale(yValue))
                .attr('x2', xScale.range()[1]) 
                .attr('y2', yScale(yValue));


            /*var line = d3.svg.line();
            line.x(function (d) { return xScale(d.date); })
                .y(yScale(yValue));

            selection.each(function (data) {

                var path = d3.select(this).selectAll('.annotation')
                    .data([data]);

                path.enter()
                    .append('path');
                path.attr('d', line)
                    .classed('annotation', true);
                path.exit()
                    .remove();
            });*/
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

        return annotation;
    };
});