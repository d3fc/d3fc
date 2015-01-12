(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return bar.xScale.value(bar.xValue.value(d)); };
        var y = function(d) { return bar.yScale.value(bar.yValue.value(d)); };

        var bar = function(selection) {
            var series, container;

            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                container = d3.select(this)
                    .selectAll('.bar-series')
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed('bar-series', true);

                // create a data-join for each rect element
                series = container
                    .selectAll('rect')
                    .data(data, bar.xValue.value);

                // enter
                series.enter()
                    .append('rect');

                // exit
                series.exit()
                    .remove();

                var width = bar.barWidth.value(data.map(x));

                // update
                series.attr('x', function(d) {
                        return x(d) - width / 2.0;
                    })
                    .attr('y', function(d) { return y(d); })
                    .attr('width', width)
                    .attr('height', function(d) { return bar.yScale.value(0) - y(d); });

                bar.decorate.value(series);
            });
        };

        bar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        bar.xScale = fc.utilities.property(d3.time.scale());

        bar.yScale = fc.utilities.property(d3.scale.linear());

        bar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        bar.yValue = fc.utilities.property(fc.utilities.valueAccessor('close'));

        bar.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));

        return bar;
    };
}(d3, fc));
