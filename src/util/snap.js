export function noSnap(xScale, yScale) {
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
}

export function pointSnap(xScale, yScale, xValue, yValue, data, objectiveFunction) {
    // a default function that computes the distance between two points
    objectiveFunction = objectiveFunction || function(x, y, cx, cy) {
        var dx = x - cx,
            dy = y - cy;
        return dx * dx + dy * dy;
    };

    return function(xPixel, yPixel) {
        var nearest = data.map(function(d) {
            var diff = objectiveFunction(xPixel, yPixel, xScale(xValue(d)), yScale(yValue(d)));
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
}

export function seriesPointSnap(series, data, objectiveFunction) {
    return function(xPixel, yPixel) {
        var xScale = series.xScale(),
            yScale = series.yScale(),
            xValue = series.xValue(),
            yValue = (series.yValue || series.yCloseValue).call(series);
        return pointSnap(xScale, yScale, xValue, yValue, data, objectiveFunction)(xPixel, yPixel);
    };
}

export function seriesPointSnapXOnly(series, data) {
    function objectiveFunction(x, y, cx, cy) {
        var dx = x - cx;
        return Math.abs(dx);
    }
    return seriesPointSnap(series, data, objectiveFunction);
}

export function seriesPointSnapYOnly(series, data) {
    function objectiveFunction(x, y, cx, cy) {
        var dy = y - cy;
        return Math.abs(dy);
    }
    return seriesPointSnap(series, data, objectiveFunction);
}
