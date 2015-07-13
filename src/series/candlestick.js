(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        var decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d, i) { return d.date; },
            yOpenValue = function(d, i) { return d.open; },
            yHighValue = function(d, i) { return d.high; },
            yLowValue = function(d, i) { return d.low; },
            yCloseValue = function(d, i) { return d.close; },
            barWidth = fc.util.fractionalBarWidth(0.75);

        var dataJoin = fc.util.dataJoin()
            .selector('g.candlestick')
            .element('g')
            .attrs({'class': 'candlestick'});

        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };

        var candlestick = function(selection) {

            selection.each(function(data, index) {

                var g = dataJoin.key(xValue)(this, data);

                g.enter()
                    .append('path');

                var pathGenerator = fc.svg.candlestick()
                        .width(barWidth(data.map(xValueScaled)));

                g.each(function(d, i) {

                    var yCloseRaw = yCloseValue(d, i),
                        yOpenRaw = yOpenValue(d, i),
                        x = xValueScaled(d, i),
                        yOpen = yScale(yOpenRaw),
                        yHigh = yScale(yHighValue(d, i)),
                        yLow = yScale(yLowValue(d, i)),
                        yClose = yScale(yCloseRaw);

                    var g = d3.select(this)
                        .classed({
                            'up': yCloseRaw > yOpenRaw,
                            'down': yCloseRaw < yOpenRaw
                        })
                        .attr('transform', 'translate(' + x + ', ' + yHigh + ')');

                    pathGenerator.x(d3.functor(0))
                        .open(function() { return yOpen - yHigh; })
                        .high(function() { return yHigh - yHigh; })
                        .low(function() { return yLow - yHigh; })
                        .close(function() { return yClose - yHigh; });

                    g.select('path')
                        .attr('d', pathGenerator([d]));
                });

                decorate(g, data, index);
            });
        };

        candlestick.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return candlestick;
        };
        candlestick.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return candlestick;
        };
        candlestick.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return candlestick;
        };
        candlestick.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return candlestick;
        };
        candlestick.yOpenValue = function(x) {
            if (!arguments.length) {
                return yOpenValue;
            }
            yOpenValue = x;
            return candlestick;
        };
        candlestick.yHighValue = function(x) {
            if (!arguments.length) {
                return yHighValue;
            }
            yHighValue = x;
            return candlestick;
        };
        candlestick.yLowValue = function(x) {
            if (!arguments.length) {
                return yLowValue;
            }
            yLowValue = x;
            return candlestick;
        };
        candlestick.yValue = candlestick.yCloseValue = function(x) {
            if (!arguments.length) {
                return yCloseValue;
            }
            yCloseValue = x;
            return candlestick;
        };
        candlestick.barWidth = function(x) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = d3.functor(x);
            return candlestick;
        };

        return candlestick;

    };
}(d3, fc));
