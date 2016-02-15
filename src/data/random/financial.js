import _walk from './walk';
import d3 from 'd3';

export default function() {
    var startDate = new Date();
    var startPrice = 100;
    var interval = d3.time.day;
    var intervalStep = 1;
    var unitInterval = d3.time.year;
    var unitStep = 1;
    var filter = null;
    var volume = function() {
        var randomNormal = d3.random.normal(1, 0.1);
        return Math.ceil(randomNormal() * 1000);
    };
    var walk = _walk();

    function getOffsetPeriod(date) {
        var unitMilliseconds = unitInterval.offset(date, unitStep) - date;
        return (interval.offset(date, intervalStep) - date) / unitMilliseconds;
    }

    function calculateOHLC(start, price) {
        var period = getOffsetPeriod(start);
        var prices = walk.period(period)(price);
        var datum = {
            date: start,
            open: prices[0],
            high: Math.max.apply(Math, prices),
            low: Math.min.apply(Math, prices),
            close: prices[walk.steps()]
        };
        datum.volume = volume(datum);
        return datum;
    }

    var financial = function(numPoints) {
        var stream = makeStream();
        return stream.take(numPoints);
    };

    financial.stream = makeStream;

    function makeStream() {
        var latest;
        function getDatum() {
            if (!latest) {
                latest = calculateOHLC(new Date(startDate.getTime()), startPrice);
            } else {
                latest = calculateOHLC(interval.offset(latest.date, intervalStep), latest.close);
            }
            return latest;
        }
        function getNextDatum() {
            var ohlc;
            do {
                ohlc = getDatum();
            } while (filter && !filter(ohlc));
            return ohlc;
        }
        var stream = {};
        stream.next = function() {
            return getNextDatum();
        };
        stream.take = function(numPoints) {
            var data = [];
            if (numPoints && numPoints > 0) {
                data = this.until(function(d, i) {
                    return i === numPoints - 1;
                });
            }
            return data;
        };
        stream.until = function(comparison) {
            var data = [];
            var index = 0;
            if (!comparison || latest && comparison(latest, index)) {
                return data;
            }
            var ohlc = getNextDatum();
            while (comparison) {
                data.push(ohlc);
                if (comparison(ohlc, index)) {
                    break;
                }
                index += 1;
                ohlc = getNextDatum();
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
    financial.unitStep = function(x) {
        if (!arguments.length) {
            return unitStep;
        }
        unitStep = x;
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
