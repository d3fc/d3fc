(function(d3, fc) {
    'use strict';

    fc.series.point = function() {

        var decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; },
            radius = d3.functor(5);

        var point = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.util.simpleDataJoin(container, 'point', data, xValue);

                g.enter()
                    .append('circle');

                g.attr('transform', function(d, i) {
                    var x = xScale(xValue(d, i)),
                        y = yScale(yValue(d, i));
                    return 'translate(' + x + ', ' + y + ')';
                });

                g.select('circle')
                    .attr('r', radius);

                decorate(g);
            });
        };

        point.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return point;
        };
        point.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return point;
        };
        point.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return point;
        };
        point.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return point;
        };
        point.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return point;
        };

        point.radius = function(x) {
            if (!arguments.length) {
                return radius;
            }
            radius = x;
            return point;
        };

        return point;
    };
}(d3, fc));
