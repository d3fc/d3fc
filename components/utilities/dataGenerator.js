(function(fc) {
    'use strict';

    fc.utilities.dataGenerator = function() {

        var startingPrice = 100,
            startingVolume = 100000,
            stepsPerDay = 50,
            volumeNoiseFactor = 0.3,
            startDate = new Date(),
            currentDate = new Date(startDate.getTime()),
            filter = function(date) {
                return !(date.getDay() === 0 || date.getDay() === 6);
            };

        var generateVolumes = function(period, steps) {
            var noise = Math.max(0, Math.min(volumeNoiseFactor, 1)),
                volumes = fc.math.randomWalk(period, steps, 0, 1, startingVolume);

            volumes = volumes.map(function(vol) {
                return Math.floor(vol * (1 - noise + Math.random() * noise * 2));
            });
            startingVolume = volumes[volumes.length - 1];
            return volumes;
        };

        var gen = function(days) {
            var toDate = new Date(currentDate.getTime());
            toDate.setUTCDate(toDate.getUTCDate() + days);

            var millisecondsPerYear = 3.15569e10,
                rangeYears = (toDate.getTime() - currentDate.getTime()) / millisecondsPerYear,
                prices,
                volume,
                ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            prices = fc.math.randomWalk(rangeYears, days * stepsPerDay,
                gen.mu.value, gen.sigma.value, startingPrice);
            startingPrice = prices[prices.length - 1];
            volume = generateVolumes(rangeYears, days);

            var date = new Date(currentDate.getTime());
            while (ohlcv.length < days) {
                if (!filter || filter(date)) {
                    daySteps = prices.slice(currentIntraStep, currentIntraStep + stepsPerDay);
                    ohlcv.push({
                        date: new Date(date.getTime()),
                        open: daySteps[0],
                        high: Math.max.apply({}, daySteps),
                        low: Math.min.apply({}, daySteps),
                        close: daySteps[stepsPerDay - 1],
                        volume: volume[currentStep]
                    });
                    currentIntraStep += stepsPerDay;
                    currentStep += 1;
                }
                date.setUTCDate(date.getUTCDate() + 1);
            }
            currentDate = new Date(date.getTime());

            return ohlcv;
        };

        gen.mu = fc.utilities.property(0.1);
        gen.sigma = fc.utilities.property(0.1);

        gen.startingPrice = function(value) {
            if (!arguments.length) {
                return startingPrice;
            }
            startingPrice = value;
            return gen;
        };

        gen.startingVolume = function(value) {
            if (!arguments.length) {
                return startingVolume;
            }
            startingVolume = value;
            return gen;
        };

        gen.stepsPerDay = function(value) {
            if (!arguments.length) {
                return stepsPerDay;
            }
            stepsPerDay = value;
            return gen;
        };

        gen.volumeNoiseFactor = function(value) {
            if (!arguments.length) {
                return volumeNoiseFactor;
            }
            volumeNoiseFactor = value;
            return gen;
        };

        gen.filter = function(value) {
            if (!arguments.length) {
                return filter;
            }
            filter = value;
            return gen;
        };

        gen.startDate = function(value) {
            if (!arguments.length) {
                return startDate;
            }
            startDate = value;
            return gen;
        };

        return gen;
    };

}(fc));