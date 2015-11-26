import d3 from 'd3';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {defined} from '../util/fn';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        boxHigh = d3.functor(0),
        boxLow = d3.functor(0),
        whiskerHigh = d3.functor(0),
        whiskerLow = d3.functor(0),
        xValue = function(d, i) { return d.date; },
        yValue = function(d, i) { return d.close; },
        orient = 'vertical',
        barWidth = fractionalBarWidth(0.5);

    function base() { }

    base.width = function(data) {
        if (orient === 'vertical') {
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
                boxHigh: yScale(boxHigh(d, i)),
                boxLow: yScale(boxLow(d, i)),
                whiskerHigh: yScale(whiskerHigh(d, i)),
                whiskerLow: yScale(whiskerLow(d, i))
            };
        } else {
            return {
                x: xScale(xValue(d, i)),
                y: yScale(yValue(d, i)),
                boxHigh: xScale(boxHigh(d, i)),
                boxLow: xScale(boxLow(d, i)),
                whiskerHigh: xScale(whiskerHigh(d, i)),
                whiskerLow: xScale(whiskerLow(d, i))
            };
        }
    };

    base.defined = function(d, i) {
        return defined(whiskerLow, whiskerHigh, boxLow, boxHigh, xValue, yValue)(d, i);
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
    base.whiskerLow = function(x) {
        if (!arguments.length) {
            return whiskerLow;
        }
        whiskerLow = d3.functor(x);
        return base;
    };
    base.whiskerHigh = function(x) {
        if (!arguments.length) {
            return whiskerHigh;
        }
        whiskerHigh = d3.functor(x);
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
