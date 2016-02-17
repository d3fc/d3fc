import _walk from './walk';
import d3 from 'd3';

export default function() {
    var startDate = new Date();
    var startPrice = 100;
    var interval = d3.time.day;
    var intervalStep = 1;
    var unitInterval = d3.time.year;
    var unitIntervalStep = 1;
    var filter = null;
    var volume = function() {
        var randomNormal = d3.random.normal(1, 0.1);
        return Math.ceil(randomNormal() * 1000);
    };
    var walk = _walk();

    function getOffsetPeriod(date) {
        var unitMilliseconds = unitInterval.offset(date, unitIntervalStep) - date;
        return (interval.offset(date, intervalStep) - date) / unitMilliseconds;
    }

    function calculateOHLC(start, price) {
        var period = getOffsetPeriod(start);
        var prices = walk.period(period)(price);
        var ohlc = {
            date: start,
            open: prices[0],
            high: Math.max.apply(Math, prices),
            low: Math.min.apply(Math, prices),
            close: prices[walk.steps()]
        };
        ohlc.volume = volume(ohlc);
        return ohlc;
    }

    function getNextDatum(ohlc) {
        var date, price;
        do {
            date = ohlc ? interval.offset(ohlc.date, intervalStep) : new Date(startDate.getTime());
            price = ohlc ? ohlc.close : startPrice;
            ohlc = calculateOHLC(date, price);
        } while (filter && !filter(ohlc));
        return ohlc;
    }

    var financial = function(numPoints) {
        var stream = makeStream();
        return stream.take(numPoints);
    };

    financial.stream = makeStream;

    function makeStream() {
        var latest;
        var stream = {};
        stream.next = function() {
            var ohlc = getNextDatum(latest);
            latest = ohlc;
            return ohlc;
        };
        stream.take = function(numPoints) {
            return this.until(function(d, i) {
                return !numPoints || numPoints < 0 || i === numPoints;
            });
        };
        stream.until = function(comparison) {
            var data = [];
            var index = 0;
            var ohlc = getNextDatum(latest);
            while (comparison && !comparison(ohlc, index)) {
                data.push(ohlc);
                latest = ohlc;
                ohlc = getNextDatum(latest);
                index += 1;
            }
            return data;
        };
        return stream;
    }

    financial.startDate = function(x) {
        if (!arguments.length) {
            return startDate;
        }
        startDate = x;
        return financial;
    };
    financial.startPrice = function(x) {
        if (!arguments.length) {
            return startPrice;
        }
        startPrice = x;
        return financial;
    };
    financial.interval = function(x) {
        if (!arguments.length) {
            return interval;
        }
        interval = x;
        return financial;
    };
    financial.intervalStep = function(x) {
        if (!arguments.length) {
            return intervalStep;
        }
        intervalStep = x;
        return financial;
    };
    financial.unitInterval = function(x) {
        if (!arguments.length) {
            return unitInterval;
        }
        unitInterval = x;
        return financial;
    };
    financial.unitIntervalStep = function(x) {
        if (!arguments.length) {
            return unitIntervalStep;
        }
        unitIntervalStep = x;
        return financial;
    };
    financial.filter = function(x) {
        if (!arguments.length) {
            return filter;
        }
        filter = x;
        return financial;
    };
    financial.volume = function(x) {
        if (!arguments.length) {
            return volume;
        }
        volume = d3.functor(x);
        return financial;
    };

    d3.rebind(financial, walk, 'steps', 'mu', 'sigma');

    return financial;
}
