(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        var decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            y1Value = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; },
            y0Value = d3.functor(0),
            barWidth = fc.util.fractionalBarWidth(0.75);

        var dataJoin = fc.util.dataJoin()
            .selector('g.bar')
            .element('g')
            .attrs({'class': 'bar'});

        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };

        var bar = function(selection) {
            selection.each(function(data, index) {

                var filteredData = data.filter(function(d, i) {
                    return y0Value(d, i) !== undefined &&
                        y1Value(d, i) !== undefined &&
                        xValue(d, i) !== undefined;
                });

                var g = dataJoin(this, filteredData);

                var width = barWidth(filteredData.map(xValueScaled));

                var pathGenerator = fc.svg.bar()
                    .x(0)
                    .y(0)
                    .width(width)
                    .height(0);

                var x = function(d, i) { return xValueScaled(d, i); },
                    y1 = function(d, i) { return yScale(y1Value(d, i)); },
                    y0 = function(d, i) { return yScale(y0Value(d, i)); };

                g.enter()
                    .attr('transform', function(d, i) {
                        return 'translate(' + x(d, i) + ', ' + y0(d, i) + ')';
                    })
                    .append('path')
                    .attr('d', function(d) { return pathGenerator([d]); });

                g.each(function(d, i) {
                    pathGenerator.height(y0(d, i) - y1(d, i));

                    var barGroup = d3.select(this);
                    d3.transition(barGroup)
                        .attr('transform', 'translate(' + x(d, i) + ', ' + y1(d, i) + ')')
                        .select('path')
                        .attr('d', pathGenerator([d]));
                });

                decorate(g, filteredData, index);
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
