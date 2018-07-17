import { json } from 'd3-fetch';

// https://docs.gdax.com/#market-data
export default function() {

    var product = 'BTC-USD';
    var start = null;
    var end = null;
    var granularity = null;

    var gdax = function() {
        var params = [];
        if (start != null) {
            params.push('start=' + start.toISOString());
        }
        if (end != null) {
            params.push('end=' + end.toISOString());
        }
        if (granularity != null) {
            params.push('granularity=' + granularity);
        }
        var url = 'https://api.gdax.com/products/' + product + '/candles?' + params.join('&');
        return json(url)
            .then(function(data) {
                return data.map(function(d) {
                    return {
                        date: new Date(d[0] * 1000),
                        open: d[3],
                        high: d[2],
                        low: d[1],
                        close: d[4],
                        volume: d[5]
                    };
                });
            });
    };

    gdax.product = function(x) {
        if (!arguments.length) {
            return product;
        }
        product = x;
        return gdax;
    };
    gdax.start = function(x) {
        if (!arguments.length) {
            return start;
        }
        start = x;
        return gdax;
    };
    gdax.end = function(x) {
        if (!arguments.length) {
            return end;
        }
        end = x;
        return gdax;
    };
    gdax.granularity = function(x) {
        if (!arguments.length) {
            return granularity;
        }
        granularity = x;
        return gdax;
    };

    return gdax;
}
