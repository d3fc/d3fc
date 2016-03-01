'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var d3 = _interopDefault(require('d3'));

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
function ohlc (context) {

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

    var ohlc = function ohlc(data) {
        var path = context();

        data.forEach(function (d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                halfWidth = width(d, i) / 2;

            if (orient === 'vertical') {
                path.moveTo(xValue, yLow);
                path.lineTo(xValue, yHigh);

                path.moveTo(xValue, yOpen);
                path.lineTo(xValue - halfWidth, yOpen);
                path.moveTo(xValue, yClose);
                path.lineTo(xValue + halfWidth, yClose);
            } else {
                path.moveTo(yLow, xValue);
                path.lineTo(yHigh, xValue);

                path.moveTo(yOpen, xValue);
                path.lineTo(yOpen, xValue + halfWidth);
                path.moveTo(yClose, xValue);
                path.lineTo(yClose, xValue - halfWidth);
            }
        });

        return path.toString();
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
function bar (context) {

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

    var bar = function bar(data, index) {
        var path = context();

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

            path.rect(xValue - horizontalOffset, yValue - verticalOffset, barWidth, barHeight);
        }, this);

        return path.toString();
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

// Renders a candlestick as an SVG path based on the given array of datapoints. Each
// candlestick has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
function candlestick (context) {

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
        width = d3.functor(3);

    var candlestick = function candlestick(data) {
        var path = context();

        data.forEach(function (d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                barWidth = width(d, i),
                halfBarWidth = barWidth / 2;

            // Body
            path.rect(xValue - halfBarWidth, yOpen, barWidth, yClose - yOpen);
            // High wick
            // // Move to the max price of close or open; draw the high wick
            // N.B. Math.min() is used as we're dealing with pixel values,
            // the lower the pixel value, the higher the price!
            path.moveTo(xValue, Math.min(yClose, yOpen));
            path.lineTo(xValue, yHigh);
            // Low wick
            // // Move to the min price of close or open; draw the low wick
            // N.B. Math.max() is used as we're dealing with pixel values,
            // the higher the pixel value, the lower the price!
            path.moveTo(xValue, Math.max(yClose, yOpen));
            path.lineTo(xValue, yLow);
        });

        return path.toString();
    };

    candlestick.x = function (_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return candlestick;
    };
    candlestick.open = function (_x) {
        if (!arguments.length) {
            return open;
        }
        open = d3.functor(_x);
        return candlestick;
    };
    candlestick.high = function (_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return candlestick;
    };
    candlestick.low = function (_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return candlestick;
    };
    candlestick.close = function (_x) {
        if (!arguments.length) {
            return close;
        }
        close = d3.functor(_x);
        return candlestick;
    };
    candlestick.width = function (_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return candlestick;
    };

    return candlestick;
}

// Renders a box plot series as an SVG path based on the given array of datapoints.
function boxPlot (context) {

    var value = function value(d, i) {
        return d.value;
    },
        median = function median(d, i) {
        return d.median;
    },
        upperQuartile = function upperQuartile(d, i) {
        return d.upperQuartile;
    },
        lowerQuartile = function lowerQuartile(d, i) {
        return d.lowerQuartile;
    },
        high = function high(d, i) {
        return d.high;
    },
        low = function low(d, i) {
        return d.low;
    },
        orient = 'vertical',
        width = d3.functor(5),
        cap = d3.functor(0.5);

    var boxPlot = function boxPlot(data) {
        var path = context();

        data.forEach(function (d, i) {
            // naming convention is for vertical orientation
            var _value = value(d, i),
                _width = width(d, i),
                halfWidth = _width / 2,
                capWidth = _width * cap(d, i),
                halfCapWidth = capWidth / 2,
                _high = high(d, i),
                _upperQuartile = upperQuartile(d, i),
                _median = median(d, i),
                _lowerQuartile = lowerQuartile(d, i),
                _low = low(d, i),
                highToUpperQuartile = _upperQuartile - _high,
                upperQuartileToMedian = _median - _upperQuartile,
                upperQuartileToLowerQuartile = _lowerQuartile - _upperQuartile,
                medianToLowerQuartile = _lowerQuartile - _median,
                lowerQuartileToLow = _low - _lowerQuartile;

            if (orient === 'vertical') {
                // Upper whisker
                path.moveTo(_value - halfCapWidth, _high);
                path.lineTo(_value + halfCapWidth, _high);
                path.moveTo(_value, _high);
                path.lineTo(_value, _upperQuartile);

                // Box
                path.rect(_value - halfWidth, _upperQuartile, _width, upperQuartileToLowerQuartile);
                path.moveTo(_value - halfWidth, _median);
                // Median line
                path.lineTo(_value + halfWidth, _median);

                // Lower whisker
                path.moveTo(_value, _lowerQuartile);
                path.lineTo(_value, _low);
                path.moveTo(_value - halfCapWidth, _low);
                path.lineTo(_value + halfCapWidth, _low);
            } else {
                // Lower whisker
                path.moveTo(_low, _value - halfCapWidth);
                path.lineTo(_low, _value + halfCapWidth);
                path.moveTo(_low, _value);
                path.lineTo(_lowerQuartile, _value);

                // Box
                path.rect(_lowerQuartile, _value - halfWidth, -upperQuartileToLowerQuartile, _width);
                path.moveTo(_median, _value - halfWidth);
                path.lineTo(_median, _value + halfWidth);

                // Upper whisker
                path.moveTo(_upperQuartile, _value);
                path.lineTo(_high, _value);
                path.moveTo(_high, _value - halfCapWidth);
                path.lineTo(_high, _value + halfCapWidth);
            }
        });

        return path.toString();
    };

    boxPlot.value = function (_x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.median = function (_x) {
        if (!arguments.length) {
            return median;
        }
        median = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.upperQuartile = function (_x) {
        if (!arguments.length) {
            return upperQuartile;
        }
        upperQuartile = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.lowerQuartile = function (_x) {
        if (!arguments.length) {
            return lowerQuartile;
        }
        lowerQuartile = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.high = function (_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.low = function (_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.width = function (_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return boxPlot;
    };
    boxPlot.orient = function (_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return boxPlot;
    };
    boxPlot.cap = function (_x) {
        if (!arguments.length) {
            return cap;
        }
        cap = d3.functor(_x);
        return boxPlot;
    };

    return boxPlot;
}

// Renders an error bar series as an SVG path based on the given array of datapoints.
function errorBar (context) {

    var value = function value(d, i) {
        return d.x;
    },
        high = function high(d, i) {
        return d.high;
    },
        low = function low(d, i) {
        return d.low;
    },
        orient = 'vertical',
        width = d3.functor(5);

    var errorBar = function errorBar(data) {
        var path = context();

        data.forEach(function (d, i) {
            // naming convention is for vertical orientation
            var _value = value(d, i),
                _width = width(d, i),
                halfWidth = _width / 2,
                _high = high(d, i),
                _low = low(d, i),
                height = _high - _low;

            if (orient === 'vertical') {
                path.moveTo(_value - halfWidth, _high);
                path.lineTo(_value + halfWidth, _high);
                path.moveTo(_value, _high);
                path.lineTo(_value, _low);
                path.moveTo(_value - halfWidth, _low);
                path.lineTo(_value + halfWidth, _low);
            } else {
                path.moveTo(_low, _value - halfWidth);
                path.lineTo(_low, _value + halfWidth);
                path.moveTo(_low, _value);
                path.lineTo(_high, _value);
                path.moveTo(_high, _value - halfWidth);
                path.lineTo(_high, _value + halfWidth);
            }
        });

        return path.toString();
    };

    errorBar.value = function (_x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(_x);
        return errorBar;
    };
    errorBar.high = function (_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return errorBar;
    };
    errorBar.low = function (_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return errorBar;
    };
    errorBar.width = function (_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return errorBar;
    };
    errorBar.orient = function (_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return errorBar;
    };

    return errorBar;
}

exports.ohlc = ohlc;
exports.bar = bar;
exports.candlestick = candlestick;
exports.boxPlot = boxPlot;
exports.errorBar = errorBar;