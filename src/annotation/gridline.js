import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xTicks = 10,
        yTicks = 10;

    var xDecorate = noop,
        yDecorate = noop;

    var xLineDataJoin = dataJoinUtil('x', 'line')
        .attr('class', 'x gridline');
    var yLineDataJoin = dataJoinUtil('y', 'line')
        .attr('class', 'y gridline');

    var gridlines = function(selection) {

        selection.each(function(data, index) {

            var xData = xScale.ticks(xTicks);
            var xLines = xLineDataJoin(this, xData);

            xLines.attr({
                'x1': xScale,
                'x2': xScale,
                'y1': yScale.range()[0],
                'y2': yScale.range()[1]
            });

            xDecorate(xLines, xData, index);

            var yData = yScale.ticks(yTicks);
            var yLines = yLineDataJoin(this, yData);

            yLines.attr({
                'x1': xScale.range()[0],
                'x2': xScale.range()[1],
                'y1': yScale,
                'y2': yScale
            });

            yDecorate(yLines, yData, index);

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
    gridlines.yDecorate = function(x) {
        if (!arguments.length) {
            return yDecorate;
        }
        yDecorate = x;
        return gridlines;
    };
    gridlines.xDecorate = function(x) {
        if (!arguments.length) {
            return xDecorate;
        }
        xDecorate = x;
        return gridlines;
    };


    return gridlines;
}
