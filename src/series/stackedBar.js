(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackLayout = d3.layout.stack();

        var stackedBar = function(selection) {

            var bar = fc.series.bar()
                .xScale(stackedBar.xScale.value)
                .yScale(stackedBar.yScale.value)
                .xValue(stackLayout.x())
                .yValue(stackLayout.y())
                .y0Value(stackedBar.y0Value.value);

            selection.each(function(data) {

                var layers = stackLayout(data);

                var container = d3.select(this);

                // Pull data from series objects.
                var layeredData = layers.map(stackLayout.values());

                var series = container.selectAll('g.stacked-bar')
                    .data(layeredData)
                    .enter()
                    .append('g')
                    .attr('class', 'stacked-bar')
                    .call(bar);

                stackedBar.decorate.value(series);
            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        // Implicitly dependant on the implementation of the stack layout's `out`.
        stackedBar.y0Value = fc.utilities.property(function(d) {
            return d.y0;
        });

        return fc.utilities.rebind(stackedBar, stackLayout, {
            xValue: 'x',
            yValue: 'y',
            out: 'out',
            offset: 'offset',
            values: 'values',
            order: 'order'
        });
    };
}(d3, fc));
