import _walk from './walk';
import d3 from 'd3';

export default function() {
    var startDate = new Date();
    var startPrice = 100;
    var granularity = 60 * 60 * 24;
    var filter = null;
    var volume = function() {
        var randomNormal = d3.random.normal(1, 0.1);
        return Math.ceil(randomNormal() * granularity);
    };
    var walk = _walk();

    function granularityInYears() {
        var millisecondsPerYear = 3.15569e10;
        return (granularity * 1000) / millisecondsPerYear;
    }

    function calculateOHLC(start, price) {
        var prices = walk
            .period(granularityInYears())(price);
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
                latest = calculateOHLC(new Date(latest.date.getTime() + granularity * 1000), latest.close);
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
    financial.granularity = function(x) {
        if (!arguments.length) {
            return granularity;
        }
        granularity = x;
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
