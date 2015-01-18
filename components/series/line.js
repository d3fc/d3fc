(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return line.xScale.value(line.xValue.value(d)); };
        var y = function(d) { return line.yScale.value(line.yValue.value(d)); };

        var line = function(selection) {

            selection.each(function(data) {

                var g = d3.select(this)
                    .selectAll('.line-series')
                    .data([data]);

                g.enter()
                    .append('g')
                    .classed('line-series', true);

                g.exit()
                    .remove();

                var areaPath = g.selectAll('.area')
                        .data(line.underFill.value.apply(this, arguments) ? [data] : []);

                areaPath.enter()
                    .append('path')
                    .classed('area', true);

                var areaData = d3.svg.area()
                    .x(x)
                    .y0(line.yScale.value(0))
                    .y1(y);
                areaPath.attr('d', areaData);

                areaPath.exit()
                    .remove();

                var linePath = g.selectAll('.line')
                    .data([data]);

                linePath.enter()
                    .append('path')
                    .classed('line', true);

                var lineData = d3.svg.line()
                    .x(x)
                    .y(y);
                linePath.attr('d', lineData);

                linePath.exit()
                    .remove();

                line.decorate.value(g);
            });
        };

        line.decorate = fc.utilities.property(fc.utilities.fn.noop);
        line.xScale = fc.utilities.property(d3.time.scale());
        line.yScale = fc.utilities.property(d3.scale.linear());
        line.yValue = fc.utilities.property(fc.utilities.valueAccessor('close'));
        line.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));
        line.underFill = fc.utilities.functorProperty(true);

        return line;
    };
}(d3, fc));