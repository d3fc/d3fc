(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackedBar = function(selection) {
            var container;

            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                container = d3.select(this);

                var layers = stackLayout(data);

                var g = fc.utilities.simpleDataJoin(container, 'stacked-bar', layers);

                var bar = g.selectAll('rect')
                    .data(function(d) { return stackLayout.values()(d); })
                    .enter()
                    .append('rect');

                var xValues = stackedBar.xScale().domain();
                var xPositions = xValues.map(function(d) { return stackedBar.xScale()(d); });
                var width = stackedBar.barWidth()(xPositions);

                // update
                bar.attr('x', function(d) { return stackedBar.xScale()(stackLayout.x()(d)) - width / 2; })
                    .attr('y', function(d) {
                        return stackedBar.yScale()(stackLayout.y()(d) + stackedBar.getBaseline()(d));
                    })
                    .attr('width', width)
                    .attr('height', function(d) {
                        var baselineValue = stackedBar.getBaseline()(d);
                        var topValue = stackedBar.y()(d);

                        var bottomPixel = stackedBar.yScale()(baselineValue);
                        var topPixel = stackedBar.yScale()(topValue + baselineValue);

                        return bottomPixel - topPixel;
                    });

                stackedBar.decorate()(g);
            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        // Implicitly dependant on the implementation of the stack layout's `out`.
        stackedBar.getBaseline = fc.utilities.property(function(d) {
            return d.y0;
        });

        var stackLayout = d3.layout.stack();
        return d3.rebind(stackedBar, stackLayout, 'x', 'y', 'out', 'offset', 'values', 'order');
    };
}(d3, fc));
