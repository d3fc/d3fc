efine ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

    sl.svg.ohlcBar = function () {

        var open = function (d) {
                return d.open;
            },
            high = function (d) {
                return d.high;
            },
            low = function (d) {
                return d.low;
            },
            close = function (d) {
                return d.close;
            },
            date = function (d) {
                return d.date;
            };

        var tickWidth = 5;

        var ohlcBar = function (d) {
            // return the path
            var moveToLow = 'M' + date(d) + ',' + low(d),
                verticalToHigh = 'V' + high(d),
                openTick = 'M' + date(d) + "," + open(d) + 'h' + (-tickWidth),
                closeTick = 'M' + date(d) + "," + close(d) + 'h' + tickWidth;

            return moveToLow + verticalToHigh + openTick + closeTick;
        };

        ohlcBar.tickWidth = function (value) {
            if (!arguments.length) {
                return tickWidth;
            }
            tickWidth = value;
            return ohlcBar;
        };

        ohlcBar.open = function (value) {
            if (!arguments.length) {
                return open;
            }
            open = value;
            return ohlcBar;
        };

        ohlcBar.high = function (value) {
            if (!arguments.length) {
                return high;
            }
            high = value;
            return ohlcBar;
        };

        ohlcBar.low = function (value) {
            if (!arguments.length) {
                return low;
            }
            low = value;
            return ohlcBar;
        };

        ohlcBar.close = function (value) {
            if (!arguments.length) {
                return close;
            }
            close = value;
            return ohlcBar;
        };

        ohlcBar.date = function (value) {
            if (!arguments.length) {
                return date;
            }
            date = value;
            return ohlcBar;
        };

        return ohlcBar;

    };
});