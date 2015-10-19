import d3 from 'd3';
import fractionalBarWidth from '../util/fractionalBarWidth';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xValue = function(d, i) { return d.date; },
        yOpenValue = function(d, i) { return d.open; },
        yHighValue = function(d, i) { return d.high; },
        yLowValue = function(d, i) { return d.low; },
        yCloseValue = function(d, i) { return d.close; },
        barWidth = fractionalBarWidth(0.75),
        xValueScaled = function(d, i) {
            return xScale(xValue(d, i));
        };

    function base() { }

    base.width = function(data) {
        return barWidth(data.map(xValueScaled));
    };

    base.defined = function(d, i) {
        return xValue(d, i) != null && yOpenValue(d, i) != null &&
            yLowValue(d, i) != null && yHighValue(d, i) != null &&
            yCloseValue(d, i) != null;
    };

    base.values = function(d, i) {
        var yCloseRaw = yCloseValue(d, i),
            yOpenRaw = yOpenValue(d, i);

        var direction = '';
        if (yCloseRaw > yOpenRaw) {
            direction = 'up';
        } else if (yCloseRaw < yOpenRaw) {
            direction = 'down';
        }

        return {
            x: xValueScaled(d, i),
            yOpen: yScale(yOpenRaw),
            yHigh: yScale(yHighValue(d, i)),
            yLow: yScale(yLowValue(d, i)),
            yClose: yScale(yCloseRaw),
            direction: direction
        };
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
    base.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return base;
    };
    base.yOpenValue = function(x) {
        if (!arguments.length) {
            return yOpenValue;
        }
        yOpenValue = x;
        return base;
    };
    base.yHighValue = function(x) {
        if (!arguments.length) {
            return yHighValue;
        }
        yHighValue = x;
        return base;
    };
    base.yLowValue = function(x) {
        if (!arguments.length) {
            return yLowValue;
        }
        yLowValue = x;
        return base;
    };
    base.yValue = base.yCloseValue = function(x) {
        if (!arguments.length) {
            return yCloseValue;
        }
        yCloseValue = x;
        return base;
    };
    base.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return base;
    };

    return base;
}
