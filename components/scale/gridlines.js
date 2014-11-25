(function (d3, fc) {
    'use strict';

    fc.scale.gridlines = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xTicks = 10,
            yTicks = 10;

        var xLines = function (data, grid) {
            var xlines = grid.selectAll('.x')
                .data(data);
            xlines
                .enter().append('line')
                .attr({
                    'class': 'x',
                    'x1': function(d) { return xScale(d);},
                    'x2': function(d) { return xScale(d);},
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });
            xlines
                .attr({
                    'x1': function(d) { return xScale(d);},
                    'x2': function(d) { return xScale(d);},
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });
            xlines.exit().remove();
        };

        var yLines = function (data, grid) {
            var ylines = grid.selectAll('.y')
                .data(data);
            ylines
                .enter().append('line')
                .attr({
                    'class': 'y',
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': function(d) { return yScale(d);},
                    'y2': function(d) { return yScale(d);}
                });
            ylines
                .attr({
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': function(d) { return yScale(d);},
                    'y2': function(d) { return yScale(d);}
                });
            ylines.exit().remove();
        };

        var gridlines = function (selection) {
            var grid, xTickData, yTickData;

            selection.each(function () {
                xTickData = xScale.ticks(xTicks);
                yTickData = yScale.ticks(yTicks);

                grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
                grid.enter().append('g').classed('gridlines', true);
                xLines(xTickData, grid);
                yLines(yTickData, grid);
            });
        };

        gridlines.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return gridlines;
        };

        gridlines.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return gridlines;
        };

        gridlines.xTicks = function (value) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = value;
            return gridlines;
        };

        gridlines.yTicks = function (value) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = value;
            return gridlines;
        };

        return gridlines;
    };
}(d3, fc));
