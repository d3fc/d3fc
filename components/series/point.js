(function(d3, fc) {
    'use strict';

    fc.series.point = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return point.xScale.value(point.xValue.value(d)); };
        var y = function(d) { return point.yScale.value(point.yValue.value(d)); };

        var point = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.point-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('point-series', true);

                var g = fc.utilities.simpleDataJoin(container, 'point', data, point.xValue.value);

                g.enter()
                    .append('circle');

                g.select('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', point.radius.value);

                point.decorate.value(g);
            });
        };

        point.decorate = fc.utilities.property(fc.utilities.fn.noop);
        point.xScale = fc.utilities.property(d3.time.scale());
        point.yScale = fc.utilities.property(d3.scale.linear());
        point.yValue = fc.utilities.property(function(d) { return d.close; });
        point.xValue = fc.utilities.property(function(d) { return d.date; });
        point.radius = fc.utilities.functorProperty(5);

        return point;
    };
}(d3, fc));