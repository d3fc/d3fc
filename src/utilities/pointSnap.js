(function(d3, fc) {
    'use strict';

    fc.utilities.pointSnap = function(xScale, yScale, xValue, yValue, data) {
        return function(xPixel, yPixel) {
            var nearest = data.map(function(d) {
                    var dx = xPixel - xScale(xValue(d)),
                        dy = yPixel - yScale(yValue(d)),
                        diff = Math.sqrt(dx * dx + dy * dy);
                    return [diff, d];
                })
                .reduce(function(accumulator, value) {
                    return accumulator[0] > value[0] ? value : accumulator;
                }, [Number.MAX_VALUE, null])[1];

            return {
                datum: nearest,
                x: nearest ? xValue(nearest) : xPixel,
                scaleX: Boolean(nearest),
                y: nearest ? yValue(nearest) : yPixel,
                scaleY: Boolean(nearest)
            };
        };
    };

    fc.utilities.seriesPointSnap = function(series, data) {
        return function(xPixel, yPixel) {
            var xScale = series.xScale(),
                yScale = series.yScale(),
                xValue = series.xValue ? series.xValue() : function(d) { return d.date; },
                yValue = (series.yValue || series.yCloseValue).call(series);
            return fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data)(xPixel, yPixel);
        };
    };

}(d3, fc));
