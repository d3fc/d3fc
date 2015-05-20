(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        var decorate = fc.utilities.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            y1Value = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; },
            y0Value = d3.functor(0),
            barWidth = fc.utilities.fractionalBarWidth(0.75);

        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };

        var bar = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);
                var g = fc.utilities.simpleDataJoin(container, 'bar', data, xValue);

                // enter
                g.enter()
                    .append('path');

                var width = barWidth(data.map(xValueScaled)),
                    halfWidth = width / 2;

                var pathGenerator = fc.svg.bar()
                    .width(width);

                g.each(function(d, i) {

                    var x = xValueScaled(d, i),
                        y0 = y0Value(d, i),
                        barBottom = yScale(y0),
                        barTop = yScale(y0 + y1Value(d, i));

                    var g = d3.select(this)
                        .attr('transform', 'translate(' + (x - halfWidth) + ', ' + barTop + ')');

                    pathGenerator.x(d3.functor(0))
                        .y(d3.functor(0))
                        .height(function() { return barBottom - barTop; });

                    g.select('path')
                        .attr('d', pathGenerator([d]));
                });

                decorate(g);
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
