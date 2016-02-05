import walk from './walk';
import d3 from 'd3';

export default function() {
    var startDate = new Date();
    var startPrice = 100;
    var granularity = 60 * 60 * 24;
    var filter = null;
    var steps = 10;
    var mu = 0.1;
    var sigma = 0.1;
    var volume = function() {
        var randomNormal = d3.random.normal(1, 0.1);
        return Math.ceil(randomNormal() * granularity);
    };

    function granularityInYears() {
        var millisecondsPerYear = 3.15569e10;
        return (granularity * 1000) / millisecondsPerYear;
    }

    function calculateOHLC(start, price) {
        var prices = walk()
            .period(granularityInYears())
            .steps(steps)
            .mu(mu)
            .sigma(sigma)(price);
        return {
            date: start,
            open: prices[0],
            high: Math.max.apply({}, prices),
            low: Math.min.apply({}, prices),
            close: prices[steps],
            volume: volume()
        };
    }

    var financial = function(numPoints) {
        var stream = makeStream();
        return stream.take(numPoints);
    };

    financial.stream = makeStream;

    function makeStream() {
        var streamStartDate = new Date(startDate.getTime());
        var streamStartPrice = startPrice;
        function getDatum() {
            var ohlc = calculateOHLC(streamStartDate, streamStartPrice);
            streamStartDate = new Date(ohlc.date.getTime() + granularity * 1000);
            streamStartPrice = ohlc.close;
            return ohlc;
        }
        function getNextDatum() {
            var ohlc = getDatum();
            while (filter && !filter(ohlc)) {
                ohlc = getDatum();
            }
            return ohlc;
        }
        var stream = function() {
        };
        stream.next = function() {
            return getNextDatum();
        };
        stream.take = function(numPoints) {
            var point;
            var data = [];
            for (point = 0; point < numPoints; point += 1) {
                data.push(getNextDatum());
            }
            return data;
        };
        stream.until = function(comparison) {
            var data = [];
            var ohlc = getNextDatum();
            while (comparison && !comparison(ohlc)) {
                data.push(ohlc);
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
    financial.steps = function(x) {
        if (!arguments.length) {
            return steps;
        }
        steps = x;
        return financial;
    };
    financial.mu = function(x) {
        if (!arguments.length) {
            return mu;
        }
        mu = x;
        return financial;
    };
    financial.sigma = function(x) {
        if (!arguments.length) {
            return sigma;
        }
        sigma = x;
        return financial;
    };
    financial.volume = function(x) {
        if (!arguments.length) {
            return volume;
        }
        volume = d3.functor(x);
        return financial;
    };
    return financial;
}
