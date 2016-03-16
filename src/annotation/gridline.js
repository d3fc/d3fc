import d3 from 'd3';
import dataJoin from '../util/dataJoin';
import ticks from '../scale/ticks';
import {noop} from '../util/fn';
import {includeMap, prefix, rebindAll} from 'd3fc-rebind';
import {range} from '../util/scale';

export default function() {

    var xTicks = ticks(),
        yTicks = ticks();

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

    var gridlines = function(selection) {

        selection.each(function(data, index) {

            var xScale = xTicks.scale(),
                yScale = yTicks.scale();

            var xData = xTicks();
            var xLines = xLineDataJoin(this, xData);

            xLines.attr({
                'x1': xScale,
                'x2': xScale,
                'y1': range(yScale)[0],
                'y2': range(yScale)[1]
            });

            xDecorate(xLines, xData, index);

            var yData = yTicks();
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

    rebindAll(gridlines, xLineDataJoin, includeMap({'key': 'xKey'}));
    rebindAll(gridlines, yLineDataJoin, includeMap({'key': 'yKey'}));

    rebindAll(gridlines, xTicks, prefix('x'));
    rebindAll(gridlines, yTicks, prefix('y'));

    return gridlines;
}
