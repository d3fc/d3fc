(function(d3, fc) {
    'use strict';

    fc.utilities.noSnap = function(xScale, yScale) {
        return function(xPixel, yPixel) {
            // ordinal axes don't invert pixel values (interpolation doesn't
            // always make sense) so we support two modes. One we're we record
            // the pixel value and another where we record the data value and
            // scale it before using it
            var result = {
                xInDomainUnits: false,
                x: xPixel,
                yInDomainUnits: false,
                y: yPixel
            };
            if (xScale.invert) {
                result.xInDomainUnits = true;
                result.x = xScale.invert(xPixel);
            }
            if (yScale.invert) {
                result.yInDomainUnits = true;
                result.y = yScale.invert(yPixel);
            }
            return result;
        };
    };

    fc.utilities.pointSnap = function(xScale, yScale, xValue, yValue, data, pointDistance) {
        // a default function that computes the distance between two points
        pointDistance = pointDistance || function(x, y, cx, cy) {
            var dx = x - cx,
                dy = y - cy;
            return Math.sqrt(dx * dx + dy * dy);
        };

        return function(xPixel, yPixel) {
            var nearest = data.map(function(d) {
                    var diff = pointDistance(xPixel, yPixel, xScale(xValue(d)), yScale(yValue(d)));
                    return [diff, d];
                })
                .reduce(function(accumulator, value) {
                    return accumulator[0] > value[0] ? value : accumulator;
                }, [Number.MAX_VALUE, null])[1];

            return {
                datum: nearest,
                x: nearest ? xValue(nearest) : xPixel,
                xInDomainUnits: Boolean(nearest),
                y: nearest ? yValue(nearest) : yPixel,
                yInDomainUnits: Boolean(nearest)
            };
        };
    };

    fc.utilities.seriesPointSnapXOnly = function(series, data) {
        function pointDistance(x, y, cx, cy) {
            var dx = x - cx;
            return Math.abs(dx);
        }
        return fc.utilities.seriesPointSnap(series, data, pointDistance);
    };

    fc.utilities.seriesPointSnapYOnly = function(series, data) {
        function pointDistance(x, y, cx, cy) {
            var dy = y - cy;
            return Math.abs(dy);
        }
        return fc.utilities.seriesPointSnap(series, data, pointDistance);
    };

    fc.utilities.seriesPointSnap = function(series, data, pointDistance) {
        return function(xPixel, yPixel) {
            var xScale = series.xScale(),
                yScale = series.yScale(),
                xValue = series.xValue(),
                yValue = (series.yValue || series.yCloseValue).call(series);
            return fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data, pointDistance)(xPixel, yPixel);
        };
    };

}(d3, fc));
