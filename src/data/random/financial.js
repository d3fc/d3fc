import walk from './walk';

export default function() {

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

        var prices = walk()
            .period(years)
            .steps(days * stepsPerDay)
            .mu(mu)
            .sigma(sigma)(startPrice);

        var volumes = walk()
            .period(years)
            .steps(days)
            .mu(0)
            .sigma(sigma)(startVolume);

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
}
