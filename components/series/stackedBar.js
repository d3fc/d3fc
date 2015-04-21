(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackLayout = d3.layout.stack();

        var stackedBar = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var layers = stackLayout(data);

                var g = fc.utilities.simpleDataJoin(container, 'stacked-bar', layers);

                var bar = g.selectAll('rect')
                    .data(function(d) { return stackLayout.values()(d); })
                    .enter()
                    .append('rect');

                var xPositions = stackedBar.xScale.value.domain().map(stackedBar.xScale.value);
                var width = stackedBar.barWidth.value(xPositions);

                // update
                bar.attr('x', function(d) { return stackedBar.xScale.value(stackLayout.x()(d)) - width / 2; })
                    .attr('y', function(d) {
                        return stackedBar.yScale.value(stackLayout.y()(d) + stackedBar.y0.value(d));
                    })
                    .attr('width', width)
                    .attr('height', function(d) {
                        var baselineValue = stackedBar.y0.value(d);
                        var topValue = stackLayout.y()(d);

                        var bottomPixel = stackedBar.yScale.value(baselineValue);
                        var topPixel = stackedBar.yScale.value(topValue + baselineValue);

                        return bottomPixel - topPixel;
                    });

                stackedBar.decorate.value(g);
            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        // Implicitly dependant on the implementation of the stack layout's `out`.
        stackedBar.y0 = fc.utilities.property(function(d) {
            return d.y0;
        });

        return d3.rebind(stackedBar, stackLayout, 'x', 'y', 'out', 'offset', 'values', 'order');
    };
}(d3, fc));
