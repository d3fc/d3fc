(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return line.xScale.value(line.xValue.value(d)); };
        var y = function(d) { return line.yScale.value(line.yValue.value(d)); };

        var lineData = d3.svg.line()
            .defined(function(d) {
                return !isNaN(y(d));
            })
            .x(x)
            .y(y);

        var line = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.line-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('line-series', true)
                    .append('path');

                container.select('path')
                    .attr('d', lineData);

                line.decorate.value(container);
            });
        };

        line.decorate = fc.utilities.property(fc.utilities.fn.noop);
        line.xScale = fc.utilities.property(d3.time.scale());
        line.yScale = fc.utilities.property(d3.scale.linear());
        line.yValue = fc.utilities.property(function(d) { return d.close; });
        line.xValue = fc.utilities.property(function(d) { return d.date; });

        return line;
    };
}(d3, fc));