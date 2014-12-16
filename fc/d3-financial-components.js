/* globals window */

/**
 * A collection of components that make it easy to build interactive financial charts with D3
 *
 * @namespace fc
 */
window.fc = {
    version: '0.0.0',
    /**
     * Studies, trend-lines and other financial indicators that can be added to a chart
     *
     * @namespace fc.indicators
     */
    indicators: {},
    /**
     * Useful complex scales which add to the D3 scales in terms of render quality.
     * Also, complex financial scales that can be added to a chart
     *
     * @namespace fc.scale
     */
    scale: {},
    series: {},
    tools: {},
    /**
     * Utility components to shorted long winded implementations of common operations.
     * Also includes components for mock data generation and layout.
     *
     * @namespace fc.utilities
     */
    utilities: {}
};
(function(d3, fc) {
    'use strict';

    fc.utilities.chartLayout = function() {

        // Default values
        var margin = {top: 20, right: 40, bottom: 20, left: 40},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        var chartLayout = function(selection) {
            // Select the first element in the selection
            // If the selection contains more than 1 element,
            // only the first will be used, the others will be ignored
            var element = selection.node(),
                style = getComputedStyle(element);

            // Attempt to automatically size the chart to the selected element
            if (defaultWidth === true) {
                // Set the width of the chart to the width of the selected element,
                // excluding any margins, padding or borders
                var paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
                width = element.clientWidth - paddingWidth;

                // If the new width is too small, use a default width
                if (chartLayout.innerWidth() < 1) {
                    width = 800 + margin.left + margin.right;
                }
            }

            if (defaultHeight === true) {
                // Set the height of the chart to the height of the selected element,
                // excluding any margins, padding or borders
                var paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
                height = element.clientHeight - paddingHeight;

                // If the new height is too small, use a default height
                if (chartLayout.innerHeight() < 1) {
                    height = 400 + margin.top + margin.bottom;
                }
            }

            // Create svg
            var svg = d3.select(element).append('svg')
                .attr('width', width)
                .attr('height', height);

            // Create group for the chart
            var chart = svg.append('g')
                .attr('class', 'chartArea')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // Clipping path
            chart.append('defs').append('clipPath')
                .attr('id', 'plotAreaClip_' + element.id)
                .append('rect')
                .attr({width: chartLayout.innerWidth(), height: chartLayout.innerHeight()});

            // Create a background element
            chart.append('rect')
                .attr('class', 'background')
                .attr('width', chartLayout.innerWidth())
                .attr('height', chartLayout.innerHeight());

            // Create plot area, using the clipping path
            chart.append('g')
                .attr('clip-path', 'url(#plotAreaClip_' + element.id + ')')
                .attr('class', 'plotArea');

            // Create containers for the axes
            chart.append('g')
                .attr('class', 'axis bottom')
                .attr('transform', 'translate(0,' + chartLayout.innerHeight() + ')');
            chart.append('g')
                .attr('class', 'axis top')
                .attr('transform', 'translate(0, 0)');
            chart.append('g')
                .attr('class', 'axis left')
                .attr('transform', 'translate(0, 0)');
            chart.append('g')
                .attr('class', 'axis right')
                .attr('transform', 'translate(' + chartLayout.innerWidth() + ', 0)');

        };

        chartLayout.marginTop = function(value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return chartLayout;
        };

        chartLayout.marginRight = function(value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return chartLayout;
        };

        chartLayout.marginBottom = function(value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return chartLayout;
        };

        chartLayout.marginLeft = function(value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return chartLayout;
        };

        chartLayout.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return chartLayout;
        };

        chartLayout.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return chartLayout;
        };

        chartLayout.innerWidth = function() {
            return width - margin.left - margin.right;
        };

        chartLayout.innerHeight = function() {
            return height - margin.top - margin.bottom;
        };

        chartLayout.getSVG = function(setupArea) {
            return setupArea.select('svg');
        };

        chartLayout.getChartArea = function(setupArea) {
            return chartLayout.getSVG(setupArea).select('.chartArea');
        };

        chartLayout.getPlotArea = function(setupArea) {
            return chartLayout.getSVG(setupArea).select('.plotArea');
        };

        chartLayout.getAxisContainer = function(setupArea, orientation) {
            return chartLayout.getSVG(setupArea).select('.axis.' + orientation);
        };

        chartLayout.getPlotAreaBackground = function(setupArea) {
            return chartLayout.getSVG(setupArea).select('.chartArea rect.background');
        };

        return chartLayout;
    };
}(d3, fc));
(function(fc) {
    'use strict';

    /**
    * This component can be used to generate mock/fake daily market data for use with the chart
    * data series components. This component does not act on a D3 selection in the same way as
    * the other components.
    *
    * @type {object}
    * @memberof fc.utilities
    * @namespace fc.utilities.dataGenerator
    */
    fc.utilities.dataGenerator = function() {

        var mu = 0.1,
            sigma = 0.1,
            startingPrice = 100,
            startingVolume = 100000,
            intraDaySteps = 50,
            volumeNoiseFactor = 0.3,
            seedDate = new Date(),
            currentDate = new Date(seedDate.getTime()),
            useFakeBoxMuller = false,
            filter = function(date) {
                return !(date.getDay() === 0 || date.getDay() === 6);
            };

        var randomSeed = (new Date()).getTime(),
            randomGenerator = null;

        var generatePrices = function(period, steps) {
            var increments = generateIncrements(period, steps, mu, sigma),
                i, prices = [];
            prices[0] = startingPrice;

            for (i = 1; i < increments.length; i += 1) {
                prices[i] = prices[i - 1] * increments[i];
            }
            return prices;
        };

        var generateVolumes = function(period, steps) {
            var increments = generateIncrements(period, steps, 0, 1),
                i, volumes = [];

            volumeNoiseFactor = Math.max(0, Math.min(volumeNoiseFactor, 1));
            volumes[0] = startingVolume;

            for (i = 1; i < increments.length; i += 1) {
                volumes[i] = volumes[i - 1] * increments[i];
            }
            volumes = volumes.map(function(vol) {
                return Math.floor(vol * (1 - volumeNoiseFactor + randomGenerator.next() * volumeNoiseFactor * 2));
            });
            return volumes;
        };

        var generateIncrements = function(period, steps, mu, sigma) {
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

        var random = function(seed) {

            var m = 0x80000000, // 2**31;
                a = 1103515245,
                c = 12345;

            return {
                state: seed ? seed : Math.floor(Math.random() * (m - 1)),
                next: function() {
                    this.state = (a * this.state + c) % m;
                    return this.state / (m - 1);
                }
            };
        };

        var boxMullerTransform = function() {
            var x = 0, y = 0, rds, c;

            // Get two random numbers from -1 to 1.
            // If the radius is zero or greater than 1, throw them out and pick two new ones
            do {
                x = randomGenerator.next() * 2 - 1;
                y = randomGenerator.next() * 2 - 1;
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
            return (randomGenerator.next() * 2 - 1) +
                (randomGenerator.next() * 2 - 1) +
                (randomGenerator.next() * 2 - 1);
        };

        var generate = function(dataCount) {

            var toDate = new Date(currentDate.getTime());
            toDate.setUTCDate(toDate.getUTCDate() + dataCount);

            var millisecondsPerYear = 3.15569e10,
                rangeYears = (toDate.getTime() - seedDate.getTime()) / millisecondsPerYear,
                daysIncluded = 0,
                prices,
                volume,
                ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            if (!randomGenerator) {
                randomGenerator = random(randomSeed);
            }

            var date = new Date(seedDate.getTime());
            while (date <= toDate) {
                if (!filter || filter(date)) {
                    daysIncluded += 1;
                }
                date.setUTCDate(date.getUTCDate() + 1);
            }

            prices = generatePrices(rangeYears, daysIncluded * intraDaySteps);
            volume = generateVolumes(rangeYears, daysIncluded);

            date = new Date(currentDate.getTime());
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
            currentDate = new Date(date.getTime());

            return ohlcv;
        };

        var dataGenerator = function(selection) {
        };

        /**
        * Used to trigger the generation of data once generation parameters have been set.
        *
        * @memberof fc.utilities.dataGenerator
        * @method generate
        * @param {integer} dataCount the number of days to generate data for.
        * @returns the generated data in a format suitable for the chart series components.
        * This constitutes and array of objects with the following fields: date, open, high,
        * low, close, volume. The data will be spaced as daily data with each date being a
        * weekday.
        */
        dataGenerator.generate = function(dataCount) {
            return generate(dataCount);
        };

        /**
        * Used to get/set the `mu` property for the brownian motion calculation this dictates the
        * deviation in the standard deviation part of the calculation.
        *
        * @memberof fc.utilities.dataGenerator
        * @method mu
        * @param {decimal} value the standard deviation for the generation equation.
        * @returns the current value if a value is not specified. The default value is 0.1.
        */
        dataGenerator.mu = function(value) {
            if (!arguments.length) {
                return mu;
            }
            mu = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the `sigma` property for the brownian motion calculation this dictates the
        * offset in the standard deviation part of the calculation.
        *
        * @memberof fc.utilities.dataGenerator
        * @method sigma
        * @param {decimal} value the offset for the generation equation.
        * @returns the current value if a value is not specified. The default value is 0.1.
        */
        dataGenerator.sigma = function(value) {
            if (!arguments.length) {
                return sigma;
            }
            sigma = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the starting price which provides the reference point for the generation of
        * the data that follows.
        *
        * @memberof fc.utilities.dataGenerator
        * @method startingPrice
        * @param {decimal} value the starting price for data generation.
        * @returns the current value if a value is not specified. The default value is 100.
        */
        dataGenerator.startingPrice = function(value) {
            if (!arguments.length) {
                return startingPrice;
            }
            startingPrice = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the starting volume which provides the reference point for the generation of
        * the data that follows.
        *
        * @memberof fc.utilities.dataGenerator
        * @method startingVolume
        * @param {decimal} value the starting volume for data generation.
        * @returns the current value if a value is not specified. The default value is 100000.
        */
        dataGenerator.startingVolume = function(value) {
            if (!arguments.length) {
                return startingVolume;
            }
            startingVolume = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the number of data points (tick) calculated for each daily data period.
        *
        * @memberof fc.utilities.dataGenerator
        * @method intraDaySteps
        * @param {decimal} value the number of ticks to evaluate within each daily data set.
        * @returns the current value if a value is not specified. The default value is 50.
        */
        dataGenerator.intraDaySteps = function(value) {
            if (!arguments.length) {
                return intraDaySteps;
            }
            intraDaySteps = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the noise factor for the volume data generator. The volume data is generated
        * randomly within the range the start value +/- the noise factor.
        *
        * @memberof fc.utilities.dataGenerator
        * @method volumeNoiseFactor
        * @param {decimal} value multiplier (factor) for noise added to the random volume data generator.
        * @returns the current value if a value is not specified. The default value is 0.3.
        */
        dataGenerator.volumeNoiseFactor = function(value) {
            if (!arguments.length) {
                return volumeNoiseFactor;
            }
            volumeNoiseFactor = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the data filter function. The function passed to this property have each date sent
        * to it and it will decide whether that date should appear in the final dataset. The default function
        * will filter weekends, but it is user configurable.
        *
        * @memberof fc.utilities.dataGenerator
        * @method filter
        * @param {function} value a function which will receive a date object and return a boolean to flag
        * whether a date should be included in the data set or not.
        * @returns the current function if a function is not specified. The default function is
        * <pre><code>function(date) { return !(date.getDay() === 0 || date.getDay() === 6); };</code></pre>
        */
        dataGenerator.filter = function(value) {
            if (!arguments.length) {
                return filter;
            }
            filter = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the date the data runs from.
        *
        * @memberof fc.utilities.dataGenerator
        * @method seedDate
        * @param {date} value the date of the first data item in the data set.
        * @returns the current value if a value is not specified. This property has no default value and must
        * be set before calling `generate()`.
        */
        dataGenerator.seedDate = function(value) {
            if (!arguments.length) {
                return seedDate;
            }
            seedDate = value;
            currentDate = seedDate;
            randomGenerator = null;
            return dataGenerator;
        };

        /**
        * Used to get/set the seed value for the Random Number Generator used to create the data.
        *
        * @memberof fc.utilities.dataGenerator
        * @method randomSeed
        * @param {decimal} value the seed used for the Random Number Generator.
        * @returns the current value if a value is not specified. If not set then the default seed will be the
        * current time as a timestamp in milliseconds.
        */
        dataGenerator.randomSeed = function(value) {
            if (!arguments.length) {
                return randomSeed;
            }
            randomSeed = value;
            randomGenerator = null;
            return dataGenerator;
        };

        return dataGenerator;
    };


}(fc));
(function(d3, fc) {
    'use strict';

    /**
    * This component provides a utility which allows other component to fail gracefully should a value
    * be passed for a data fields which does not exist in the data set.
    *
    * @type {function}
    * @memberof fc.utilities
    * @namespace fc.utilities.valueAccessor
    * @param {string} propertyName the name of the property in the data set we are trying to use.
    * @returns a function which returns the value of the named property/field from the data item if it exists or 0
    * if it does not. Should it not exist the function will also log a message in the JavaScript console.
    */
    fc.utilities.valueAccessor = function(propertyName) {
        return function(d) {
            if (d.hasOwnProperty(propertyName)) {
                return d[propertyName];
            } else {
                if (typeof console === 'object') {
                    console.warn('The property with name ' + propertyName + ' was not found on the data object');
                }
                return 0;
            }
        };
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    /**
    * This component calculates and draws Bollinger
    *  bands on a data series, calculated using a moving average and a standard deviation value.
    *
    * @type {object}
    * @memberof fc.indicators
    * @namespace fc.indicators.bollingerBands
    */
    fc.indicators.bollingerBands = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var yValue = fc.utilities.valueAccessor('close'),
            movingAverage = 20,
            standardDeviations = 2;

        var cssBandArea = 'band-area',
            cssBandUpper = 'band-upper',
            cssBandLower = 'band-lower',
            cssAverage = 'moving-average';

        /**
        * Constructs a new instance of the bollinger bands component.
        *
        * @memberof fc.indicators.bollingerBands
        * @param {selection} selection a D3 selection
        */
        var bollingerBands = function(selection) {

            var areaBands = d3.svg.area(),
                lineUpper = d3.svg.line(),
                lineLower = d3.svg.line(),
                lineAverage = d3.svg.line();

            areaBands.x(function(d) { return xScale(d.date); });
            lineUpper.x(function(d) { return xScale(d.date); });
            lineLower.x(function(d) { return xScale(d.date); });
            lineAverage.x(function(d) { return xScale(d.date); });

            var calculateMovingAverage = function(data, i) {

                if (movingAverage === 0) {
                    return yValue(data[i]);
                }

                var count = Math.min(movingAverage, i + 1),
                first = i + 1 - count;

                var sum = 0;
                for (var index = first; index <= i; ++index) {
                    var x = yValue(data[index]);
                    sum += x;
                }

                return sum / count;
            };

            var calculateMovingStandardDeviation = function(data, i, avg) {

                if (movingAverage === 0) {
                    return 0;
                }

                var count = Math.min(movingAverage, i + 1),
                    first = i + 1 - count;

                var sum = 0;
                for (var index = first; index <= i; ++index) {
                    var x = yValue(data[index]);
                    var dx = x - avg;
                    sum += (dx * dx);
                }

                var variance = sum / count;
                return Math.sqrt(variance);
            };

            selection.each(function(data) {

                var bollingerData = {};
                for (var index = 0; index < data.length; ++index) {

                    var date = data[index].date;

                    var avg = calculateMovingAverage(data, index);
                    var sd = calculateMovingStandardDeviation(data, index, avg);

                    bollingerData[date] = {avg: avg, sd: sd};
                }

                areaBands.y0(function(d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg + (sd * standardDeviations));
                });

                areaBands.y1(function(d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg - (sd * standardDeviations));
                });

                lineUpper.y(function(d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg + (sd * standardDeviations));
                });

                lineLower.y(function(d) {

                    var avg = bollingerData[d.date].avg;
                    var sd = bollingerData[d.date].sd;

                    return yScale(avg - (sd * standardDeviations));
                });

                lineAverage.y(function(d) {

                    var avg = bollingerData[d.date].avg;

                    return yScale(avg);
                });

                var prunedData = [];
                for (var n = movingAverage; n < data.length; ++n) {
                    prunedData.push(data[n]);
                }

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                var container = d3.select(this).selectAll('.bollinger-series').data([data]);
                container.enter()
                    .append('g')
                    .classed('bollinger-series', true);

                // create a data-join for each element of the band
                var pathArea = container
                    .selectAll('.' + cssBandArea)
                    .data([prunedData]);
                var pathUpper = container
                    .selectAll('.' + cssBandUpper)
                    .data([prunedData]);
                var pathLower = container
                    .selectAll('.' + cssBandLower)
                    .data([prunedData]);
                var pathAverage = container
                    .selectAll('.' + cssAverage)
                    .data([prunedData]);

                // enter
                pathArea.enter().append('path');
                pathUpper.enter().append('path');
                pathLower.enter().append('path');
                pathAverage.enter().append('path');

                // update
                pathArea.attr('d', areaBands)
                    .classed(cssBandArea, true);
                pathUpper.attr('d', lineUpper)
                    .classed(cssBandUpper, true);
                pathLower.attr('d', lineLower)
                    .classed(cssBandLower, true);
                pathAverage.attr('d', lineAverage)
                    .classed(cssAverage, true);

                // exit
                pathArea.exit().remove();
                pathUpper.exit().remove();
                pathLower.exit().remove();
                pathAverage.exit().remove();
            });
        };

        /**
        * Specifies the X scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current X scale, which defaults to an unmodified d3.time.scale
        *
        * @memberof fc.indicators.bollingerBands
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        bollingerBands.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return bollingerBands;
        };

        /**
        * Specifies the Y scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current Y scale, which defaults to an unmodified d3.scale.linear.
        *
        * @memberof fc.indicators.bollingerBands
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        bollingerBands.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return bollingerBands;
        };

        /**
        * Specifies the name of the data field which the component will follow. If not specified,
        * returns the current data field, which defaults to 0.
        *
        * @memberof fc.indicators.bollingerBands
        * @method yValue
        * @param {accessor} value a D3 accessor function which returns the Y value for a given point
        */
        bollingerBands.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return bollingerBands;
        };

        /**
        * Specifies the number of data points the component will use when calculating its moving average
        * value. If not specified, returns the current value, which defaults to 20.
        *
        * @memberof fc.indicators.bollingerBands
        * @method movingAverage
        * @param {integer} value the number of points to average
        */
        bollingerBands.movingAverage = function(value) {
            if (!arguments.length) {
                return movingAverage;
            }
            if (value >= 0) {
                movingAverage = value;
            }
            return bollingerBands;
        };

        /**
        * Specifies the number of standard deviations to use as the amplitude of the displayed bands.
        * If not specified, returns the current data field, which defaults to 2.
        *
        * @memberof fc.indicators.bollingerBands
        * @method standardDeviations
        * @param {integer} value the number of standard deviations
        */
        bollingerBands.standardDeviations = function(value) {
            if (!arguments.length) {
                return standardDeviations;
            }
            if (value >= 0) {
                standardDeviations = value;
            }
            return bollingerBands;
        };

        return bollingerBands;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';


    /**
    * A moving average is an indicator that smooths out fluctuations in data. This component draws
    * a simple moving average line on a chart for a given data field, averaging the previous 5
    * points by default.
    *
    * @type {object}
    * @memberof fc.indicators
    * @namespace fc.indicators.movingAverage
    */
    fc.indicators.movingAverage = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = fc.utilities.valueAccessor('close'),
            averagePoints = 5,
            css = 'moving-average';

        /**
        * Constructs a new instance of the moving average component.
        *
        * @memberof fc.indicators.movingAverage
        * @param {selection} selection a D3 selection
        */
        var movingAverage = function(selection) {
            var line = d3.svg.line();
            line.defined(function(d, i) { return i >= averagePoints; });
            line.x(function(d) { return xScale(d.date); });

            selection.each(function(data) {

                if (averagePoints === 0) {
                    line.y(function(d) { return yScale(yValue(d)); });
                } else {
                    line.y(function(d, i) {
                        var first = i + 1 - averagePoints;
                        var sum = 0;
                        for (var index = first; index <= i; ++index) {
                            sum += yValue(data[index]);
                        }
                        var mean = sum / averagePoints;

                        return yScale(mean);
                    });
                }

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                var container = d3.select(this)
                    .selectAll('.' + css)
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed(css, true);

                // create a data-join for the path
                var path = container
                    .selectAll('path')
                    .data([data]);

                // enter
                path.enter()
                    .append('path');

                // update
                path.attr('d', line)
                    .classed(css, true);

                // exit
                path.exit()
                    .remove();
            });
        };

        /**
        * Specifies the X scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current X scale, which defaults to an unmodified d3.time.scale
        *
        * @memberof fc.indicators.movingAverage
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        movingAverage.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return movingAverage;
        };

        /**
        * Specifies the Y scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current Y scale, which defaults to an unmodified d3.scale.linear.
        *
        * @memberof fc.indicators.movingAverage
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        movingAverage.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return movingAverage;
        };

        /**
        * Specifies the name of the data field which the component will follow. If not specified,
        * returns the 'close' property of each datapoint.
        *
        * @memberof fc.indicators.movingAverage
        * @method yValue
        * @param {accessor} value a D3 accessor function which returns the Y value for a given point
        */
        movingAverage.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return movingAverage;
        };

        /**
        * Specifies the number of data points the tracker will use when calculating its moving average value.
        * If not specified, returns the current value, which defaults to 5.
        *
        * @memberof fc.indicators.movingAverage
        * @method averagePoints
        * @param {integer} value the number of points to average
        */
        movingAverage.averagePoints = function(value) {
            if (!arguments.length) {
                return averagePoints;
            }
            if (value >= 0) {
                averagePoints = value;
            }
            return movingAverage;
        };

        return movingAverage;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    /**
    * This component will generate an RSI data series on
    * a chart based on data generated in the format produced by the dataGenerator component.
    *
    * @type {object}
    * @memberof fc.indicators
    * @namespace fc.indicators.rsi
    */
    fc.indicators.rsi = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            samplePeriods = 14,
            upperMarker = 70,
            lowerMarker = 30,
            lambda = 1.0,
            css = 'rsi',
            yValue = fc.utilities.valueAccessor('close');

        var upper = null,
            centre = null,
            lower = null;

        /**
        * Constructs a new instance of the RSI component.
        *
        * @memberof fc.indicators.rsi
        * @param {selection} selection a D3 selection
        */
        var rsi = function(selection) {

            selection.selectAll('.marker').remove();

            upper = selection.append('line')
                .attr('class', 'marker upper')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(upperMarker))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(upperMarker));

            centre = selection.append('line')
                .attr('class', 'marker centre')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(50))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(50));

            lower = selection.append('line')
                .attr('class', 'marker lower')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(lowerMarker))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(lowerMarker));

            var line = d3.svg.line();
            line.x(function(d) { return xScale(d.date); });

            selection.each(function(data) {

                if (samplePeriods === 0) {
                    line.y(function(d) { return yScale(0); });
                } else {
                    line.y(function(d, i) {
                        var from = i - samplePeriods,
                        to = i,
                        up = [],
                        down = [];

                        if (from < 1) {
                            from = 1;
                        }

                        for (var offset = to; offset >= from; offset--) {
                            var dnow = data[offset],
                            dprev = data[offset - 1];

                            var weight = Math.pow(lambda, offset);
                            up.push(yValue(dnow) > yValue(dprev) ? (yValue(dnow) - yValue(dprev)) * weight : 0);
                            down.push(yValue(dnow) < yValue(dprev) ? (yValue(dprev) - yValue(dnow)) * weight : 0);
                        }

                        if (up.length <= 0 || down.length <= 0) {
                            return yScale(0);
                        }

                        var rsi = 100 - (100 / (1 + (d3.mean(up) / d3.mean(down))));
                        return yScale(rsi);
                    });
                }

                var path = d3.select(this).selectAll('.' + css)
                    .data([data]);

                path.enter().append('path');

                path.attr('d', line)
                    .classed(css, true);

                path.exit().remove();
            });
        };

        /**
        * Specifies the X scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current X scale, which defaults to an unmodified d3.time.scale
        *
        * @memberof fc.indicators.rsi
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        rsi.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return rsi;
        };

        /**
        * Specifies the Y scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current Y scale, which defaults to an unmodified d3.scale.linear.
        *
        * @memberof fc.indicators.rsi
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        rsi.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return rsi;
        };

        /**
        * Specifies the number of data samples used to calculate the RSI over, much like the number of
        * points for the moving average indicator. If not set the default value is 14, which is the
        * accepted value given by Wilder
        *
        * @memberof fc.indicators.rsi
        * @method samplePeriods
        * @param {integer} value the number of periods
        */
        rsi.samplePeriods = function(value) {
            if (!arguments.length) {
                return samplePeriods;
            }
            samplePeriods = value < 0 ? 0 : value;
            return rsi;
        };

        /**
        * Specifies the location of the upper marker used to mark the level at which the market/instrument is
        * considered over bought. The default value of this 70%. The value is specified as a percentage so
        * 70 as opposed to 0.7.
        *
        * @memberof fc.indicators.rsi
        * @method upperMarker
        * @param {number} value the value of the upper marker
        */
        rsi.upperMarker = function(value) {
            if (!arguments.length) {
                return upperMarker;
            }
            upperMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
            return rsi;
        };

        /**
        * Specifies the location of the lower marker used to mark the level at which the market/instrument is
        * considered over sold. The default value of this 30%. The value is specified as a percentage so 30
        * as opposed to 0.3.
        *
        * @memberof fc.indicators.rsi
        * @method lowerMarker
        * @param {number} value the value of the lower marker
        */
        rsi.lowerMarker = function(value) {
            if (!arguments.length) {
                return lowerMarker;
            }
            lowerMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
            return rsi;
        };


        /**
        * Specifies the relative influence that the samples have on the Exponential Moving average
        * calculation. A value of 1 (Default value) will mean that every data sample will have equal
        * weight in the calculation. The most widely used values are in the region 0.92 to 0.98.
        *
        * @memberof fc.indicators.rsi
        * @method lambda
        * @param {number} value the value of the lower marker
        */
        rsi.lambda = function(value) {
            if (!arguments.length) {
                return lambda;
            }
            lambda = value > 1.0 ? 1.0 : (value < 0.0 ? 0.0 : value);
            return rsi;
        };

        /**
        * Specifies the name of the data field which the component will follow. If not specified,
        * returns the 'close' property of each datapoint
        *
        * @memberof fc.indicators.bollingerBands
        * @method yValue
        * @param {accessor} value a D3 accessor function which returns the Y value for a given point
        */
        rsi.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return rsi;
        };

        return rsi;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    /**
    * This component provides a scale primarily used on the X axis of financial charts and
    * implements a time scale. It allows for the removal of time periods where the market may
    * be closed, namely weekends.
    * This scale also contains an option to pixel align when calculating the screen pixel from
    * the real value. This generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @namespace fc.scale.dateTime
    */
    fc.scale.dateTime = function() {
        return dateTimeScale();
    };

    /**
    * Constructs a new instance of the dateTime scale component.
    *
    * @memberof fc.scale.dateTime
    * @param {d3.scale.linear} linear used in the copy constructor to copy the base linear
    * scale between the original and the copy.
    * @param {array} baseDomain used in the copy constructor to copy the base domain (Max
    * and Min) between the original and the copy.
    * @param {boolean} alignPixels used in the copy constructor to copy the pixel alignment
    * option between the original and the copy.
    * @param {boolean} hideWeekends used in the copy constructor to copy the hide weekends
    * option between the original and the copy.
    */
    function dateTimeScale(linear, baseDomain, alignPixels, hideWeekends) {

        if (!arguments.length) {
            linear = d3.scale.linear();
            baseDomain = [new Date(0), new Date(0)];
            alignPixels = true;
            hideWeekends = false;
        }

        /**
        * Used to scale a value from domain space to pixel space. This function is used primarily
        * to position elements on the X axis.
        *
        * @memberof fc.scale.dateTime
        * @method scale
        * @param {object} x the real world domain value to be scaled.
        * @returns the converted value in pixel space. This value is also pixel aligned if the
        * relevant options are set.
        */
        function scale(x) {
            var n = 0;
            if (typeof x === 'number') {
                // When scaling ticks.
                n = linear(x);
            } else {
                // When scaling dates.
                n = linear(linearTime(x));
            }
            var m = Math.round(n);
            return alignPixels ? (n > m ? m + 0.5 : m - 0.5) : n;
        }

        /**
        * Used to set or get the domain for this scale. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.dateTime
        * @method domain
        * @param {array} domain the real world domain value as an array of 2 date objects,
        * Min and Max respectively.
        * @returns the current domain if no arguments are passed.
        */
        scale.domain = function(domain) {

            if (!arguments.length) {
                return [linearTime(baseDomain[0]), linearTime(baseDomain[1])];
            }
            if (typeof domain[0] === 'number') {
                linear.domain(domain);
            } else {
                baseDomain = createbaseDomain(domain);
                linear.domain([linearTime(baseDomain[0]), linearTime(baseDomain[1])]);
            }
            return scale;
        };

        /**
        * Used to set or get the domain for this scale from a data set. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.dateTime
        * @method domainFromValues
        * @param {array} data the data set used to evaluate Min and Max values.
        * @param {array} fields the fields within the data set used to evaluate Min and Max values.
        * @returns the current domain if no arguments are passed.
        */
        scale.domainFromValues = function(data, fields) {

            if (!arguments.length) {
                return scale.domain();
            } else {
                var mins = [],
                    maxs = [],
                    fieldIndex = 0,
                    getField = function(d) { return d[fields[fieldIndex]].getTime(); };

                for (fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
                    mins.push(d3.min(data, getField));
                    maxs.push(d3.max(data, getField));
                }

                scale.domain([
                    new Date(d3.min(mins, function(d) { return d; })),
                    new Date(d3.max(maxs, function(d) { return d; }))
                ]);
            }

            return scale;
        };

        /**
        * Used to scale a value from pixel space to domain space. This function is the inverse of
        * the `scale` function.
        *
        * @memberof fc.scale.dateTime
        * @method invert
        * @param {decimal} pixel the pixel value to be scaled.
        * @returns the converted value in real world space. In most cases this value will only be
        * accurate to the precision of the pixel width of the scale.
        */
        scale.invert = function(pixel) {
            return linearTimeInvert(linear.invert(pixel));
        };

        /**
        * Used to create a copy of the current scale. When scales are added to D3 axes the scales
        * are copied rather than a reference being stored.
        * This function facilities a deep copy.
        *
        * @memberof fc.scale.dateTime
        * @method copy
        * @returns the copy.
        */
        scale.copy = function() {
            return dateTimeScale(linear.copy(), baseDomain, alignPixels, hideWeekends);
        };

        /**
        * Used to get an array of tick mark locations which can be used to display labels and
        * tick marks on the associated axis.
        * Ticks will be aligned to the nearest date time boundary. Boundaries are listed below:
        * + Year
        * + 8 Month
        * + 4 Month
        * + 2 Month
        * + Month
        * + Week
        * + Day
        * + 12 Hour
        * + 8 Hour
        * + 4 Hour
        * + 2 Hour
        * + Hour
        * + 15 Minute
        * + Minute
        * + Second
        *
        * @memberof fc.scale.dateTime
        * @method ticks
        * @param {integer} n the number of ticks to try and display within the scale domain.
        * (This value is used as  a guide for a best fit approach)
        * @returns an array of values denoting real world positions within the scale.
        * These can be converted to pixel locations using the `scale` function.
        */
        scale.ticks = function(n) {
            return arguments.length ? function() {

                var ticks = [],
                    offsetMilli = (baseDomain[1].getTime() - baseDomain[0].getTime()) / n,
                    offset = new Date(offsetMilli),
                    start = new Date(baseDomain[0].getTime()),
                    stepFunction = function(d) {
                        d.setSeconds(d.getSeconds() + 1);
                        return d;
                    };

                // Determine sensible date division starting from the largest time period down
                if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 8) {
                    start = getYearStart(start);
                    stepFunction = function(d) {
                        d.setFullYear(d.getFullYear() + 1);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 4) { // 8 Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 8);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 2) { // 4 Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 4);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 1) { // 2 Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 2);
                        return d;
                    };
                } else if (offsetMilli >= 604800000) { // Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 86400000) { // 7 Days
                    start = getWeekStart(start);
                    stepFunction = function(d) {
                        d.setDate(d.getDate() + 7);
                        return d;
                    };
                } else if (offsetMilli >= 43200000) { // Days
                    start = getDayStart(start);
                    stepFunction = function(d) {
                        d.setDate(d.getDate() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 28800000) { // 12 Hours
                    start = getHourStart(start, 12);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 12);
                        return d;
                    };
                } else if (offsetMilli >= 14400000) { // 8 Hours
                    start = getHourStart(start, 8);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 8);
                        return d;
                    };
                } else if (offsetMilli >= 7200000) { // 4 Hours
                    start = getHourStart(start, 4);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 4);
                        return d;
                    };
                } else if (offsetMilli >= 3600000) { // 2 Hours
                    start = getHourStart(start, 4);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 2);
                        return d;
                    };
                } else if (offsetMilli >= 900000) { // Hours
                    start = getHourStart(start, 0);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 60000) { // 15 Minutes
                    start = getMinuteStart(start, 15);
                    stepFunction = function(d) {
                        d.setMinutes(d.getMinutes() + 15);
                        return d;
                    };
                } else if (offsetMilli >= 1000) { // Minutes
                    start = getMinuteStart(start, 0);
                    stepFunction = function(d) {
                        d.setMinutes(d.getMinutes() + 1);
                        return d;
                    };
                }

                var tickDate = start;
                while (tickDate.getTime() <= baseDomain[1].getTime()) {
                    if (tickDate.getTime() >= baseDomain[0].getTime()) {
                        ticks.push(linearTime(tickDate));
                    }
                    tickDate = stepFunction(tickDate);
                }

                return ticks;

            } : linear.ticks();
        };

        /**
        * Used to set the callback function used to format the data label for the associated axis tick label.
        *
        * @memberof fc.scale.dateTime
        * @method tickFormat
        * @param {integer} count
        * @param {decimal} f
        * @returns a function which returns the formatting function for the individual data item.
        */
        scale.tickFormat = function(count, f) {
            return function(n) {
                return d3.time.format('%a, %e %b')(linearTimeInvert(n));
            };
        };

        /**
        * Used to get or set the option to hide weekends. Not showing weekends is common practice on financial charts.
        *
        * @memberof fc.scale.dateTime
        * @method hideWeekends
        * @param {boolean} value if set to `true` weekends will not be shown.
        * If no value argument is passed the current setting will be returned.
        */
        scale.hideWeekends = function(value) {
            if (!arguments.length) {
                return hideWeekends;
            }
            hideWeekends = value;
            return scale;
        };

        /**
        * Used to get or set the option to align ticks to pixel columns. Pixel aligning yields crisper chart graphics.
        *
        * @memberof fc.scale.dateTime
        * @method alignPixels
        * @param {boolean} value if set to `true` values will be pixel aligned.
        * If no value argument is passed the current setting will be returned.
        */
        scale.alignPixels = function(value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        function createbaseDomain(domain) {
            var d0 = new Date(domain[0].getFullYear(), domain[0].getMonth(), domain[0].getDate(), 0, 0, 0);
            var d1 = new Date(domain[1].getFullYear(), domain[1].getMonth(), domain[1].getDate() + 2, 0, 0, 0);
            while (d0.getDay() !== 1) {
                d0.setDate(d0.getDate() - 1);
            }
            return [d0, d1];
        }

        function linearTime(date) {

            var l = 0,
                milliSecondsInWeek = 592200000,
                milliSecondsInWeekend = 172800000;

            if (hideWeekends) {
                if (date.getDay() === 0) {
                    date.setDate(date.getDate() + 1);
                }
                if (date.getDay() === 6) {
                    date.setDate(date.getDate() - 1);
                }
                var weeksFromBase = Math.floor((date.getTime() - baseDomain[0].getTime()) / milliSecondsInWeek);
                l = (date.getTime() - baseDomain[0].getTime()) - (milliSecondsInWeekend * weeksFromBase);
            } else {
                l = date.getTime() - baseDomain[0].getTime();
            }

            return l;
        }

        function linearTimeInvert(l) {

            var date = new Date(0),
                milliSecondsInShortWeek = 432000000,
                milliSecondsInWeekend = 172800000;

            if (hideWeekends) {
                var weeksFromBase = Math.floor(l / milliSecondsInShortWeek);
                date = new Date(baseDomain[0].getTime() + l + (milliSecondsInWeekend * weeksFromBase));
            } else {
                date = new Date(baseDomain[0].getTime() + l);
            }

            return date;
        }

        function getMinuteStart(d, offset) {
            d = offset > 0 ?
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), offset, 0) :
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0);
            return d;
        }

        function getHourStart(d, offset) {
            d = offset > 0 ?
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), offset, 0, 0) :
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0);
            return d;
        }

        function getDayStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            return d;
        }

        function getWeekStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            while (d.getDay() > 0) {
                d.setDate(d.getDate() - 1);
            }
            return d;
        }

        function getMonthStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
            return d;
        }

        function getYearStart(d) {
            d = new Date(d.getFullYear(), 0, 1, 0, 0, 0);
            return d;
        }

        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice');
    }
}(d3, fc));
(function(d3, fc) {
    'use strict';

    /**
    * This component provides gridlines, both horizontal and vertical linked to the respective chart scales/axes.
    * If the pixel alignment options are selected on the scales, this generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @namespace fc.scale.gridlines
    */
    fc.scale.gridlines = function() {

        var xScale = fc.scale.dateTime(),
            yScale = fc.scale.linear(),
            xTicks = 10,
            yTicks = 10;

        var xLines = function(data, grid) {
            var xlines = grid.selectAll('.x')
                .data(data);
            xlines
                .enter().append('line')
                .attr({
                    'class': 'x',
                    'x1': function(d) { return xScale(d);},
                    'x2': function(d) { return xScale(d);},
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });
            xlines
                .attr({
                    'x1': function(d) { return xScale(d);},
                    'x2': function(d) { return xScale(d);},
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });
            xlines.exit().remove();
        };

        var yLines = function(data, grid) {
            var ylines = grid.selectAll('.y')
                .data(data);
            ylines
                .enter().append('line')
                .attr({
                    'class': 'y',
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': function(d) { return yScale(d);},
                    'y2': function(d) { return yScale(d);}
                });
            ylines
                .attr({
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': function(d) { return yScale(d);},
                    'y2': function(d) { return yScale(d);}
                });
            ylines.exit().remove();
        };

        /**
        * Constructs a new instance of the gridlines component.
        *
        * @memberof fc.scale.gridlines
        * @param {selection} selection contains the D3 selection to receive the new DOM elements.
        */
        var gridlines = function(selection) {
            var grid, xTickData, yTickData;

            selection.each(function() {
                xTickData = xScale.ticks(xTicks);
                yTickData = yScale.ticks(yTicks);

                grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
                grid.enter().append('g').classed('gridlines', true);
                xLines(xTickData, grid);
                yLines(yTickData, grid);
            });
        };

        /**
        * Specifies the X scale which the gridlines component uses to locate its SVG elements.
        * If not specified, returns the current X scale, which defaults to an unmodified fc.scale.dateTime
        *
        * @memberof fc.scale.gridlines
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        gridlines.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return gridlines;
        };

        /**
        * Specifies the Y scale which the gridlines component uses to locate its SVG elements.
        * If not specified, returns the current Y scale, which defaults to an unmodified fc.scale.linear.
        *
        * @memberof fc.scale.gridlines
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        gridlines.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return gridlines;
        };

        /**
        * Specifies the number of X ticks / vertical lines used on the X scale.
        * If not specified, returns the current X ticks, which defaults to 10.
        *
        * @memberof fc.scale.gridlines
        * @method xTicks
        * @param {integer} value a D3 scale
        */
        gridlines.xTicks = function(value) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = value;
            return gridlines;
        };

        /**
        * Specifies the number of Y ticks / horizontal lines used on the Y scale.
        * If not specified, returns the current Y ticks, which defaults to 10.
        *
        * @memberof fc.scale.gridlines
        * @method yTicks
        * @param {integer} value a D3 scale
        */
        gridlines.yTicks = function(value) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = value;
            return gridlines;
        };

        return gridlines;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    var marginPercentage = 0.05;

    /**
    * This component provides a scale primarily used on the Y axis of charts and extends the d3.scale.linear
    * scale. This scale contains an option to pixel align when calculating the screen pixel from the real value.
    * This generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @namespace fc.scale.linear
    */
    fc.scale.linear = function() {
        return linearScale();
    };

    function linearScale(linear) {

        var alignPixels = true;

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        /**
        * Used to scale a value from domain space to pixel space. This function is used primarily
        * to position elements on the scales axis.
        *
        * @memberof fc.scale.linear
        * @method scale
        * @param {decimal} x the real world domain value to be scaled.
        * @returns the converted pixel aligned value in pixel space.
        */
        function scale(x) {
            var n = linear(x);
            var m = Math.round(n);
            return alignPixels ? (n > m ? m + 0.5 : m - 0.5) : n;
        }

        /**
        * Used to create a copy of the current scale. When scales are added to D3 axes the scales
        * are copied rather than a reference being stored.
        * This function facilities a deep copy.
        *
        * @memberof fc.scale.linear
        * @method copy
        * @returns the copy.
        */
        scale.copy = function() {
            return linearScale(linear.copy());
        };

        /**
        * Used to set or get the domain for this scale. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.linear
        * @method domain
        * @param {array} domain the real world domain value as an array of 2 decimal numbers,
        * Min and Max respectively.
        * @returns the current domain if no arguments are passed.
        */
        scale.domain = function(domain) {
            linear.domain(domain);
            return scale;
        };

        /**
        * Used to set or get the domain for this scale from a data set. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.dateTime
        * @method domainFromValues
        * @param {array} data the data set used to evaluate Min and Max values.
        * @param {array} fields the fields within the data set used to evaluate Min and Max values.
        * @returns the current domain if no arguments are passed.
        */
        scale.domainFromValues = function(data, fields) {

            if (!arguments.length) {
                return scale.domain();
            } else {
                var mins = [],
                    maxs = [],
                    fieldIndex = 0,
                    getField = function(d) { return d[fields[fieldIndex]]; };

                for (fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
                    mins.push(d3.min(data, getField));
                    maxs.push(d3.max(data, getField));
                }

                var min = d3.min(mins, function(d) { return d; }),
                    max = d3.max(maxs, function(d) { return d; });

                scale.domain([
                    min - ((max - min) * marginPercentage),
                    max + ((max - min) * marginPercentage)
                ]);
            }

            return scale;
        };

        /**
        * Used to get an array of tick mark locations which can be used to display labels and
        * tick marks on the associated axis.
        *
        * @memberof fc.scale.linear
        * @method ticks
        * @param {integer} n the number of ticks to try and display within the scale domain.
        * (This value is used as a guide for a best fit approach)
        * @returns an array of values denoting real world positions within the scale.
        * These can be converted to pixel locations using the `scale` function.
        */
        scale.ticks = function(n) {
            return linear.ticks(n);
        };

        /**
        * Used to scale a value from pixel space to domain space. This function is the inverse of
        * the `scale` function.
        *
        * @memberof fc.scale.linear
        * @method invert
        * @param {decimal} pixel the pixel value to be scaled.
        * @returns the converted value in real world space. In most cases this value will only be
        * accurate to the precision of the pixel width of the scale.
        */
        scale.invert = function(pixel) {
            return linear.invert(pixel);
        };

        /**
        * Used to get or set the option to align ticks to pixel columns/rows.
        * Pixel aligning yields crisper chart graphics.
        *
        * @memberof fc.scale.linear
        * @method alignPixels
        * @param {boolean} value if set to `true` values will be pixel aligned.
        * If no value argument is passed the current setting will be returned.
        */
        scale.alignPixels = function(value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice');
    }
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            barWidth = 5,
            yValue = fc.utilities.valueAccessor('volume'),
            classForBar = function(d) { return ''; };

        var bar = function(selection) {
            var series, container;

            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                container = d3.select(this)
                    .selectAll('.bar-series')
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed('bar-series', true);

                // create a data-join for each rect element
                series = container
                    .selectAll('rect')
                    .data(data);

                // enter
                series.enter()
                    .append('rect');

                // exit
                series.exit()
                    .remove();

                // update
                series.attr('x', function(d) { return xScale(d.date) - (barWidth / 2.0); })
                    .attr('y', function(d) { return yScale(yValue(d)); })
                    .attr('width', barWidth)
                    .attr('height', function(d) { return yScale(0) - yScale(yValue(d)); })
                    .attr('class', classForBar);
            });
        };

        bar.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return bar;
        };

        bar.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return bar;
        };

        bar.barWidth = function(value) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = value;
            return bar;
        };

        bar.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return bar;
        };

        bar.classForBar = function(value) {
            if (!arguments.length) {
                return classForBar;
            }
            classForBar = value;
            return bar;
        };

        return bar;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var yOpen = fc.utilities.valueAccessor('open'),
            yHigh = fc.utilities.valueAccessor('high'),
            yLow = fc.utilities.valueAccessor('low'),
            yClose = fc.utilities.valueAccessor('close');

        var rectangleWidth = 5;

        var isUpDay = function(d) {
            return yClose(d) > yOpen(d);
        };
        var isDownDay = function(d) {
            return !isUpDay(d);
        };

        var line = d3.svg.line()
            .x(function(d) {
                return d.x;
            })
            .y(function(d) {
                return d.y;
            });

        var highLowLines = function(bars) {

            var paths = bars.selectAll('.high-low-line').data(function(d) {
                return [d];
            });

            paths.enter().append('path');

            paths.classed('high-low-line', true)
                .attr('d', function(d) {
                    return line([
                        {x: xScale(d.date), y: yScale(yHigh(d))},
                        {x: xScale(d.date), y: yScale(yLow(d))}
                    ]);
                });
        };

        var rectangles = function(bars) {
            var rect;

            rect = bars.selectAll('rect').data(function(d) {
                return [d];
            });

            rect.enter().append('rect');

            rect.attr('x', function(d) {
                return xScale(d.date) - (rectangleWidth / 2.0);
            })
                .attr('y', function(d) {
                    return isUpDay(d) ? yScale(yClose(d)) : yScale(yOpen(d));
                })
                .attr('width', rectangleWidth)
                .attr('height', function(d) {
                    return isUpDay(d) ?
                        yScale(yOpen(d)) - yScale(yClose(d)) :
                        yScale(yClose(d)) - yScale(yOpen(d));
                });
        };

        var candlestick = function(selection) {
            var series, bars;

            selection.each(function(data) {
                series = d3.select(this).selectAll('.candlestick-series').data([data]);

                series.enter().append('g')
                    .classed('candlestick-series', true);

                bars = series.selectAll('.bar')
                    .data(data, function(d) {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });

                highLowLines(bars);
                rectangles(bars);

                bars.exit().remove();


            });
        };

        candlestick.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return candlestick;
        };

        candlestick.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return candlestick;
        };

        candlestick.rectangleWidth = function(value) {
            if (!arguments.length) {
                return rectangleWidth;
            }
            rectangleWidth = value;
            return candlestick;
        };

        candlestick.yOpen = function(value) {
            if (!arguments.length) {
                return yOpen;
            }
            yOpen = value;
            return candlestick;
        };

        candlestick.yHigh = function(value) {
            if (!arguments.length) {
                return yHigh;
            }
            yHigh = value;
            return candlestick;
        };

        candlestick.yLow = function(value) {
            if (!arguments.length) {
                return yLow;
            }
            yLow = value;
            return candlestick;
        };

        candlestick.yClose = function(value) {
            if (!arguments.length) {
                return yClose;
            }
            yClose = value;
            return candlestick;
        };

        return candlestick;

    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.comparison = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var cachedData, cachedScale;

        var yScaleTransform = function(oldScale, newScale) {
            // Compute transform for elements wrt changing yScale.
            var oldDomain = oldScale.domain(),
                newDomain = newScale.domain(),
                scale = (oldDomain[1] - oldDomain[0]) / (newDomain[1] - newDomain[0]),
                translate = scale * (oldScale.range()[1] - oldScale(newDomain[1]));
            return {
                translate: translate,
                scale: scale
            };
        };

        var findIndex = function(seriesData, date) {
            // Find insertion point for date in seriesData.
            var bisect = d3.bisector(
                function(d) {
                    return d.date;
                }).left;

            var initialIndex = bisect(seriesData, date);
            if (initialIndex === 0) {
                // Google finance style, calculate changes from the
                // date one before initial date if possible, or index 0.
                initialIndex += 1;
            }
            return initialIndex;
        };

        var percentageChange = function(seriesData, initialDate) {
            // Computes the percentage change data of a series from an initial date.
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialClose = seriesData[initialIndex].close;

            return seriesData.map(function(d) {
                return {
                    date: d.date,
                    change: (d.close / initialClose) - 1
                };
            });
        };

        var rebaseChange = function(seriesData, initialDate) {
            // Change the initial date the percentage changes should be based from.
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialChange = seriesData[initialIndex].change;

            return seriesData.map(function(d) {
                return {
                    date: d.date,
                    change: d.change - initialChange
                };
            });
        };

        var calculateYDomain = function(data, xDomain) {
            var start, end;

            data = data.map(function(series) {
                series = series.data;
                start = findIndex(series, xDomain[0]) - 1;
                end = findIndex(series, xDomain[1]) + 1;
                return series.slice(start, end);
            });

            var allPoints = data.reduce(function(prev, curr) {
                return prev.concat(curr);
            }, []);

            if (allPoints.length) {
                return d3.extent(allPoints, function(d) {
                    return d.change;
                });
            } else {
                return [0, 0];
            }
        };

        var color = d3.scale.category10();

        var line = d3.svg.line()
            .interpolate('linear')
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.change);
            });

        var comparison = function(selection) {
            var series, lines;

            selection.each(function(data) {

                data = data.map(function(d) {
                    return {
                        name: d.name,
                        data: percentageChange(d.data, xScale.domain()[0])
                    };
                });

                cachedData = data; // Save for rebasing.

                color.domain(data.map(function(d) {
                    return d.name;
                }));

                yScale.domain(calculateYDomain(data, xScale.domain()));
                cachedScale = yScale.copy();

                series = d3.select(this).selectAll('.comparison-series').data([data]);
                series.enter().append('g').classed('comparison-series', true);

                lines = series.selectAll('.line')
                    .data(data, function(d) {
                        return d.name;
                    })
                    .enter().append('path')
                    .attr('class', function(d) {
                        return 'line ' + 'line' + data.indexOf(d);
                    })
                    .attr('d', function(d) {
                        return line(d.data);
                    })
                    .style('stroke', function(d) {
                        return color(d.name);
                    });

                series.selectAll('.line')
                    .attr('d', function(d) {
                        return line(d.data);
                    });
            });
        };

        comparison.geometricZoom = function(selection, xTransformTranslate, xTransformScale) {
            // Apply a transformation for each line to update its position wrt the new initial date,
            // then apply the yScale transformation to reflect the updated yScale domain.

            var initialIndex,
                yTransform;

            var lineTransform = function(initialChange) {
                var yTransformLineTranslate = cachedScale(0) - cachedScale(initialChange);

                yTransformLineTranslate *= yTransform.scale;
                yTransformLineTranslate += yTransform.translate;

                return 'translate(' + xTransformTranslate + ',' + yTransformLineTranslate + ')' +
                    ' scale(' + xTransformScale + ',' + yTransform.scale + ')';
            };

            var domainData = cachedData.map(function(d) {
                return {
                    name: d.name,
                    data: rebaseChange(d.data, xScale.domain()[0])
                };
            });

            yScale.domain(calculateYDomain(domainData, xScale.domain()));
            yTransform = yScaleTransform(cachedScale, yScale);

            cachedData = cachedData.map(function(d) {
                initialIndex = findIndex(d.data, xScale.domain()[0]) - 1;
                return {
                    name: d.name,
                    data: d.data,
                    transform: lineTransform(d.data[initialIndex].change)
                };
            });

            selection.selectAll('.line')
                .data(cachedData)
                .attr('transform', function(d) { return d.transform; });
        };

        comparison.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return comparison;
        };

        comparison.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return comparison;
        };

        return comparison;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        var xValue = fc.utilities.valueAccessor('date'),
            yValue = fc.utilities.valueAccessor('close'),
            xScale = fc.scale.dateTime(),
            yScale = fc.scale.linear(),
            underFill = true,
            css = 'line-series';

        var line = function(selection) {

            var area;

            if (underFill) {
                area = d3.svg.area()
                    .x(function(d) { return xScale(xValue(d)); })
                    .y0(yScale(0));
            }

            var line = d3.svg.line();
            line.x(function(d) { return xScale(xValue(d)); });

            selection.each(function(data) {


                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                var container = d3.select(this)
                    .selectAll('.' + css)
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed(css, true);

                if (underFill) {
                    area.y1(function(d) { return yScale(yValue(d)); });

                    var areapath = container
                        .selectAll('.area')
                        .data([data]);

                    // enter
                    areapath.enter()
                        .append('path');

                    // update
                    areapath.attr('d', area)
                        .classed('area', true);

                    // exit
                    areapath.exit()
                        .remove();
                }

                line.y(function(d) { return yScale(yValue(d)); });
                var linepath = container
                    .selectAll('.line')
                    .data([data]);

                // enter
                linepath.enter()
                    .append('path');

                // update
                linepath.attr('d', line)
                    .classed('line', true);

                // exit
                linepath.exit()
                    .remove();
            });
        };

        line.xValue = function(value) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = value;
            return line;
        };

        line.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return line;
        };

        line.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return line;
        };

        line.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return line;
        };

        line.underFill = function(value) {
            if (!arguments.length) {
                return underFill;
            }
            underFill = value;
            return line;
        };

        return line;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        // Configurable attributes
        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            tickWidth = 5;

        var yOpen = fc.utilities.valueAccessor('open'),
            yHigh = fc.utilities.valueAccessor('high'),
            yLow = fc.utilities.valueAccessor('low'),
            yClose = fc.utilities.valueAccessor('close');

        // Function to return
        var ohlc;

        // Accessor functions
        var open = function(d) {
                return yScale(yOpen(d));
            },
            high = function(d) {
                return yScale(yHigh(d));
            },
            low = function(d) {
                return yScale(yLow(d));
            },
            close = function(d) {
                return yScale(yClose(d));
            },
            date = function(d) {
                return xScale(d.date);
            };

        // Up/down day logic
        var isUpDay = function(d) {
            return yClose(d) > yOpen(d);
        };
        var isDownDay = function(d) {
            return yClose(d) < yOpen(d);
        };
        var isStaticDay = function(d) {
            return yClose(d) === yOpen(d);
        };

        var barColour = function(d) {
            if (isUpDay(d)) {
                return 'green';
            } else if (isDownDay(d)) {
                return 'red';
            } else {
                return 'black';
            }
        };

        // Path drawing
        var makeBarPath = function(d) {
            var moveToLow = 'M' + date(d) + ',' + low(d),
                verticalToHigh = 'V' + high(d),
                openTick = 'M' + date(d) + ',' + open(d) + 'h' + (-tickWidth),
                closeTick = 'M' + date(d) + ',' + close(d) + 'h' + tickWidth;
            return moveToLow + verticalToHigh + openTick + closeTick;
        };

        var makeConcatPath = function(data) {
            var path = 'M0,0';
            data.forEach(function(d) {
                path += makeBarPath(d);
            });
            return path;
        };

        // Filters data, and draws a series of ohlc bars from the result as a single path.
        var makeConcatPathElement = function(series, elementClass, colour, data, filterFunction) {
            var concatPath;
            var filteredData = data.filter(function(d) {
                return filterFunction(d);
            });
            concatPath = series.selectAll('.' + elementClass)
                .data([filteredData]);

            concatPath.enter()
                .append('path')
                .classed(elementClass, true);

            concatPath
                .attr('d', makeConcatPath(filteredData))
                .attr('stroke', colour);


            concatPath.exit().remove();
        };

        // Common series element
        var makeSeriesElement = function(selection, data) {
            var series = d3.select(selection).selectAll('.ohlc-series').data([data]);
            series.enter().append('g').classed('ohlc-series', true);
            return series;
        };

        // Draw ohlc bars as groups of svg lines
        var ohlcLineGroups = function(selection) {
            selection.each(function(data) {
                var series = makeSeriesElement(this, data);

                var bars = series.selectAll('.bar')
                    .data(data, function(d) {
                        return d.date;
                    });

                // Enter
                var barEnter = bars.enter().append('g').classed('bar', true);
                barEnter.append('line').classed('high-low-line', true);
                barEnter.append('line').classed('open-tick', true);
                barEnter.append('line').classed('close-tick', true);

                // Update
                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay,
                    'static-day': isStaticDay
                });

                bars.attr('stroke', barColour);

                bars.select('.high-low-line').attr({x1: date, y1: low, x2: date, y2: high});
                bars.select('.open-tick').attr({
                    x1: function(d) { return date(d) - tickWidth; },
                    y1: open,
                    x2: date,
                    y2: open
                });
                bars.select('.close-tick').attr({
                    x1: date,
                    y1: close,
                    x2: function(d) { return date(d) + tickWidth; },
                    y2: close
                });

                // Exit
                bars.exit().remove();
            });
        };

        // Draw ohlc bars as svg paths
        var ohlcBarPaths = function(selection) {
            selection.each(function(data) {
                var series = makeSeriesElement(this, data);

                var bars = series.selectAll('.bar')
                    .data(data, function(d) {
                        return d.date;
                    });

                bars.enter()
                    .append('path')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay,
                    'static-day': isStaticDay
                });

                bars.attr({
                    'stroke': barColour,
                    'd': makeBarPath
                });

                bars.exit().remove();
            });
        };

        // Draw the complete series of ohlc bars using 3 paths
        var ohlcConcatBarPaths = function(selection) {
            selection.each(function(data) {
                var series = makeSeriesElement(this, data);
                makeConcatPathElement(series, 'up-day', 'green', data, isUpDay);
                makeConcatPathElement(series, 'down-day', 'red', data, isDownDay);
                makeConcatPathElement(series, 'static-day', 'black', data, isStaticDay);
            });
        };

        switch (drawMethod) {
            case 'line': ohlc = ohlcLineGroups; break;
            case 'path': ohlc = ohlcBarPaths; break;
            case 'paths': ohlc = ohlcConcatBarPaths; break;
            default: ohlc = ohlcBarPaths;
        }

        ohlc.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return ohlc;
        };

        ohlc.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return ohlc;
        };

        ohlc.tickWidth = function(value) {
            if (!arguments.length) {
                return tickWidth;
            }
            tickWidth = value;
            return ohlc;
        };

        ohlc.yOpen = function(value) {
            if (!arguments.length) {
                return yOpen;
            }
            yOpen = value;
            return ohlc;
        };

        ohlc.yHigh = function(value) {
            if (!arguments.length) {
                return yHigh;
            }
            yHigh = value;
            return ohlc;
        };

        ohlc.yLow = function(value) {
            if (!arguments.length) {
                return yLow;
            }
            yLow = value;
            return ohlc;
        };

        ohlc.yClose = function(value) {
            if (!arguments.length) {
                return yClose;
            }
            yClose = value;
            return ohlc;
        };

        return ohlc;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var index = 0,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yLabel = '',
            yValue = 0,
            padding = 2,
            formatCallout = function(d) { return d; };

        var root = null,
            line = null,
            callout = null;

        var annotation = function(selection) {

            root = selection.append('g')
                .attr('id', 'annotation_' + index)
                .attr('class', 'annotation');

            line = root.append('line')
                .attr('class', 'marker')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(yValue))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(yValue));


            callout = root.append('text')
                .attr('class', 'callout')
                .attr('x', xScale.range()[1] - padding)
                .attr('y', yScale(yValue) - padding)
                .attr('style', 'text-anchor: end;')
                .text(yLabel + ': ' + formatCallout(yValue));
        };

        annotation.index = function(value) {
            if (!arguments.length) {
                return index;
            }
            index = value;
            return annotation;
        };

        annotation.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return annotation;
        };

        annotation.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return annotation;
        };

        annotation.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return annotation;
        };

        annotation.yLabel = function(value) {
            if (!arguments.length) {
                return yLabel;
            }
            yLabel = value;
            return annotation;
        };

        annotation.padding = function(value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return annotation;
        };

        annotation.formatCallout = function(value) {
            if (!arguments.length) {
                return formatCallout;
            }
            formatCallout = value;
            return annotation;
        };

        return annotation;
    };
}(d3, fc));
/*jshint loopfunc: true */
(function(d3, fc) {
    'use strict';

    fc.tools.callouts = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            padding = 5,
            spacing = 5,
            rounded = 0,
            rotationStart = 20,
            rotationSteps = 20,
            stalkLength = 50,
            css = 'callout',
            data = [];

        var currentBB = null,
            boundingBoxes = [],
            currentRotation = 0;

        var rectanglesIntersect = function(r1, r2) {
            return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
        };

        var arrangeCallouts = function() {

            if (!boundingBoxes) {
                return;
            }

            var sortedRects = boundingBoxes.sort(function(a, b) {
                if (a.y < b.y) {
                    return -1;
                }
                if (a.y > b.y) {
                    return 1;
                }
                return 0;
            });

            currentRotation = rotationStart;
            for (var i = 0; i < sortedRects.length; i++) {

                // Calculate the x and y components of the stalk
                var offsetX = stalkLength * Math.sin(currentRotation * (Math.PI / 180));
                sortedRects[i].x += offsetX;
                var offsetY = stalkLength * Math.cos(currentRotation * (Math.PI / 180));
                sortedRects[i].y -= offsetY;

                currentRotation += rotationSteps;
            }

            // Tree sorting algo (Sudo code below)
            for (var r1 = 0; r1 < sortedRects.length; r1++) {
                for (var r2 = r1 + 1; r2 < sortedRects.length; r2++) {

                    if (!sortedRects[r1].left) {
                        sortedRects[r1].left = function() { return this.x - padding; };
                        sortedRects[r1].right = function() { return this.x + this.width + padding; };
                        sortedRects[r1].bottom = function() { return this.y + this.height + padding; };
                        sortedRects[r1].top = function() { return this.y - padding; };
                    }

                    if (!sortedRects[r2].left) {
                        sortedRects[r2].left = function() { return this.x - padding; };
                        sortedRects[r2].right = function() { return this.x + this.width + padding; };
                        sortedRects[r2].bottom = function() { return this.y + this.height + padding; };
                        sortedRects[r2].top = function() { return this.y - padding; };
                    }

                    if (rectanglesIntersect(sortedRects[r1], sortedRects[r2])) {

                    // Find the smallest move to correct the overlap
                        var smallest = 0; // 0=left, 1=right, 2=down
                        var left = sortedRects[r2].right() - sortedRects[r1].left();
                        var right = sortedRects[r1].right() - sortedRects[r2].left();
                        if (right < left) {
                            smallest = 1;
                        }
                        var down = sortedRects[r1].bottom() - sortedRects[r2].top();
                        if (down < right && down < left) {
                            smallest = 2;
                        }

                        if (smallest === 0) {
                            sortedRects[r2].x -= (left + spacing);
                        } else if (smallest === 1) {
                            sortedRects[r2].x += (right + spacing);
                        } else if (smallest === 2) {
                            sortedRects[r2].y += (down + spacing);
                        }
                    }
                }
            }

            boundingBoxes = sortedRects;
        };

        var callouts = function(selection) {

            // Create the callouts
            var callouts = selection.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('transform', function(d) { return 'translate(' + xScale(d.x) + ',' + yScale(d.y) + ')'; })
                .attr('class', function(d) { return d.css ? d.css : css; });

            // Create the text elements
            callouts.append('text')
                .attr('style', 'text-anchor: left;')
                .text(function(d) { return d.label; });

            // Create the rectangles behind
            callouts.insert('rect', ':first-child')
                .attr('x', function(d) { return -padding - rounded; })
                .attr('y', function(d) {
                    currentBB = this.parentNode.getBBox();
                    currentBB.x = xScale(d.x);
                    currentBB.y = yScale(d.y);
                    boundingBoxes.push(currentBB);
                    return -currentBB.height;
                })
                .attr('width', function(d) { return currentBB.width + (padding * 2) + (rounded * 2); })
                .attr('height', function(d) { return currentBB.height + (padding * 2); })
                .attr('rx', rounded)
                .attr('ry', rounded);

            // Arrange callout
            arrangeCallouts();
            var index = 0;
            callouts.attr('transform', function(d) {
                return 'translate(' + boundingBoxes[index].x + ',' + boundingBoxes[index++].y + ')';
            });

            callouts = selection.selectAll('g')
                .data(data)
                .exit();
        };

        callouts.addCallout = function(value) {
            data.push(value);
            return callouts;
        };

        callouts.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return callouts;
        };

        callouts.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return callouts;
        };

        callouts.padding = function(value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return callouts;
        };

        callouts.spacing = function(value) {
            if (!arguments.length) {
                return spacing;
            }
            spacing = value;
            return callouts;
        };

        callouts.rounded = function(value) {
            if (!arguments.length) {
                return rounded;
            }
            rounded = value;
            return callouts;
        };

        callouts.stalkLength = function(value) {
            if (!arguments.length) {
                return stalkLength;
            }
            stalkLength = value;
            return callouts;
        };

        callouts.rotationStart = function(value) {
            if (!arguments.length) {
                return rotationStart;
            }
            rotationStart = value;
            return callouts;
        };

        callouts.rotationSteps = function(value) {
            if (!arguments.length) {
                return rotationSteps;
            }
            rotationSteps = value;
            return callouts;
        };

        callouts.css = function(value) {
            if (!arguments.length) {
                return css;
            }
            css = value;
            return callouts;
        };

        return callouts;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var target = null,
            series = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = null,
            formatH = null,
            formatV = null,
            active = true,
            freezable = true,
            padding = 2,
            onSnap = null;

        var lineH = null,
            lineV = null,
            circle = null,
            calloutH = null,
            calloutV = null;

        var highlight = null,
            highlightedValue = null;

        var crosshairs = function() {

            var root = target.append('g')
                .attr('class', 'crosshairs');

            lineH = root.append('line')
                .attr('class', 'crosshairs horizontal')
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1])
                .attr('display', 'none');

            lineV = root.append('line')
                .attr('class', 'crosshairs vertical')
                .attr('y1', yScale.range()[0])
                .attr('y2', yScale.range()[1])
                .attr('display', 'none');

            circle = root.append('circle')
                .attr('class', 'crosshairs circle')
                .attr('r', 6)
                .attr('display', 'none');

            calloutH = root.append('text')
                .attr('class', 'crosshairs callout horizontal')
                .attr('x', xScale.range()[1] - padding)
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');

            calloutV = root.append('text')
                .attr('class', 'crosshairs callout vertical')
                .attr('y', '1em')
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');
        };

        function mousemove() {

            if (active) {
                crosshairs.update();
            }
        }

        function mouseout() {

            if (active) {
                crosshairs.clear();
            }
        }

        function mouseclick() {

            if (freezable) {
                crosshairs.active(!active);
            }
        }

        function findNearest(xTarget) {

            var nearest = null,
                dx = Number.MAX_VALUE;

            series.forEach(function(data) {

                var xDiff = Math.abs(xTarget - xScale(data.date));

                if (xDiff < dx) {
                    dx = xDiff;
                    nearest = data;
                }
            });

            return nearest;
        }

        function findValue(yTarget, data) {

            var field = null;

            var minDiff = Number.MAX_VALUE;
            for (var property in data) {
                if (data.hasOwnProperty(property) && (property !== 'date')) {
                    var dy = Math.abs(yTarget - yScale(data[property]));
                    if (dy <= minDiff) {
                        minDiff = dy;
                        field = property;
                    }
                }
            }

            return data[field];
        }

        function redraw() {

            var x = xScale(highlight.date),
                y = yScale(highlightedValue);

            lineH.attr('y1', y)
                .attr('y2', y);
            lineV.attr('x1', x)
                .attr('x2', x);
            circle.attr('cx', x)
                .attr('cy', y);
            calloutH.attr('y', y - padding)
                .text(formatH(highlightedValue));
            calloutV.attr('x', x - padding)
                .text(formatV(highlight.date));

            lineH.attr('display', 'inherit');
            lineV.attr('display', 'inherit');
            circle.attr('display', 'inherit');
            calloutH.attr('display', 'inherit');
            calloutV.attr('display', 'inherit');
        }

        crosshairs.update = function() {

            if (!active) {

                redraw();

            } else {

                var mouse = [0, 0];
                try {
                    mouse = d3.mouse(target[0][0]);
                }
                catch (exception) {
                    // Mouse is elsewhere
                }

                var nearest = findNearest(mouse[0]);

                if (nearest !== null) {

                    var value = null;
                    if (yValue) {
                        value = yValue(nearest);
                    } else {
                        value = findValue(mouse[1], nearest);
                    }

                    if ((nearest !== highlight) || (value !== highlightedValue)) {

                        highlight = nearest;
                        highlightedValue = value;

                        redraw();
                        if (onSnap) {
                            onSnap(highlight);
                        }
                    }
                }
            }
        };

        crosshairs.clear = function() {

            highlight = null;
            highlightedValue = null;

            lineH.attr('display', 'none');
            lineV.attr('display', 'none');
            circle.attr('display', 'none');
            calloutH.attr('display', 'none');
            calloutV.attr('display', 'none');
        };

        crosshairs.target = function(value) {
            if (!arguments.length) {
                return target;
            }

            if (target) {

                target.on('mousemove.crosshairs', null);
                target.on('mouseout.crosshairs', null);
                target.on('click.crosshairs', null);
            }

            target = value;

            target.on('mousemove.crosshairs', mousemove);
            target.on('mouseout.crosshairs', mouseout);
            target.on('click.crosshairs', mouseclick);

            return crosshairs;
        };

        crosshairs.series = function(value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return crosshairs;
        };

        crosshairs.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return crosshairs;
        };

        crosshairs.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return crosshairs;
        };

        crosshairs.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return crosshairs;
        };

        crosshairs.formatH = function(value) {
            if (!arguments.length) {
                return formatH;
            }
            formatH = value;
            return crosshairs;
        };

        crosshairs.formatV = function(value) {
            if (!arguments.length) {
                return formatV;
            }
            formatV = value;
            return crosshairs;
        };

        crosshairs.active = function(value) {
            if (!arguments.length) {
                return active;
            }
            active = value;

            lineH.classed('frozen', !active);
            lineV.classed('frozen', !active);
            circle.classed('frozen', !active);

            return crosshairs;
        };

        crosshairs.freezable = function(value) {
            if (!arguments.length) {
                return freezable;
            }
            freezable = value;
            return crosshairs;
        };

        crosshairs.padding = function(value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return crosshairs;
        };

        crosshairs.onSnap = function(value) {
            if (!arguments.length) {
                return onSnap;
            }
            onSnap = value;
            return crosshairs;
        };

        crosshairs.highlightedPoint = function() {
            return highlight;
        };

        return crosshairs;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.fibonacciFan = function() {

        var target = null,
            series = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            active = true;

        var circleOrigin = null,
            circleTarget = null,
            lineSource = null,
            lineA = null,
            lineB = null,
            lineC = null,
            fanArea = null;

        var phase = 1,
            locationOrigin = null,
            locationTarget = null;

        var fibonacciFan = function() {

            var root = target.append('g')
                .attr('class', 'fibonacci-fan');

            circleOrigin = root.append('circle')
                .attr('class', 'fibonacci-fan origin')
                .attr('r', 6)
                .attr('display', 'none');

            circleTarget = root.append('circle')
                .attr('class', 'fibonacci-fan target')
                .attr('r', 6)
                .attr('display', 'none');

            lineSource = root.append('line')
                .attr('class', 'fibonacci-fan source')
                .attr('display', 'none');

            lineA = root.append('line')
                .attr('class', 'fibonacci-fan a')
                .attr('display', 'none');

            lineB = root.append('line')
                .attr('class', 'fibonacci-fan b')
                .attr('display', 'none');

            lineC = root.append('line')
                .attr('class', 'fibonacci-fan c')
                .attr('display', 'none');

            fanArea = root.append('polygon')
                .attr('class', 'fibonacci-fan area')
                .attr('display', 'none');
        };

        function mousemove() {

            if (!active) {
                return;
            }

            switch (phase) {
                case 1: {
                    locationOrigin = findLocation();
                    if (locationOrigin) {
                        fibonacciFan.update();
                        circleOrigin.attr('display', 'inherit');
                    }
                    break;
                }
                case 2: {
                    locationTarget = findLocation();
                    if (locationTarget) {
                        fibonacciFan.update();
                        circleTarget.attr('display', 'inherit');
                        lineSource.attr('display', 'inherit');
                    }
                    break;
                }
                case 3: {
                    break;
                }
            }
        }

        function mouseclick() {

            if (!active) {
                return;
            }

            switch (phase) {
                case 1: {

                    phase = 2;
                    break;
                }
                case 2: {

                    setFan();

                    phase = 3;
                    break;
                }
                case 3: {

                    clearAll();

                    phase = 1;
                    break;
                }
            }
        }

        function findLocation() {

            var mouse = [0, 0];
            try {
                mouse = d3.mouse(target[0][0]);
            }
            catch (exception) {
                // Mouse is elsewhere
            }

            var xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                point = findPoint(xMouse);

            if (point !== null) {

                var field = findField(yMouse, point);

                if (field !== null) {

                    return {point: point, field: field};
                }
            }

            return null;
        }

        function findPoint(xTarget) {

            var nearest = null,
                dx = Number.MAX_VALUE;

            series.forEach(function(data) {

                var xDiff = Math.abs(xTarget.getTime() - data.date.getTime());

                if (xDiff < dx) {
                    dx = xDiff;
                    nearest = data;
                }
            });

            return nearest;
        }

        function findField(yTarget, data) {

            var field = null;

            var minDiff = Number.MAX_VALUE;
            for (var property in data) {
                if (data.hasOwnProperty(property) && (property !== 'date')) {
                    var dy = Math.abs(yTarget - data[property]);
                    if (dy <= minDiff) {
                        minDiff = dy;
                        field = property;
                    }
                }
            }

            return field;
        }

        function setFan() {

            if (xScale(locationOrigin.point.date) > xScale(locationTarget.point.date)) {
                var tmp = locationOrigin;
                locationOrigin = locationTarget;
                locationTarget = tmp;
            }

            var originX = xScale(locationOrigin.point.date),
                originY = yScale(locationOrigin.point[locationOrigin.field]),
                targetX = xScale(locationTarget.point.date),
                targetY = yScale(locationTarget.point[locationTarget.field]),
                finalX = xScale.range()[1],
                finalY = calculateY(originX, originY, targetX, targetY, finalX);

            if (finalY) {

                setFanLines(originX, originY, finalX, finalY.source, finalY.source, finalY.source);

                lineA.attr('display', 'inherit');
                lineB.attr('display', 'inherit');
                lineC.attr('display', 'inherit');
                fanArea.attr('display', 'inherit');

                var pointsFinal = originX + ',' + originY +
                    ' ' + finalX + ',' + finalY.a +
                    ' ' + finalX + ',' + finalY.c;

                lineA.transition()
                    .attr('y2', finalY.a);
                lineB.transition()
                    .attr('y2', finalY.b);
                lineC.transition()
                    .attr('y2', finalY.c);
                fanArea.transition()
                    .attr('points', pointsFinal);
            }

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
        }

        function clearAll() {

            locationOrigin = null;
            locationTarget = null;

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
            lineSource.attr('display', 'none');
            lineA.attr('display', 'none');
            lineB.attr('display', 'none');
            lineC.attr('display', 'none');
            fanArea.attr('display', 'none');
        }

        function calculateY(originX, originY, targetX, targetY, finalX) {

            if (originX === targetX) { return null; }

            var gradient = (targetY - originY) / (targetX - originX),
                ySource = (gradient * (finalX - originX)) + originY,
                yA = ((gradient * 0.618) * (finalX - originX)) + originY,
                yB = ((gradient * 0.500) * (finalX - originX)) + originY,
                yC = ((gradient * 0.382) * (finalX - originX)) + originY;

            return {source: ySource, a: yA, b: yB, c: yC};
        }

        function setFanLines(originX, originY, finalX, finalYa, finalYb, finalYc) {

            var points = originX + ',' + originY +
                ' ' + finalX + ',' + finalYa +
                ' ' + finalX + ',' + finalYc;

            lineA.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', finalX)
                .attr('y2', finalYa);
            lineB.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', finalX)
                .attr('y2', finalYb);
            lineC.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', finalX)
                .attr('y2', finalYc);
            fanArea.attr('points', points);
        }

        fibonacciFan.update = function() {

            if (locationOrigin) {

                var originX = xScale(locationOrigin.point.date),
                    originY = yScale(locationOrigin.point[locationOrigin.field]);

                circleOrigin.attr('cx', originX)
                    .attr('cy', originY);
                lineSource.attr('x1', originX)
                    .attr('y1', originY);

                if (locationTarget && (phase !== 1)) {

                    var targetX = xScale(locationTarget.point.date),
                        targetY = yScale(locationTarget.point[locationTarget.field]);

                    circleTarget.attr('cx', targetX)
                        .attr('cy', targetY);
                    lineSource.attr('x2', targetX)
                        .attr('y2', targetY);

                    if (phase === 3) {

                        var finalX = xScale.range()[1],
                            finalY = calculateY(originX, originY, targetX, targetY, finalX);

                        if (finalY) {
                            setFanLines(originX, originY, finalX, finalY.a, finalY.b, finalY.c);
                        }
                    }
                }
            }
        };

        fibonacciFan.visible = function(value) {

            if (value) {

                switch (phase) {
                    case 1: {
                        circleOrigin.attr('display', 'inherit');
                        break;
                    }
                    case 2: {
                        circleOrigin.attr('display', 'inherit');
                        circleTarget.attr('display', 'inherit');
                        lineSource.attr('display', 'inherit');
                        break;
                    }
                    case 3: {
                        lineSource.attr('display', 'inherit');
                        lineA.attr('display', 'inherit');
                        lineB.attr('display', 'inherit');
                        lineC.attr('display', 'inherit');
                        fanArea.attr('display', 'inherit');
                        break;
                    }
                }
            } else {

                circleOrigin.attr('display', 'none');
                circleTarget.attr('display', 'none');
                lineSource.attr('display', 'none');
                lineA.attr('display', 'none');
                lineB.attr('display', 'none');
                lineC.attr('display', 'none');
                fanArea.attr('display', 'none');
            }
        };

        fibonacciFan.target = function(value) {
            if (!arguments.length) {
                return target;
            }

            if (target) {

                target.on('mousemove.fibonacci-fan', null);
                target.on('click.fibonacci-fan', null);
            }

            target = value;

            target.on('mousemove.fibonacci-fan', mousemove);
            target.on('click.fibonacci-fan', mouseclick);

            return fibonacciFan;
        };

        fibonacciFan.series = function(value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return fibonacciFan;
        };

        fibonacciFan.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return fibonacciFan;
        };

        fibonacciFan.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return fibonacciFan;
        };

        fibonacciFan.active = function(value) {
            if (!arguments.length) {
                return active;
            }
            active = value;
            return fibonacciFan;
        };

        return fibonacciFan;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.measure = function() {

        var target = null,
            series = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            active = true,
            padding = 2,
            formatH = function(d) { return d; },
            formatV = function(d) { return d; };

        var circleOrigin = null,
            circleTarget = null,
            lineSource = null,
            lineX = null,
            lineY = null,
            calloutX = null,
            calloutY = null;

        var phase = 1,
            locationOrigin = null,
            locationTarget = null;

        var measure = function() {

            var root = target.append('g')
                .attr('class', 'measure');

            circleOrigin = root.append('circle')
                .attr('class', 'measure origin')
                .attr('r', 6)
                .attr('display', 'none');

            circleTarget = root.append('circle')
                .attr('class', 'measure target')
                .attr('r', 6)
                .attr('display', 'none');

            lineSource = root.append('line')
                .attr('class', 'measure source')
                .attr('display', 'none');

            lineX = root.append('line')
                .attr('class', 'measure x')
                .attr('display', 'none');

            lineY = root.append('line')
                .attr('class', 'measure y')
                .attr('display', 'none');

            calloutX = root.append('text')
                .attr('class', 'measure callout horizontal')
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');

            calloutY = root.append('text')
                .attr('class', 'measure callout vertical')
                .attr('style', 'text-anchor: middle')
                .attr('display', 'none');
        };

        function mousemove() {

            if (!active) {
                return;
            }

            switch (phase) {
                case 1: {
                    locationOrigin = findLocation();
                    if (locationOrigin) {
                        measure.update();
                        circleOrigin.attr('display', 'inherit');
                    }
                    break;
                }
                case 2: {
                    locationTarget = findLocation();
                    if (locationTarget) {
                        measure.update();
                        circleTarget.attr('display', 'inherit');
                        lineSource.attr('display', 'inherit');
                    }
                    break;
                }
                case 3: {
                    break;
                }
            }
        }

        function mouseclick() {

            if (!active) {
                return;
            }

            switch (phase) {
                case 1: {

                    phase = 2;
                    break;
                }
                case 2: {

                    doMeasure();

                    phase = 3;
                    break;
                }
                case 3: {

                    clearAll();

                    phase = 1;
                    break;
                }
            }
        }

        function findLocation() {

            var mouse = [0, 0];
            try {
                mouse = d3.mouse(target[0][0]);
            }
            catch (exception) {
                // Mouse is elsewhere
            }

            var xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                point = findPoint(xMouse);

            if (point !== null) {

                var field = findField(yMouse, point);

                if (field !== null) {

                    return {point: point, field: field};
                }
            }

            return null;
        }

        function findPoint(xTarget) {

            var nearest = null,
                dx = Number.MAX_VALUE;

            series.forEach(function(data) {

                var xDiff = Math.abs(xTarget.getTime() - data.date.getTime());

                if (xDiff < dx) {
                    dx = xDiff;
                    nearest = data;
                }
            });

            return nearest;
        }

        function findField(yTarget, data) {

            var field = null;

            var minDiff = Number.MAX_VALUE;
            for (var property in data) {
                if (data.hasOwnProperty(property) && (property !== 'date')) {
                    var dy = Math.abs(yTarget - data[property]);
                    if (dy <= minDiff) {
                        minDiff = dy;
                        field = property;
                    }
                }
            }

            return field;
        }

        function doMeasure() {

            var originX = xScale(locationOrigin.point.date),
                originY = yScale(locationOrigin.point[locationOrigin.field]),
                targetX = xScale(locationTarget.point.date),
                targetY = yScale(locationTarget.point[locationTarget.field]);

            lineX.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', targetX)
                .attr('y2', originY);
            lineY.attr('x1', targetX)
                .attr('y1', originY)
                .attr('x2', targetX)
                .attr('y2', targetY);

            var field = locationTarget.field;

            calloutX.attr('x', targetX - padding)
                .attr('y', originY - (originY - targetY) / 2.0)
                .text(formatV(Math.abs(locationTarget.point[field] - locationOrigin.point[field])));

            calloutY.attr('y', originY - padding)
                .attr('x', originX + (targetX - originX) / 2.0)
                .text(formatH(Math.abs(locationTarget.point.date.getTime() - locationOrigin.point.date.getTime())));

            lineX.attr('display', 'inherit');
            lineY.attr('display', 'inherit');
            calloutX.attr('display', 'inherit');
            calloutY.attr('display', 'inherit');

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
        }

        function clearAll() {

            locationOrigin = null;
            locationTarget = null;

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
            lineSource.attr('display', 'none');
            lineX.attr('display', 'none');
            lineY.attr('display', 'none');
            calloutX.attr('display', 'none');
            calloutY.attr('display', 'none');
        }

        measure.update = function() {

            if (locationOrigin) {

                var originX = xScale(locationOrigin.point.date),
                    originY = yScale(locationOrigin.point[locationOrigin.field]);

                circleOrigin.attr('cx', originX)
                    .attr('cy', originY);
                lineSource.attr('x1', originX)
                    .attr('y1', originY);

                if (locationTarget && (phase !== 1)) {

                    var targetX = xScale(locationTarget.point.date),
                        targetY = yScale(locationTarget.point[locationTarget.field]);

                    circleTarget.attr('cx', targetX)
                        .attr('cy', targetY);
                    lineSource.attr('x2', targetX)
                        .attr('y2', targetY);

                    if (phase === 3) {

                        doMeasure();
                    }
                }
            }
        };

        measure.visible = function(value) {

            if (value) {

                switch (phase) {
                    case 1: {
                        circleOrigin.attr('display', 'inherit');
                        break;
                    }
                    case 2: {
                        circleOrigin.attr('display', 'inherit');
                        circleTarget.attr('display', 'inherit');
                        lineSource.attr('display', 'inherit');
                        break;
                    }
                    case 3: {
                        lineSource.attr('display', 'inherit');
                        lineX.attr('display', 'inherit');
                        lineY.attr('display', 'inherit');
                        calloutX.attr('display', 'inherit');
                        calloutY.attr('display', 'inherit');
                        break;
                    }
                }
            } else {

                circleOrigin.attr('display', 'none');
                circleTarget.attr('display', 'none');
                lineSource.attr('display', 'none');
                lineX.attr('display', 'none');
                lineY.attr('display', 'none');
                calloutX.attr('display', 'none');
                calloutY.attr('display', 'none');
            }
        };

        measure.target = function(value) {
            if (!arguments.length) {
                return target;
            }

            if (target) {

                target.on('mousemove.measure', null);
                target.on('click.measure', null);
            }

            target = value;

            target.on('mousemove.measure', mousemove);
            target.on('click.measure', mouseclick);

            return measure;
        };

        measure.series = function(value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return measure;
        };

        measure.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return measure;
        };

        measure.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return measure;
        };

        measure.active = function(value) {
            if (!arguments.length) {
                return active;
            }
            active = value;
            return measure;
        };

        measure.padding = function(value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return measure;
        };

        measure.formatH = function(value) {
            if (!arguments.length) {
                return formatH;
            }
            formatH = value;
            return measure;
        };

        measure.formatV = function(value) {
            if (!arguments.length) {
                return formatV;
            }
            formatV = value;
            return measure;
        };

        return measure;
    };

}(d3, fc));