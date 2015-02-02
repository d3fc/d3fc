(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return ohlc.xScale.value(ohlc.xValue.value(d)); };
        var yOpen = function(d) { return ohlc.yScale.value(ohlc.yOpenValue.value(d)); };
        var yHigh = function(d) { return ohlc.yScale.value(ohlc.yHighValue.value(d)); };
        var yLow = function(d) { return ohlc.yScale.value(ohlc.yLowValue.value(d)); };
        var yClose = function(d) { return ohlc.yScale.value(ohlc.yCloseValue.value(d)); };

        var ohlc = function(selection) {
            selection.each(function(data) {
                // data-join in order to create the series container element
                var series = d3.select(this)
                    .selectAll('.ohlc-series')
                    .data([data]);

                series.enter()
                    .append('g')
                    .classed('ohlc-series', true);

                var g = fc.utilities.simpleDataJoin(series, 'ohlc', data, ohlc.xValue.value);

                g.enter()
                    .append('path');

                g.classed({
                        'up': function(d) {
                            return ohlc.yCloseValue.value(d) > ohlc.yOpenValue.value(d);
                        },
                        'down': function(d) {
                            return ohlc.yCloseValue.value(d) < ohlc.yOpenValue.value(d);
                        }
                    });

                var width = ohlc.barWidth.value(data.map(x));
                var halfWidth = width / 2;

                g.select('path')
                    .attr('d', function(d) {
                        var moveToLow = 'M' + x(d) + ',' + yLow(d),
                            verticalToHigh = 'V' + yHigh(d),
                            openTick = 'M' + x(d) + ',' + yOpen(d) + 'h' + (-halfWidth),
                            closeTick = 'M' + x(d) + ',' + yClose(d) + 'h' + halfWidth;
                        return moveToLow + verticalToHigh + openTick + closeTick;
                    });

                ohlc.decorate.value(g);
            });
        };

        ohlc.decorate = fc.utilities.property(fc.utilities.fn.noop);
        ohlc.xScale = fc.utilities.property(d3.time.scale());
        ohlc.yScale = fc.utilities.property(d3.scale.linear());
        ohlc.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        ohlc.yOpenValue = fc.utilities.property(function(d) { return d.open; });
        ohlc.yHighValue = fc.utilities.property(function(d) { return d.high; });
        ohlc.yLowValue = fc.utilities.property(function(d) { return d.low; });
        ohlc.yCloseValue = fc.utilities.property(function(d) { return d.close; });
        ohlc.xValue = fc.utilities.property(function(d) { return d.date; });

        return ohlc;
    };
}(d3, fc));