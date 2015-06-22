(function(d3, fc) {
    'use strict';

    fc.annotation.gridline = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xTicks = 10,
            yTicks = 10;

        var gridlines = function(selection) {

            selection.each(function() {

                var container = d3.select(this);

                var xLines = fc.util.simpleDataJoin(container, 'x',
                    xScale.ticks(xTicks));

                xLines.enter()
                    .append('line')
                    .attr('class', 'gridline');

                xLines.select('line')
                    .attr({
                        'x1': xScale,
                        'x2': xScale,
                        'y1': yScale.range()[0],
                        'y2': yScale.range()[1]
                    });

                var yLines = fc.util.simpleDataJoin(container, 'y',
                    yScale.ticks(yTicks));

                yLines.enter()
                    .append('line')
                    .attr('class', 'gridline');

                yLines.select('line')
                    .attr({
                        'x1': xScale.range()[0],
                        'x2': xScale.range()[1],
                        'y1': yScale,
                        'y2': yScale
                    });


            });
        };

        gridlines.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return gridlines;
        };
        gridlines.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return gridlines;
        };
        gridlines.xTicks = function(x) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = x;
            return gridlines;
        };
        gridlines.yTicks = function(x) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = x;
            return gridlines;
        };


        return gridlines;
    };
}(d3, fc));
