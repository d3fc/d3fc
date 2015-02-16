(function(fc) {
    'use strict';

    fc.utilities.dataGenerator = function() {

        var calculateOHLC = function(days, prices, volumes) {
            var ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0,
                stepsPerDay = gen.stepsPerDay.value;

            while (ohlcv.length < days) {
                daySteps = prices.slice(currentIntraStep, currentIntraStep + stepsPerDay);
                ohlcv.push({
                    date: new Date(gen.startDate.value.getTime()),
                    open: daySteps[0],
                    high: Math.max.apply({}, daySteps),
                    low: Math.min.apply({}, daySteps),
                    close: daySteps[stepsPerDay - 1],
                    volume: volumes[currentStep]
                });
                currentIntraStep += stepsPerDay;
                currentStep += 1;
                gen.startDate.value.setUTCDate(gen.startDate.value.getUTCDate() + 1);
            }
            return ohlcv;
        };

        var gen = function(days) {
            var toDate = new Date(gen.startDate.value.getTime());
            toDate.setUTCDate(gen.startDate.value.getUTCDate() + days);

            var millisecondsPerYear = 3.15569e10,
                years = (toDate.getTime() - gen.startDate.value.getTime()) / millisecondsPerYear;

            var prices = fc.math.randomWalk(
                years,
                days * gen.stepsPerDay.value,
                gen.mu.value,
                gen.sigma.value,
                gen.startPrice.value
            );
            var volumes = fc.math.randomWalk(
                years,
                days,
                0,
                gen.sigma.value,
                gen.startVolume.value
            );

            // Add random noise
            volumes = volumes.map(function(vol) {
                var boundedNoiseFactor = Math.min(0, Math.max(gen.volumeNoiseFactor.value, 1));
                var multiplier = 1 + (boundedNoiseFactor * (1 - 2 * Math.random()));
                return Math.floor(vol * multiplier);
            });

            // Save the new start values
            gen.startPrice.value = prices[prices.length - 1];
            gen.startVolume.value = volumes[volumes.length - 1];

            return calculateOHLC(days, prices, volumes).filter(function(d) {
                return !gen.filter.value || gen.filter.value(d.date);
            });
        };

        gen.mu = fc.utilities.property(0.1);
        gen.sigma = fc.utilities.property(0.1);
        gen.startPrice = fc.utilities.property(100);
        gen.startVolume = fc.utilities.property(100000);
        gen.startDate = fc.utilities.property(new Date());
        gen.stepsPerDay = fc.utilities.property(50);
        gen.volumeNoiseFactor = fc.utilities.property(0.3);
        gen.filter = fc.utilities.property(function(date) {
            return !(date.getDay() === 0 || date.getDay() === 6);
        });

        return gen;
    };

}(fc));