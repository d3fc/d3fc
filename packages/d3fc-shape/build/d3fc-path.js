'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var d3 = _interopDefault(require('d3'));

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
function ohlc () {

    var x = function x(d, i) {
        return d.date;
    },
        open = function open(d, i) {
        return d.open;
    },
        high = function high(d, i) {
        return d.high;
    },
        low = function low(d, i) {
        return d.low;
    },
        close = function close(d, i) {
        return d.close;
    },
        orient = 'vertical',
        width = d3.functor(3);

    var ohlc = function ohlc(context, data) {

        data.forEach(function (d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                halfWidth = width(d, i) / 2;

            if (orient === 'vertical') {
                context.moveTo(xValue, yLow);
                context.lineTo(xValue, yHigh);

                context.moveTo(xValue, yOpen);
                context.lineTo(xValue - halfWidth, yOpen);
                context.moveTo(xValue, yClose);
                context.lineTo(xValue + halfWidth, yClose);
            } else {
                context.moveTo(yLow, xValue);
                context.lineTo(yHigh, xValue);

                context.moveTo(yOpen, xValue);
                context.lineTo(yOpen, xValue + halfWidth);
                context.moveTo(yClose, xValue);
                context.lineTo(yClose, xValue - halfWidth);
            }
        });

        return context.toString();
    };

    ohlc.x = function (_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return ohlc;
    };
    ohlc.open = function (_x) {
        if (!arguments.length) {
            return open;
        }
        open = d3.functor(_x);
        return ohlc;
    };
    ohlc.high = function (_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return ohlc;
    };
    ohlc.low = function (_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return ohlc;
    };
    ohlc.close = function (_x) {
        if (!arguments.length) {
            return close;
        }
        close = d3.functor(_x);
        return ohlc;
    };
    ohlc.width = function (_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return ohlc;
    };
    ohlc.orient = function (_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = d3.functor(_x);
        return ohlc;
    };

    return ohlc;
}

// Renders a bar series as an SVG path based on the given array of datapoints. Each
// bar has a fixed width, whilst the x, y and height are obtained from each data
// point via the supplied accessor functions.
function bar () {

    var x = function x(d, i) {
        return d.x;
    },
        y = function y(d, i) {
        return d.y;
    },
        horizontalAlign = 'center',
        verticalAlign = 'center',
        height = function height(d, i) {
        return d.height;
    },
        width = d3.functor(3);

    var bar = function bar(context, data, index) {

        data.forEach(function (d, i) {
            var xValue = x.call(this, d, index || i),
                yValue = y.call(this, d, index || i),
                barHeight = height.call(this, d, index || i),
                barWidth = width.call(this, d, index || i);

            var horizontalOffset;
            switch (horizontalAlign) {
                case 'left':
                    horizontalOffset = barWidth;
                    break;
                case 'right':
                    horizontalOffset = 0;
                    break;
                case 'center':
                    horizontalOffset = barWidth / 2;
                    break;
                default:
                    throw new Error('Invalid horizontal alignment ' + horizontalAlign);
            }

            var verticalOffset;
            switch (verticalAlign) {
                case 'bottom':
                    verticalOffset = -barHeight;
                    break;
                case 'top':
                    verticalOffset = 0;
                    break;
                case 'center':
                    verticalOffset = barHeight / 2;
                    break;
                default:
                    throw new Error('Invalid vertical alignment ' + verticalAlign);
            }

            context.rect(xValue - horizontalOffset, yValue - verticalOffset, barWidth, barHeight);
        }, this);

        return context.toString();
    };

    bar.x = function (_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return bar;
    };
    bar.y = function (_x) {
        if (!arguments.length) {
            return y;
        }
        y = d3.functor(_x);
        return bar;
    };
    bar.width = function (_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return bar;
    };
    bar.horizontalAlign = function (_x) {
        if (!arguments.length) {
            return horizontalAlign;
        }
        horizontalAlign = _x;
        return bar;
    };
    bar.height = function (_x) {
        if (!arguments.length) {
            return height;
        }
        height = d3.functor(_x);
        return bar;
    };
    bar.verticalAlign = function (_x) {
        if (!arguments.length) {
            return verticalAlign;
        }
        verticalAlign = _x;
        return bar;
    };
    return bar;
}

var index = {
  ohlc: ohlc,
  bar: bar
};

module.exports = index;