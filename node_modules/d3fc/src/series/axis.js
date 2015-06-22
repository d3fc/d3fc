(function(d3, fc) {
    'use strict';

    // Adapts a d3.svg.axis for use as a series (i.e. accepts xScale/yScale). Only required when
    // you want an axis to appear in the middle of a chart e.g. as part of a cycle plot. Otherwise
    // prefer using the d3.svg.axis directly.
    fc.series.axis = function() {

        var axis = d3.svg.axis(),
            baseline = d3.functor(0),
            decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var axisAdapter = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.util.simpleDataJoin(container, 'axis-adapter', [data]);

                g.enter()
                    .attr('class', 'axis axis-adapter');

                switch (axisAdapter.orient()) {
                    case 'top':
                    case 'bottom':
                        g.attr('transform', 'translate(0,' + yScale(baseline(data)) + ')');
                        axis.scale(xScale);
                        break;

                    case 'left':
                    case 'right':
                        g.attr('transform', 'translate(' + xScale(baseline(data)) + ',0)');
                        axis.scale(yScale);
                        break;

                    default:
                        throw new Error('Invalid orientation');
                }

                g.call(axis);

                decorate(g);
            });
        };

        axisAdapter.baseline = function(x) {
            if (!arguments.length) {
                return baseline;
            }
            baseline = d3.functor(x);
            return axisAdapter;
        };
        axisAdapter.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
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
            'innerTickSize', 'outerTickSize', 'tickPadding', 'tickFormat');
    };
}(d3, fc));
