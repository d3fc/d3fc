(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return line.xScale.value(line.xValue.value(d)); };
        var y = function(d) { return line.yScale.value(line.yValue.value(d)); };

        var line = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.line-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('line-series', true)
                    .append('path');

                var lineData = d3.svg.line()
                    .x(x)
                    .y(y);
                container.select('path')
                    .attr('d', lineData);

                line.decorate.value(container);
            });
        };

        line.decorate = fc.utilities.property(fc.utilities.fn.noop);
        line.xScale = fc.utilities.property(d3.time.scale());
        line.yScale = fc.utilities.property(d3.scale.linear());
        line.yValue = fc.utilities.property(fc.utilities.valueAccessor('close'));
        line.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));

        return line;
    };
}(d3, fc));