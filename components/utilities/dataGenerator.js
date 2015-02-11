(function(fc) {
    'use strict';

    fc.utilities.dataGenerator = function() {

        var mu = 0.1,
            sigma = 0.1,
            startingPrice = 100,
            startingVolume = 100000,
            intraDaySteps = 50,
            volumeNoiseFactor = 0.3,
            seedDate = new Date(),
            currentDate = new Date(seedDate.getTime()),
            filter = function(date) {
                return !(date.getDay() === 0 || date.getDay() === 6);
            };

        var generateVolumes = function(period, steps) {
            var volumeNoiseFactor = Math.max(0, Math.min(volumeNoiseFactor, 1)),
                volumes = fc.math.randomWalk(period, steps, 0, 1, startingVolume);

            volumes = volumes.map(function(vol) {
                return Math.floor(vol * (1 - volumeNoiseFactor + Math.random() * volumeNoiseFactor * 2));
            });
            startingVolume = volumes[volumes.length - 1];
            return volumes;
        };

        var dataGenerator = function() {};

        dataGenerator.generate = function(dataCount) {

            var toDate = new Date(currentDate.getTime());
            toDate.setUTCDate(toDate.getUTCDate() + dataCount);

            var millisecondsPerYear = 3.15569e10,
                rangeYears = (toDate.getTime() - currentDate.getTime()) / millisecondsPerYear,
                prices,
                volume,
                ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            prices = fc.math.randomWalk(rangeYears, dataCount * intraDaySteps, mu, sigma, startingPrice);
            volume = generateVolumes(rangeYears, dataCount);

            var date = new Date(currentDate.getTime());
            while (ohlcv.length < dataCount) {
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
            currentDate = new Date(date.getTime());

            return ohlcv;
        };

        dataGenerator.mu = function(value) {
            if (!arguments.length) {
                return mu;
            }
            mu = value;
            return dataGenerator;
        };

        dataGenerator.sigma = function(value) {
            if (!arguments.length) {
                return sigma;
            }
            sigma = value;
            return dataGenerator;
        };

        dataGenerator.startingPrice = function(value) {
            if (!arguments.length) {
                return startingPrice;
            }
            startingPrice = value;
            return dataGenerator;
        };

        dataGenerator.startingVolume = function(value) {
            if (!arguments.length) {
                return startingVolume;
            }
            startingVolume = value;
            return dataGenerator;
        };

        dataGenerator.intraDaySteps = function(value) {
            if (!arguments.length) {
                return intraDaySteps;
            }
            intraDaySteps = value;
            return dataGenerator;
        };

        dataGenerator.volumeNoiseFactor = function(value) {
            if (!arguments.length) {
                return volumeNoiseFactor;
            }
            volumeNoiseFactor = value;
            return dataGenerator;
        };

        dataGenerator.filter = function(value) {
            if (!arguments.length) {
                return filter;
            }
            filter = value;
            return dataGenerator;
        };

        dataGenerator.seedDate = function(value) {
            if (!arguments.length) {
                return seedDate;
            }
            seedDate = value;
            return dataGenerator;
        };

        dataGenerator.randomSeed = function() {
            return dataGenerator;
        };

        return dataGenerator;
    };

}(fc));