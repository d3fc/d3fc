(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        var decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d, i) { return d.date; },
            yOpenValue = function(d, i) { return d.open; },
            yHighValue = function(d, i) { return d.high; },
            yLowValue = function(d, i) { return d.low; },
            yCloseValue = function(d, i) { return d.close; },
            barWidth = fc.util.fractionalBarWidth(0.75);

        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };

        var dataJoin = fc.util.dataJoin()
            .selector('g.ohlc')
            .element('g')
            .attrs({'class': 'ohlc'});

        var ohlc = function(selection) {
            selection.each(function(data, index) {

                var g = dataJoin(this, data);

                g.enter()
                    .append('path');

                var pathGenerator = fc.svg.ohlc()
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

        ohlc.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return ohlc;
        };
        ohlc.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return ohlc;
        };
        ohlc.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return ohlc;
        };
        ohlc.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return ohlc;
        };
        ohlc.yOpenValue = function(x) {
            if (!arguments.length) {
                return yOpenValue;
            }
            yOpenValue = x;
            return ohlc;
        };
        ohlc.yHighValue = function(x) {
            if (!arguments.length) {
                return yHighValue;
            }
            yHighValue = x;
            return ohlc;
        };
        ohlc.yLowValue = function(x) {
            if (!arguments.length) {
                return yLowValue;
            }
            yLowValue = x;
            return ohlc;
        };
        ohlc.yValue = ohlc.yCloseValue = function(x) {
            if (!arguments.length) {
                return yCloseValue;
            }
            yCloseValue = x;
            return ohlc;
        };
        ohlc.barWidth = function(x) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = d3.functor(x);
            return ohlc;
        };

        return ohlc;
    };
}(d3, fc));
