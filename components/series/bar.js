(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return bar.xScale.value(bar.xValue.value(d)); };
        var y = function(d) { return bar.yScale.value(bar.yValue.value(d)); };

        var bar = function(container) {
            container.each(function(data) {
                var container = d3.select(this);
                var series = fc.utilities.simpleDataJoin(container, 'bar', data, bar.xValue.value);

                var width = bar.barWidth.value(data.map(x));
                var height = function(d) { return bar.yScale.value(0) - y(d); };
                var translate = function(d) { return 'translate(' + x(d) + ',' + (y(d) + height(d) / 2) + ')'; };

                // enter
                // translate the group (child elements should be positioned relaitve to their parent group)
                // the origin for each group is positioned in the centre (horizontally and vertically) of each bar
                series.enter()
                    .attr('transform', translate)
                    .append('rect');

                // update
                series.attr('transform', translate)
                    .select('rect')
                    .attr('x', -width / 2)
                    .attr('y', function(d) { return -height(d) / 2; })
                    .attr('width', width)
                    .attr('height', height);

                bar.decorate.value(series);
            });
        };

        bar.decorate = fc.utilities.property(fc.utilities.fn.noop);
        bar.xScale = fc.utilities.property(d3.time.scale());
        bar.yScale = fc.utilities.property(d3.scale.linear());
        bar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        bar.yValue = fc.utilities.property(function(d) { return d.close; });
        bar.xValue = fc.utilities.property(function(d) { return d.date; });

        return bar;
    };
}(d3, fc));