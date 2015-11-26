import d3 from 'd3';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        boxHigh = d3.functor(0),
        boxLow = d3.functor(0),
        errorHigh = d3.functor(0),
        errorLow = d3.functor(0),
        xValue = function(d, i) { return d.date; },
        yValue = function(d, i) { return d.close; },
        orient = 'vertical',
        barWidth = d3.functor(5);

    function base() { }

    base.width = function(data, orientation) {
        if (orientation === 'vertical') {
            return barWidth(data.map(function(d, i) {
                return xScale(xValue(d, i));
            }));
        } else {
            return barWidth(data.map(function(d, i) {
                return yScale(yValue(d, i));
            }));
        }
    };

    base.values = function(d, i) {
        if (orient === 'vertical') {
            return {
                x: xScale(xValue(d, i)),
                y: yScale(yValue(d, i)),
                boxHigh: yScale(bowHigh(d, i)),
                boxLow: yScale(boxLow(d, i)),
                errorHigh: yScale(errorHigh(d, i)),
                errorLow: yScale(errorLow(d, i))
            };
        } else {
            return {
                x: xScale(xValue(d, i)),
                y: yScale(yValue(d, i)),
                boxHigh: xScale(bowHigh(d, i)),
                boxLow: xScale(boxLow(d, i)),
                errorHigh: xScale(errorHigh(d, i)),
                errorLow: xScale(errorLow(d, i))
            };
        }
    };
    base.defined = function(d, i) {
        return errorLow(d, i) != null && errorHigh(d, i) != null
                && boxLow(d, i) != null && boxHigh(d, i) != null
            && xValue(d, i) != null && yValue(d, i) != null;
    };

    base.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return base;
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
    base.boxLow = function(x) {
        if (!arguments.length) {
            return boxLow;
        }
        boxLow = d3.functor(x);
        return base;
    };
    base.boxHigh = function(x) {
        if (!arguments.length) {
            return boxHigh;
        }
        boxHigh = d3.functor(x);
        return base;
    };
    base.errorLow = function(x) {
        if (!arguments.length) {
            return errorLow;
        }
        errorLow = d3.functor(x);
        return base;
    };
    base.errorHigh = function(x) {
        if (!arguments.length) {
            return errorHigh;
        }
        errorHigh = d3.functor(x);
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
    base.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return base;
    };

    return base;
}
