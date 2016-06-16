import axisSvg from '../svg/axis';
import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';

// Adapts a fc.svg.axis for use as a series (i.e. accepts xScale/yScale). Only required when
// you want an axis to appear in the middle of a chart e.g. as part of a cycle plot. Otherwise
// prefer using the fc.svg.axis directly.
export default function() {

    var axis = axisSvg(),
        baseline = d3.functor(0),
        xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var dataJoin = dataJoinUtil()
        .selector('g.axis-adapter')
        .element('g')
        .attr({'class': 'axis axis-adapter'});

    var axisAdapter = function(selection) {

        selection.each(function(data, index) {

            var g = dataJoin(this, [data]);

            var translation;
            switch (axisAdapter.orient()) {
            case 'top':
            case 'bottom':
                translation = 'translate(0,' + yScale(baseline(data)) + ')';
                axis.scale(xScale);
                break;

            case 'left':
            case 'right':
                translation = 'translate(' + xScale(baseline(data)) + ',0)';
                axis.scale(yScale);
                break;

            default:
                throw new Error('Invalid orientation');
            }

            g.enter().attr('transform', translation);
            g.attr('transform', translation);

            g.call(axis);
        });
    };

    axisAdapter.baseline = function(x) {
        if (!arguments.length) {
            return baseline;
        }
        baseline = d3.functor(x);
        return axisAdapter;
    };
    axisAdapter.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return axisAdapter;
    };
    axisAdapter.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return axisAdapter;
    };

    return d3.rebind(axisAdapter, axis, 'orient', 'ticks', 'tickValues', 'tickSize',
        'innerTickSize', 'outerTickSize', 'tickPadding', 'tickFormat', 'decorate');
}
