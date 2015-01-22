(function(d3, fc) {
    'use strict';

    fc.scale.dateTime2 = function() {
        return dateTimeScale2();
    };

    var noGapsProvider = function() {
        var provider = {};

       /* provider.addIncludedTime = function(date, period) {
            return new Date(date.getTime() + period);
        }*/

        // returns the number of included milliseconds (i.e. those which do not fall)
        // within discontinuities, along this scale
        provider.getIncludedMillisecondsBetween = function(startDate, endDate) {
            if (arguments.length === 1) {
                var domain = startDate;
                startDate = domain[0];
                endDate = domain[1];
            }
            return endDate.getTime() - startDate.getTime()
        }

        return provider;
    }

    function dateTimeScale2(linear, discontinuityProvider) {

        if (!arguments.length) {
            linear = d3.time.scale();
            discontinuityProvider = noGapsProvider()
        }

        function scale(x) {
            var totalDataRange = discontinuityProvider.getIncludedMillisecondsBetween(linear.domain())
            //linear.domain()[1].getTime() - linear.domain()[0].getTime();
            var distanceToX = x.getTime() - linear.domain()[0].getTime();
            var ratioToX = distanceToX / totalDataRange;
            var scaledByRange = ratioToX * (linear.range()[1] - linear.range()[0]) + linear.range()[0];
            return scaledByRange;
            //return linear(x);
        }

        scale.invert = function(x) {
            return linear.invert(x);
        };

        scale.domain = function(x) {
            if (!arguments.length) {
                return linear.domain();
            }
            linear.domain(x);
            return scale;
        };

        scale.nice = function() {
            linear.nice();
        }

        scale.copy = function() {
            return dateTimeScale2(linear.copy(), discontinuityProvider);
        }

        scale.ticks = function(n) {
            return linear.ticks(n);
        }


        scale.tickFormat = function(count) {
            return linear.tickFormat(count);
        };


        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp');
    }

}(d3, fc));