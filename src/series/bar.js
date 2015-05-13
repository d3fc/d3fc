(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        var decorate = fc.utilities.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            y1Value = function(d) { return d.close; },
            xValue = function(d) { return d.date; },
            y0Value = d3.functor(0),
            barWidth = fc.utilities.fractionalBarWidth(0.75);

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return xScale(xValue(d)); };
        var barTop = function(d) { return yScale(y0Value(d) + y1Value(d)); };
        var barBottom = function(d) { return yScale(y0Value(d)); };

        var bar = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);
                var series = fc.utilities.simpleDataJoin(container, 'bar', data, xValue);

                // enter
                series.enter()
                    .append('rect');

                var width = barWidth(data.map(x));

                // update
                series.select('rect')
                    .attr('x', function(d) {
                        return x(d) - width / 2;
                    })
                    .attr('y', barTop)
                    .attr('width', width)
                    .attr('height', function(d) {
                        return barBottom(d) - barTop(d);
                    });

                // properties set by decorate will transition too
                decorate(series);
            });
        };

        bar.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return bar;
        };
        bar.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return bar;
        };
        bar.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return bar;
        };
        bar.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return bar;
        };
        bar.y0Value = function(x) {
            if (!arguments.length) {
                return y0Value;
            }
            y0Value = d3.functor(x);
            return bar;
        };
        bar.yValue = bar.y1Value = function(x) {
            if (!arguments.length) {
                return y1Value;
            }
            y1Value = x;
            return bar;
        };
        bar.barWidth = function(x) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = d3.functor(x);
            return bar;
        };

        return bar;
    };
}(d3, fc));
