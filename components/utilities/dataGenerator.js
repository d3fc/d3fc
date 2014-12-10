(function (fc) {
    'use strict';

    fc.utilities.dataGenerator = function () {

        var mu = 0.1,
            sigma = 0.1,
            startingPrice = 100,
            startingVolume = 100000,
            intraDaySteps = 50,
            volumeNoiseFactor = 0.3,
            toDate = new Date(),
            fromDate = new Date(),
            useFakeBoxMuller = false,
            filter = function (date) {
                return !(date.getDay() === 0 || date.getDay() === 6);
            };

        var generatePrices = function (period, steps) {
            var increments = generateIncrements(period, steps, mu, sigma),
                i, prices = [];
            prices[0] = startingPrice;

            for (i = 1; i < increments.length; i += 1) {
                prices[i] = prices[i - 1] * increments[i];
            }
            return prices;
        };

        var generateVolumes = function (period, steps) {
            var increments = generateIncrements(period, steps, 0, 1),
                i, volumes = [];

            volumeNoiseFactor = Math.max(0, Math.min(volumeNoiseFactor, 1));
            volumes[0] = startingVolume;

            for (i = 1; i < increments.length; i += 1) {
                volumes[i] = volumes[i - 1] * increments[i];
            }
            volumes = volumes.map(function (vol) {
                return Math.floor(vol * (1 - volumeNoiseFactor + Math.random() * volumeNoiseFactor * 2));
            });
            return volumes;
        };

        var generateIncrements = function (period, steps, mu, sigma) {
            var deltaW = [],
                deltaY = period / steps,
                sqrtDeltaY = Math.sqrt(deltaY);

            for (var i = 0; i < steps; i++) {
                var r = useFakeBoxMuller ?
                    fakeBoxMullerTransform() :
                    boxMullerTransform()[0];
                r *= sqrtDeltaY;
                r *= sigma;
                r += (mu - ((sigma * sigma) / 2)) * deltaY;
                deltaW.push(Math.exp(r));
            }
            return deltaW;
        };

        var boxMullerTransform = function() {
            var x = 0, y = 0, rds, c;

            // Get two random numbers from -1 to 1.
            // If the radius is zero or greater than 1, throw them out and pick two new ones
            do {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                rds = x * x + y * y;
            }
            while (rds === 0 || rds > 1);

            // This is the Box-Muller Transform
            c = Math.sqrt(-2 * Math.log(rds) / rds);

            // It always creates a pair of numbers but it is quite efficient
            // so don't be afraid to throw one away if you don't need both.
            return [x * c, y * c];
        };

        var fakeBoxMullerTransform = function() {
            return (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
        };

        var generate = function() {

            var millisecondsPerYear = 3.15569e10,
                rangeYears = (toDate.getTime() - fromDate.getTime()) / millisecondsPerYear,
                daysIncluded = 0,
                prices,
                volume,
                ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            var date = new Date(fromDate.getTime());
            while (date <= toDate) {
                if (!filter || filter(date)) {
                    daysIncluded += 1;
                }
                date.setUTCDate(date.getUTCDate() + 1);
            }

            prices = generatePrices(rangeYears, daysIncluded * intraDaySteps);
            volume = generateVolumes(rangeYears, daysIncluded);

            date = new Date(fromDate.getTime());
            while (date <= toDate) {
                if (!filter || filter(date)) {
                    daySteps = prices.slice(currentIntraStep, currentIntraStep + intraDaySteps);
                    ohlcv.push({
                        date: new Date(date.getTime()),
                        open: daySteps[0],
                        high: Math.max.apply({}, daySteps),
                        low: Math.min.apply({}, daySteps),
                        close: daySteps[intraDaySteps - 1],
                        volume: volume[currentStep]
                    });
                    currentIntraStep += intraDaySteps;
                    currentStep += 1;
                }
                date.setUTCDate(date.getUTCDate() + 1);
            }

            return ohlcv;
        };

        var dataGenerator = function (selection) {
        };

        dataGenerator.generate = function() {
            return generate();
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

        dataGenerator.startingVolume = function (value) {
            if (!arguments.length) {
                return startingVolume;
            }
            startingVolume = value;
            return dataGenerator;
        };

        dataGenerator.intraDaySteps = function (value) {
            if (!arguments.length) {
                return intraDaySteps;
            }
            intraDaySteps = value;
            return dataGenerator;
        };

        dataGenerator.volumeNoiseFactor = function (value) {
            if (!arguments.length) {
                return volumeNoiseFactor;
            }
            volumeNoiseFactor = value;
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
}(fc));