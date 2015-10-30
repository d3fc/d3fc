import d3 from 'd3';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yHigh = d3.functor(0),
        xHigh = function(d, i) { return d.date; },
        yLow = d3.functor(0),
        xLow = function(d, i) { return d.date; },
        xValue = function(d, i) { return d.date; },
        yValue = function(d, i) { return d.y; },
        barWidth = fractionalBarWidth(0.75),
        xValueScaled = function(d, i) {
            return xScale(xValue(d, i));
        };

    function base() { }

    base.width = function(data) {
        return barWidth(data.map(xValueScaled));
    };

    base.values = function(d, i) {
        return {
            x: xValueScaled(d, i),
            y: yScale(yValue(d, i)),
            yLow: yScale(yLow(d, i)),
            yHigh: yScale(yHigh(d, i)),
            xLow: xScale(xLow(d, i)),
            xHigh: xScale(xHigh(d, i))
        };
    };
    base.defined = function(d, i) {
        return yLow(d, i) != null && yHigh(d, i) != null &&
            xValue(d, i) != null && yValue(d, i) != null
            && xLow(d, i) != null && xHigh(d, i) != null;
    };

    base.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return base;
    };
    base.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return base;
    };
    base.xHigh = function(x) {
        if (!arguments.length) {
            return xHigh;
        }
        xHigh = d3.functor(x);
        return base;
    };
    base.xLow = function(x) {
        if (!arguments.length) {
            return xLow;
        }
        xLow = d3.functor(x);
        return base;
    };
    base.yLow = function(x) {
        if (!arguments.length) {
            return yLow;
        }
        yLow = d3.functor(x);
        return base;
    };
    base.yHigh = function(x) {
        if (!arguments.length) {
            return yHigh;
        }
        yHigh = d3.functor(x);
        return base;
    };
    base.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = d3.functor(x);
        return base;
    };
    base.yValue = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = d3.functor(x);
        return base;
    };

    return base;
}
