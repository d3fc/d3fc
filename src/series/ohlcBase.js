import d3 from 'd3';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xValue = function(d, i) { return d.date; },
        yOpenValue = function(d, i) { return d.yOpen; },
        yHighValue = function(d, i) { return d.yHigh; },
        yLowValue = function(d, i) { return d.yLow; },
        yCloseValue = function(d, i) { return d.yClose; };

    function base() { }

    base.x = function(d, i) {
        return xScale(xValue(d, i));
    };
    base.yOpen = function(d, i) {
        return yScale(yOpenValue(d, i));
    };
    base.yHigh = function(d, i) {
        return yScale(yHighValue(d, i));
    };
    base.yLow = function(d, i) {
        return yScale(yLowValue(d, i));
    };
    base.yClose = function(d, i) {
        return yScale(yCloseValue(d, i));
    };
    base.defined = function(d, i) {
        return !isNaN(xValue(d, i)) &&
            !isNaN(yOpenValue(d, i)) && !isNaN(yHighValue(d, i)) &&
            !isNaN(yLowValue(d, i)) && !isNaN(yCloseValue(d, i));
    };
    base.upDown = function(d, i) {
        var close = yCloseValue(d, i),
            open = yOpenValue(d, i);
        if (close > open) {
            return 'up';
        } else if (open > close) {
            return 'down';
        } else {
            return '';
        }
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
        xValue = d3.functor(x);
        return base;
    };
    base.yOpenValue = function(x) {
        if (!arguments.length) {
            return yOpenValue;
        }
        yOpenValue = d3.functor(x);
        return base;
    };
    base.yHighValue = function(x) {
        if (!arguments.length) {
            return yHighValue;
        }
        yHighValue = d3.functor(x);
        return base;
    };
    base.yLowValue = function(x) {
        if (!arguments.length) {
            return yLowValue;
        }
        yLowValue = d3.functor(x);
        return base;
    };
    base.yValue = base.yCloseValue = function(x) {
        if (!arguments.length) {
            return yCloseValue;
        }
        yCloseValue = d3.functor(x);
        return base;
    };

    return base;
}
