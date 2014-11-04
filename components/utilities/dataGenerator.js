define ([
    'sl',
    'moment',
    'moment-range',
    'jstat'
], function (sl, moment) {
    'use strict';

    sl.utilities.dataGenerator = function () {

        var mu = 0.1,
            sigma = 0.1,
            startingPrice = 100,
            intraDaySteps = 50,
            toDate = new Date(),
            fromDate = new Date(),
            filter = function (moment) { 
                return !(moment.day() === 0 || moment.day() === 6);
            };

        var data = null;

        var generatePrices = function (period, steps) {
            var increments = generateIncrements(period, steps),
                i, prices = [];

            prices[0] = startingPrice;
            for (i = 1; i < increments.length; i += 1) {
                prices[i] = prices[i - 1] * increments[i];
            }
            return prices;
        };

        var generateIncrements = function (period, steps) {
            // Geometric Brownian motion model.
            var deltaY = period / steps,
                sqrtDeltaY = Math.sqrt(deltaY),
                deltaW = jStat().randn(1, steps).multiply(sqrtDeltaY),
                increments =  deltaW
                    .multiply(sigma)
                    .add((mu - ((sigma * sigma) / 2)) * deltaY),
                expIncrements = increments.map(function (x) {
                    return Math.exp(x);
                });

            return jStat.row(expIncrements, 0);
        };

        var dataGenerator = function (selection) {
        };
            
        dataGenerator.generate = function() {

            var range = moment().range(fromDate, toDate),
                rangeYears = range / 3.15569e10,
                daysIncluded = 0,
                steps,
                prices,
                ohlc = [],
                daySteps,
                currentStep = 0,
                self = this;

            range.by('days', function (moment) {
                if (self.filter(moment)) {
                    daysIncluded += 1;
                }
            });

            steps = daysIncluded * intraDaySteps;
            prices = generatePrices(rangeYears, steps);

            range.by('days', function (moment) {
                if (self.filter(moment)) {
                    daySteps = prices.slice(currentStep, currentStep += intraDaySteps);
                    ohlc.push({
                        date: moment.toDate(),
                        open: daySteps[0],
                        high: Math.max.apply({}, daySteps),
                        low: Math.min.apply({}, daySteps),
                        close: daySteps[intraDaySteps - 1],
                        volume: Math.floor(Math.random() * 10000) * 1000
                    })
                }
            });

            return ohlc;
        };

        dataGenerator.mu = function (value) {
            if (!arguments.length) {
                return mu;
            }
            mu = value;
            return dataGenerator;
        };

        dataGenerator.sigma = function (value) {
            if (!arguments.length) {
                return sigma;
            }
            sigma = value;
            return dataGenerator;
        };

        dataGenerator.startingPrice = function (value) {
            if (!arguments.length) {
                return startingPrice;
            }
            startingPrice = value;
            return dataGenerator;
        };

        dataGenerator.intraDaySteps = function (value) {
            if (!arguments.length) {
                return intraDaySteps;
            }
            intraDaySteps = value;
            return dataGenerator;
        };

        dataGenerator.filter = function (value) {
            if (!arguments.length) {
                return filter;
            }
            filter = value;
            return dataGenerator;
        };

        dataGenerator.toDate = function (value) {
            if (!arguments.length) {
                return toDate;
            }
            toDate = value;
            return dataGenerator;
        };

        dataGenerator.fromDate = function (value) {
            if (!arguments.length) {
                return fromDate;
            }
            fromDate = value;
            return dataGenerator;
        };

        return dataGenerator;
    };
});