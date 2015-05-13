(function(fc) {
    'use strict';

    fc.dataGenerator = function() {

        var mu = 0.1,
            sigma = 0.1,
            startPrice = 100,
            startVolume = 100000,
            startDate = new Date(),
            stepsPerDay = 50,
            volumeNoiseFactor = 0.3,
            filter = function(date) {
                return !(date.getDay() === 0 || date.getDay() === 6);
            };

        var calculateOHLC = function(days, prices, volumes) {

            var ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            while (ohlcv.length < days) {
                daySteps = prices.slice(currentIntraStep, currentIntraStep + stepsPerDay);
                ohlcv.push({
                    date: new Date(startDate.getTime()),
                    open: daySteps[0],
                    high: Math.max.apply({}, daySteps),
                    low: Math.min.apply({}, daySteps),
                    close: daySteps[stepsPerDay - 1],
                    volume: volumes[currentStep]
                });
                currentIntraStep += stepsPerDay;
                currentStep += 1;
                startDate.setUTCDate(startDate.getUTCDate() + 1);
            }
            return ohlcv;
        };

        var gen = function(days) {
            var toDate = new Date(startDate.getTime());
            toDate.setUTCDate(startDate.getUTCDate() + days);

            var millisecondsPerYear = 3.15569e10,
                years = (toDate.getTime() - startDate.getTime()) / millisecondsPerYear;

            var prices = randomWalk(
                years,
                days * stepsPerDay,
                mu,
                sigma,
                startPrice
            );
            var volumes = randomWalk(
                years,
                days,
                0,
                sigma,
                startVolume
            );

            // Add random noise
            volumes = volumes.map(function(vol) {
                var boundedNoiseFactor = Math.min(0, Math.max(volumeNoiseFactor, 1));
                var multiplier = 1 + (boundedNoiseFactor * (1 - 2 * Math.random()));
                return Math.floor(vol * multiplier);
            });

            // Save the new start values
            startPrice = prices[prices.length - 1];
            startVolume = volumes[volumes.length - 1];

            return calculateOHLC(days, prices, volumes).filter(function(d) {
                return !filter || filter(d.date);
            });
        };

        var randomWalk = function(period, steps, mu, sigma, initial) {
            var randomNormal = d3.random.normal(),
                timeStep = period / steps,
                increments = new Array(steps + 1),
                increment,
                step;

            // Compute step increments for the discretized GBM model.
            for (step = 1; step < increments.length; step += 1) {
                increment = randomNormal();
                increment *= Math.sqrt(timeStep);
                increment *= sigma;
                increment += (mu - ((sigma * sigma) / 2)) * timeStep;
                increments[step] = Math.exp(increment);
            }
            // Return the cumulative product of increments from initial value.
            increments[0] = initial;
            for (step = 1; step < increments.length; step += 1) {
                increments[step] = increments[step - 1] * increments[step];
            }
            return increments;
        };

        gen.mu = function(x) {
            if (!arguments.length) {
                return mu;
            }
            mu = x;
            return gen;
        };
        gen.sigma = function(x) {
            if (!arguments.length) {
                return sigma;
            }
            sigma = x;
            return gen;
        };
        gen.startPrice = function(x) {
            if (!arguments.length) {
                return startPrice;
            }
            startPrice = x;
            return gen;
        };
        gen.startVolume = function(x) {
            if (!arguments.length) {
                return startVolume;
            }
            startVolume = x;
            return gen;
        };
        gen.startDate = function(x) {
            if (!arguments.length) {
                return startDate;
            }
            startDate = x;
            return gen;
        };
        gen.stepsPerDay = function(x) {
            if (!arguments.length) {
                return stepsPerDay;
            }
            stepsPerDay = x;
            return gen;
        };
        gen.volumeNoiseFactor = function(x) {
            if (!arguments.length) {
                return volumeNoiseFactor;
            }
            volumeNoiseFactor = x;
            return gen;
        };
        gen.filter = function(x) {
            if (!arguments.length) {
                return filter;
            }
            filter = x;
            return gen;
        };

        return gen;
    };

}(fc));
