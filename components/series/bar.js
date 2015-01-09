(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

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
                    .data(data, function(d) {
                        return d.date;
                    });

                // enter
                series.enter()
                    .append('rect');

                // exit
                series.exit()
                    .remove();

                // update
                series.attr('x', function(d) { return bar.xScale.value(d.date) -
                        (bar.barWidth.value(bar.xScale.value) / 2.0); })
                    .attr('y', function(d) { return bar.yScale.value(bar.yValue.value(d)); })
                    .attr('width', bar.barWidth.value(bar.xScale.value))
                    .attr('height', function(d) { return bar.yScale.value(0) -
                        bar.yScale.value(bar.yValue.value(d)); });

                bar.decorate.value(series);
            });
        };

        bar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        bar.xScale = fc.utilities.property(d3.time.scale());

        bar.yScale = fc.utilities.property(d3.scale.linear());

        bar.barWidth = fc.utilities.property(fc.utilities.timeIntervalWidth(d3.time.day, 0.5));

        bar.yValue = fc.utilities.property(fc.utilities.valueAccessor('close'));

        return bar;
    };
}(d3, fc));
