import d3 from 'd3';
import dataJoin from '../util/dataJoin';
import {noop} from '../util/fn';
import {rebind} from '../util/rebind';
import {range} from '../util/scale';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xTickArguments = [10],
        yTickArguments = [10];

    var xDecorate = noop,
        yDecorate = noop;

    var xLineDataJoin = dataJoin()
        .selector('line.x')
        .element('line')
        .attr('class', 'x gridline');

    var yLineDataJoin = dataJoin()
        .selector('line.y')
        .element('line')
        .attr('class', 'y gridline');

    // applies the tick arguments for linear scales, or uses domain for ordinal scales
    function getTicks(scale, tickArguments) {
        return scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
    }

    var gridlines = function(selection) {

        selection.each(function(data, index) {

            var xData = getTicks(xScale, xTickArguments);
            var xLines = xLineDataJoin(this, xData);

            xLines.attr({
                'x1': xScale,
                'x2': xScale,
                'y1': range(yScale)[0],
                'y2': range(yScale)[1]
            });

            xDecorate(xLines, xData, index);

            var yData = getTicks(yScale, yTickArguments);
            var yLines = yLineDataJoin(this, yData);

            yLines.attr({
                'x1': range(xScale)[0],
                'x2': range(xScale)[1],
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
            return xTickArguments;
        }
        xTickArguments = arguments;
        return gridlines;
    };
    gridlines.yTicks = function(x) {
        if (!arguments.length) {
            return yTickArguments;
        }
        yTickArguments = arguments;
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

    rebind(gridlines, xLineDataJoin, {'xKey': 'key'});
    rebind(gridlines, yLineDataJoin, {'yKey': 'key'});

    return gridlines;
}
