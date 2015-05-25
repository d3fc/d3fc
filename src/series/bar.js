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

                var width = barWidth(data.map(xValueScaled));

                var pathGenerator = fc.svg.bar()
                    .width(width);

                var x = function(d, i) { return xValueScaled(d, i); },
                    y0 = function(d, i) { return y0Value(d, i); },
                    barTop = function(d, i) { return yScale(y0(d, i) + y1Value(d, i)); },
                    barBottom = function(d, i) { return yScale(y0(d, i)); };

                g.enter()
                    .each(function(d, i) {
                        d3.select(this)
                            .attr('transform', 'translate(' + x(d, i) + ', ' + barBottom(d, i) + ')');
                    })
                    .append('path')
                    .each(function(d, i) {
                        pathGenerator.x(0)
                            .y(0)
                            .height(0);

                        d3.select(this)
                            .attr('d', pathGenerator([d]));
                    });

                g.each(function(d, i) {
                    pathGenerator.x(0)
                        .y(0)
                        .height(function() { return barBottom(d, i) - barTop(d, i); });

                    var barGroup = d3.select(this);

                    d3.transition(barGroup)
                        .attr('transform', 'translate(' + x(d, i) + ', ' + barTop(d, i) + ')')
                        .select('path')
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
