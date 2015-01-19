(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return bar.xScale.value(bar.xValue.value(d)); };
        var y = function(d) { return bar.yScale.value(bar.yValue.value(d)); };

        var bar = function(selection) {
            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                var container = d3.select(this)
                    .selectAll('.bar-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('bar-series', true);

                var series = fc.utilities.simpleDataJoin(container, 'bar', data, bar.xValue.value);

                // "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
                // a string (such as with attr).
                // Very small values, when stringified, may be converted to scientific notation and
                // cause a temporarily invalid attribute or style property value.
                // For example, the number 0.0000001 is converted to the string "1e-7".
                // This is particularly noticeable when interpolating opacity values.
                // To avoid scientific notation, start or end the transition at 1e-6,
                // which is the smallest value that is not stringified in exponential notation."
                // - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
                var effectivelyZero = 1e-6;

                // enter
                // entering elements fade in (from transparent to opaque)
                series.enter().append('rect')
                    .style('opacity', effectivelyZero);

                // exit
                // exiting elements fade out (to transparent)
                series.exit().select('rect')
                    .style('opacity', effectivelyZero);

                var width = bar.barWidth.value(data.map(x));

                // update
                // all properties of the bars will transition
                series.select('rect')
                    .attr('x', function(d) {
                        return x(d) - width / 2;
                    })
                    .attr('y', function(d) { return y(d); })
                    .attr('width', width)
                    .attr('height', function(d) { return bar.yScale.value(0) - y(d); })
                    .style('opacity', 1);

                // properties set by decorate will transition too
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
