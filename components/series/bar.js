(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            barWidth = fc.utilities.timeIntervalWidth(d3.time.day, 0.5),
            yValue = fc.utilities.valueAccessor('close'),
            classForBar = function(d) { return ''; };

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
                    .data(data);

                // enter
                series.enter()
                    .append('rect');

                // exit
                series.exit()
                    .remove();

                // update
                series.attr('x', function(d) { return xScale(d.date) - (barWidth(xScale) / 2.0); })
                    .attr('y', function(d) { return yScale(yValue(d)); })
                    .attr('width', barWidth(xScale))
                    .attr('height', function(d) { return yScale(0) - yScale(yValue(d)); })
                    .attr('class', classForBar);
            });
        };

        bar.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return bar;
        };

        bar.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return bar;
        };

        bar.barWidth = function(value) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = d3.functor(value);
            return bar;
        };

        bar.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return bar;
        };

        bar.classForBar = function(value) {
            if (!arguments.length) {
                return classForBar;
            }
            classForBar = value;
            return bar;
        };

        return bar;
    };
}(d3, fc));
