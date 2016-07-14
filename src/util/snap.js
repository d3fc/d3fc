import {defined, identity} from './fn';
import minimum from './minimum';

export function noSnap() {
    return identity;
}

export function pointSnap(xScale, yScale, xValue, yValue, data, objectiveFunction) {
    // a default function that computes the distance between two points
    objectiveFunction = objectiveFunction || function(x, y, cx, cy) {
        var dx = x - cx,
            dy = y - cy;
        return dx * dx + dy * dy;
    };

    return function(point) {
        var filtered = data.filter(function(d, i) {
            return defined(xValue, yValue)(d, i);
        });

        var nearest = minimum(filtered, function(d) {
            return objectiveFunction(point.x, point.y, xScale(xValue(d)), yScale(yValue(d)));
        })[1];

        return {
            datum: nearest,
            x: nearest ? xScale(xValue(nearest)) : point.x,
            y: nearest ? yScale(yValue(nearest)) : point.y
        };
    };
}

export function seriesPointSnap(series, data, objectiveFunction) {
    return function(point) {
        var xScale = series.xScale(),
            yScale = series.yScale(),
            xValue = series.xValue(),
            yValue = (series.yValue || series.yCloseValue).call(series);
        return pointSnap(xScale, yScale, xValue, yValue, data, objectiveFunction)(point);
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
