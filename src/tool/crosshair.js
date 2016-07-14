import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import line from '../annotation/line';
import multiSeries from '../series/multi';
import {noop} from '../util/fn';
import point from '../series/point';
import {range} from '../util/scale';
import {include, prefix, rebindAll} from 'd3fc-rebind';

export default function() {

    var x = function(d) { return d.x; },
        y = function(d) { return d.y; },
        xScale = d3.scale.identity(),
        yScale = d3.scale.identity(),
        decorate = noop;

    var dataJoin = dataJoinUtil()
        .children(true)
        .selector('g.crosshair')
        .element('g')
        .attr('class', 'crosshair');

    var pointSeries = point()
        .xValue(x)
        .yValue(y);

    var horizontalLine = line()
        .value(y)
        .label(y);

    var verticalLine = line()
        .orient('vertical')
        .value(x)
        .label(x);

    // The line annotations and point series used to render the crosshair are positioned using
    // screen coordinates. This function constructs an identity scale for these components.
    var identityXScale = d3.scale.identity();
    var identityYScale = d3.scale.identity();

    var multi = multiSeries()
        .series([horizontalLine, verticalLine, pointSeries])
        .xScale(identityXScale)
        .yScale(identityYScale)
        .mapping(function() { return [this]; });

    var crosshair = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this);

            var crosshairElement = dataJoin(container, data);

            crosshairElement.enter()
                .style('pointer-events', 'none');

            // Assign the identity scales an accurate range to allow the line annotations to cover
            // the full width/height of the chart.
            identityXScale.range(range(xScale));
            identityYScale.range(range(yScale));

            crosshairElement.call(multi);

            decorate(crosshairElement, data, index);
        });
    };

    // Don't use the xValue/yValue convention to indicate that these values are in screen
    // not domain co-ordinates and are therefore not scaled.
    crosshair.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = _x;
        return crosshair;
    };
    crosshair.y = function(_x) {
        if (!arguments.length) {
            return y;
        }
        y = _x;
        return crosshair;
    };
    crosshair.xScale = function(_x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = _x;
        return crosshair;
    };
    crosshair.yScale = function(_x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = _x;
        return crosshair;
    };
    crosshair.decorate = function(_x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = _x;
        return crosshair;
    };

    var lineIncludes = include('label');
    rebindAll(crosshair, horizontalLine, lineIncludes, prefix('y'));
    rebindAll(crosshair, verticalLine, lineIncludes, prefix('x'));

    return crosshair;
}
