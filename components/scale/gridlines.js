(function(d3, fc) {
    'use strict';

    /**
    * This component provides gridlines, both horizontal and vertical linked to the respective chart scales/axes.
    * If the pixel alignment options are selected on the scales, this generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.gridlines
    */
    fc.scale.gridlines = function() {

        var xScale = fc.scale.dateTime(),
            yScale = fc.scale.linear(),
            xTicks = 10,
            yTicks = 10;

        var xLines = function(data, grid) {
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

        var yLines = function(data, grid) {
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

        /**
        * Constructs a new instance of the gridlines component.
        *
        * @memberof fc.scale.gridlines
        * @param {selection} selection contains the D3 selection to receive the new DOM elements.
        */
        var gridlines = function(selection) {
            var grid, xTickData, yTickData;

            selection.each(function() {
                xTickData = xScale.ticks(xTicks);
                yTickData = yScale.ticks(yTicks);

                grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
                grid.enter().append('g').classed('gridlines', true);
                xLines(xTickData, grid);
                yLines(yTickData, grid);
            });
        };

        /**
        * Specifies the X scale which the gridlines component uses to locate its SVG elements.
        * If not specified, returns the current X scale, which defaults to an unmodified fc.scale.dateTime
        *
        * @memberof fc.scale.gridlines
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        gridlines.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return gridlines;
        };

        /**
        * Specifies the Y scale which the gridlines component uses to locate its SVG elements.
        * If not specified, returns the current Y scale, which defaults to an unmodified fc.scale.linear.
        *
        * @memberof fc.scale.gridlines
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        gridlines.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return gridlines;
        };

        /**
        * Specifies the number of X ticks / vertical lines used on the X scale.
        * If not specified, returns the current X ticks, which defaults to 10.
        *
        * @memberof fc.scale.gridlines
        * @method xTicks
        * @param {integer} value a D3 scale
        */
        gridlines.xTicks = function(value) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = value;
            return gridlines;
        };

        /**
        * Specifies the number of Y ticks / horizontal lines used on the Y scale.
        * If not specified, returns the current Y ticks, which defaults to 10.
        *
        * @memberof fc.scale.gridlines
        * @method yTicks
        * @param {integer} value a D3 scale
        */
        gridlines.yTicks = function(value) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = value;
            return gridlines;
        };

        return gridlines;
    };
}(d3, fc));
