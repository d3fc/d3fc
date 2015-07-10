(function(fc) {
    'use strict';

    // https://docs.exchange.coinbase.com/#market-data

    fc.data.feed.coinbase = function() {

        var product = 'BTC-USD',
            start = null,
            end = null,
            granularity = null;

        var coinbase = function(cb) {
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
            var url = 'https://api.exchange.coinbase.com/products/' + product + '/candles?' + params.join('&');
            d3.json(url, function(error, data) {
                if (error) {
                    cb(error);
                    return;
                }
                data = data.map(function(d) {
                    return {
                        date: new Date(d[0] * 1000),
                        open: d[3],
                        high: d[2],
                        low: d[1],
                        close: d[4],
                        volume: d[5]
                    };
                });
                cb(error, data);
            });
        };

        coinbase.product = function(x) {
            if (!arguments.length) {
                return product;
            }
            product = x;
            return coinbase;
        };
        coinbase.start = function(x) {
            if (!arguments.length) {
                return start;
            }
            start = x;
            return coinbase;
        };
        coinbase.end = function(x) {
            if (!arguments.length) {
                return end;
            }
            end = x;
            return coinbase;
        };
        coinbase.granularity = function(x) {
            if (!arguments.length) {
                return granularity;
            }
            granularity = x;
            return coinbase;
        };

        return coinbase;
    };

}(fc));
