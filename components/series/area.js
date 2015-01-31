(function(d3, fc) {
    'use strict';

    fc.series.area = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return area.xScale.value(area.xValue.value(d)); };
        var y0 = function(d) { return area.yScale.value(area.y0Value.value(d)); };
        var y1 = function(d) { return area.yScale.value(area.y1Value.value(d)); };

        var areaData = d3.svg.area()
            .defined(function(d) {
                return !isNaN(y0(d)) && !isNaN(y1(d));
            })
            .x(x)
            .y0(y0)
            .y1(y1);

        var area = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.area-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('area-series', true)
                    .append('path');

                container.select('path')
                    .attr('d', areaData);

                area.decorate.value(container);
            });
        };

        area.decorate = fc.utilities.property(fc.utilities.fn.noop);
        area.xScale = fc.utilities.property(d3.time.scale());
        area.yScale = fc.utilities.property(d3.scale.linear());
        area.y0Value = fc.utilities.functorProperty(0);
        area.y1Value = fc.utilities.property(function(d) { return d.close; });
        area.xValue = fc.utilities.property(function(d) { return d.date; });


        return area;
    };
}(d3, fc));