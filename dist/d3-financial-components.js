/* globals window */

window.fc = {
    version: '0.0.0',
    charts: {},
    indicators: {
        algorithms: {}
    },
    scale: {
        discontinuity: {}
    },
    series: {},
    tools: {},
    utilities: {}
};
(function(d3, fc) {
    'use strict';

    /**
     * The extent function enhances the functionality of the equivalent D3 extent function, allowing
     * you to pass an array of fields which will be used to derive the extent of the supplied array. For
     * example, if you have an array of items with properties of 'high' and 'low', you
     * can use <code>fc.utilities.extent(data, ['high', 'low'])</code> to compute the extent of your data.
     *
     * @memberof fc.utilities
     * @param {array} data an array of data points, or an array of arrays of data points
     * @param {array} fields the names of object properties that represent field values
     */
    fc.utilities.extent = function(data, fields) {

        if (fields === null) {
            return d3.extent(data);
        }

        // the function only operates on arrays of arrays, but we can pass non-array types in
        if (!Array.isArray(data)) {
            data = [data];
        }
        // we need an array of arrays if we don't have one already
        if (!Array.isArray(data[0])) {
            data = [data];
        }
        // the fields parameter must be an array of field names, but we can pass non-array types in
        if (!Array.isArray(fields)) {
            fields = [fields];
        }

        // Return the smallest and largest
        return [
            d3.min(data, function(d0) {
                return d3.min(d0, function(d1) {
                    return d3.min(fields.map(function(f) {
                        return d1[f];
                    }));
                });
            }),
            d3.max(data, function(d0) {
                return d3.max(d0, function(d1) {
                    return d3.max(fields.map(function(f) {
                        return d1[f];
                    }));
                });
            })
        ];
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.utilities.fn = {
        identity: function(d) { return d; },
        index: function(d, i) { return i; },
        noop: function(d) {  }
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    // the barWidth property of the various series takes a function which, when given an
    // array of x values, returns a suitable width. This function creates a width which is
    // equal to the smallest distance between neighbouring datapoints multiplied
    // by the given factor
    fc.utilities.fractionalBarWidth = function(fraction) {

        return function(pixelValues) {
            // return some default value if there are not enough datapoints to compute the width
            if (pixelValues.length <= 1) {
                return 10;
            }

            pixelValues.sort();

            // creates a new array as a result of applying the 'fn' function to
            // the consecutive pairs of items in the source array
            function pair(arr, fn) {
                var res = [];
                for (var i = 1; i < arr.length; i++) {
                    res.push(fn(arr[i], arr[i - 1]));
                }
                return res;
            }

            // compute the distance between neighbouring items
            var neighbourDistances = pair(pixelValues, function(first, second) {
                return Math.abs(first - second);
            });

            var minDistance = d3.min(neighbourDistances);
            return fraction * minDistance;
        };
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.utilities.pointSnap = function(xScale, yScale, xValue, yValue, data) {
        return function(xPixel, yPixel) {
            var x = xScale.invert(xPixel),
                y = yScale.invert(yPixel),
                nearest = null,
                minDiff = Number.MAX_VALUE;
            for (var i = 0, l = data.length; i < l; i++) {
                var d = data[i],
                    dx = x - xValue(d),
                    dy = y - yValue(d),
                    diff = Math.sqrt(dx * dx + dy * dy);

                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = d;
                } else {
                    break;
                }
            }

            return {
                datum: nearest,
                x: nearest ? xScale(xValue(nearest)) : xPixel,
                y: nearest ? yScale(yValue(nearest)) : yPixel
            };
        };
    };

    fc.utilities.seriesPointSnap = function(series, data) {
        var xScale = series.xScale(),
            yScale = series.yScale(),
            xValue = series.xValue ? series.xValue() : function(d) { return d.date; },
            yValue = series.yValue();
        return fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
    };

}(d3, fc));

(function(d3, fc) {
    'use strict';

    // a property that follows the D3 component convention for accessors
    // see: http://bost.ocks.org/mike/chart/
    fc.utilities.property = function(initialValue) {

        var accessor = function(newValue) {
            if (!arguments.length) {
                return accessor.value;
            }
            accessor.value = newValue;
            return this;
        };

        accessor.value = initialValue;

        return accessor;
    };

    // a property that follows the D3 component convention for accessors
    // see: http://bost.ocks.org/mike/chart/
    fc.utilities.functorProperty = function(initialValue) {

        var accessor = function(newValue) {
            if (!arguments.length) {
                return accessor.value;
            }
            accessor.value = d3.functor(newValue);
            return this;
        };

        accessor.value = d3.functor(initialValue);

        return accessor;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';
    /**
     * An overload of the d3.rebind method which allows the source methods
     * to be rebound to the target with a different name. In the mappings object
     * keys represent the target method names and values represent the source
     * object names.
     */
    fc.utilities.rebind = function(target, source, mappings) {
        if (typeof(mappings) !== 'object') {
            return d3.rebind.apply(d3, arguments);
        }
        Object.keys(mappings)
            .forEach(function(targetName) {
                var method = source[mappings[targetName]];
                target[targetName] = function() {
                    var value = method.apply(source, arguments);
                    return value === source ? target : value;
                };
            });
        return target;
    };

}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.utilities.simpleDataJoin = function(parent, className, data, dataKey) {
        // "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
        // a string (such as with attr).
        // Very small values, when stringified, may be converted to scientific notation and
        // cause a temporarily invalid attribute or style property value.
        // For example, the number 0.0000001 is converted to the string "1e-7".
        // This is particularly noticeable when interpolating opacity values.
        // To avoid scientific notation, start or end the transition at 1e-6,
        // which is the smallest value that is not stringified in exponential notation."
        // - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
        var effectivelyZero = 1e-6;

        // update
        var updateSelection = parent.selectAll('g.' + className)
            .data(data, dataKey || fc.utilities.fn.index);

        // enter
        // entering elements fade in (from transparent to opaque)
        var enterSelection = updateSelection.enter()
            .append('g')
            .classed(className, true)
            .style('opacity', effectivelyZero);

        // exit
        // exiting elements fade out (from opaque to transparent)
        var exitSelection = d3.transition(updateSelection.exit())
            .style('opacity', effectivelyZero)
            .remove();

        // all properties of the selection (which can be interpolated) will transition
        updateSelection = d3.transition(updateSelection)
            .style('opacity', 1);

        updateSelection.enter = d3.functor(enterSelection);
        updateSelection.exit = d3.functor(exitSelection);
        return updateSelection;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.charts.linearTimeSeries = function() {

        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        var linearTimeSeries = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var mainContainer = container.selectAll('svg')
                    .data([data]);
                mainContainer.enter()
                    .append('svg')
                    .attr('overflow', 'hidden')
                    .layout('flex', 1);

                var background = mainContainer.selectAll('rect.background')
                    .data([data]);
                background.enter()
                    .append('rect')
                    .attr('class', 'background')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var plotAreaContainer = mainContainer.selectAll('g.plot-area')
                    .data([data]);
                plotAreaContainer.enter()
                    .append('g')
                    .attr('class', 'plot-area')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var yAxisContainer = mainContainer.selectAll('g.y-axis')
                    .data([data]);
                yAxisContainer.enter()
                    .append('g')
                    .attr('class', 'axis y-axis')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0
                    });

                var xAxisContainer = container.selectAll('g.x-axis')
                    .data([data]);
                xAxisContainer.enter()
                    .append('g')
                    .attr('class', 'axis x-axis')
                    .layout('height', 20);

                container.layout();

                xScale.range([0, xAxisContainer.layout('width')]);

                yScale.range([yAxisContainer.layout('height'), 0]);

                xAxisContainer.call(xAxis);

                yAxisContainer.call(yAxis);

                var plotArea = linearTimeSeries.plotArea.value;
                plotArea.xScale(xScale)
                    .yScale(yScale);
                plotAreaContainer.call(plotArea);

            });
        };

        fc.utilities.rebind(linearTimeSeries, xScale, {
            xDiscontinuityProvider: 'discontinuityProvider',
            xDomain: 'domain',
            xNice: 'nice'
        });

        fc.utilities.rebind(linearTimeSeries, yScale, {
            yDomain: 'domain',
            yNice: 'nice'
        });

        fc.utilities.rebind(linearTimeSeries, xAxis, {
            xTicks: 'ticks'
        });

        fc.utilities.rebind(linearTimeSeries, yAxis, {
            yTicks: 'ticks'
        });

        linearTimeSeries.plotArea = fc.utilities.property(fc.series.line());

        return linearTimeSeries;
    };

})(d3, fc);
(function(fc) {
    'use strict';

    fc.dataGenerator = function() {

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

            var prices = randomWalk(
                years,
                days * gen.stepsPerDay.value,
                gen.mu.value,
                gen.sigma.value,
                gen.startPrice.value
            );
            var volumes = randomWalk(
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
(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.bollingerBands = function() {

        var slidingWindow = fc.indicators.algorithms.slidingWindow()
            .accumulator(function(values) {
                var avg = d3.mean(values);
                var stdDev = d3.deviation(values);
                var multiplier = bollingerBands.multiplier.value.apply(this, arguments);
                return {
                    upper: avg + multiplier * stdDev,
                    average: avg,
                    lower: avg - multiplier * stdDev
                };
            });

        var bollingerBands = function(data) {
            return slidingWindow(data);
        };

        bollingerBands.multiplier = fc.utilities.functorProperty(2);

        d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'inputValue', 'outputValue');

        return bollingerBands;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.percentageChange = function() {

        var percentageChange = function(data) {

            if (data.length === 0) {
                return [];
            }

            var baseIndex = percentageChange.baseIndex.value(data);
            var baseValue = percentageChange.inputValue.value(data[baseIndex]);

            return data.map(function(d) {
                    var result = (percentageChange.inputValue.value(d) - baseValue) / baseValue;
                    return percentageChange.outputValue.value(d, result);
                });
        };

        percentageChange.baseIndex = fc.utilities.functorProperty(0);
        percentageChange.inputValue = fc.utilities.property(fc.utilities.fn.identity);
        percentageChange.outputValue = fc.utilities.property(function(obj, value) { return value; });

        return percentageChange;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.relativeStrengthIndicator = function() {

        var slidingWindow = fc.indicators.algorithms.slidingWindow()
            .windowSize(14)
            .accumulator(function(values) {
                var downCloses = [];
                var upCloses = [];

                for (var i = 0, l = values.length; i < l; i++) {
                    var value = values[i];

                    var openValue = rsi.openValue.value(value);
                    var closeValue = rsi.closeValue.value(value);

                    downCloses.push(openValue > closeValue ? openValue - closeValue : 0);
                    upCloses.push(openValue < closeValue ? closeValue - openValue : 0);
                }

                var downClosesAvg = rsi.averageAccumulator.value(downCloses);
                if (downClosesAvg === 0) {
                    return 100;
                }

                var rs = rsi.averageAccumulator.value(upCloses) / downClosesAvg;
                return 100 - (100 / (1 + rs));
            });

        var rsi = function(data) {
            return slidingWindow(data);
        };

        rsi.openValue = fc.utilities.property(function(d) { return d.open; });
        rsi.closeValue = fc.utilities.property(function(d) { return d.close; });
        rsi.averageAccumulator = fc.utilities.property(function(values) {
            var alpha = 1 / values.length;
            var result = values[0];
            for (var i = 1, l = values.length; i < l; i++) {
                result = alpha * values[i] + (1 - alpha) * result;
            }
            return result;
        });

        d3.rebind(rsi, slidingWindow, 'windowSize', 'outputValue');

        return rsi;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.slidingWindow = function() {

        var slidingWindow = function(data) {
            var size = slidingWindow.windowSize.value.apply(this, arguments);
            var accumulator = slidingWindow.accumulator.value;
            var inputValue = slidingWindow.inputValue.value;
            var outputValue = slidingWindow.outputValue.value;

            var windowData = data.slice(0, size).map(inputValue);
            return data.slice(size - 1, data.length)
                .map(function(d, i) {
                    if (i > 0) {
                        // Treat windowData as FIFO rolling buffer
                        windowData.shift();
                        windowData.push(inputValue(d));
                    }
                    var result = accumulator(windowData);
                    return outputValue(d, result);
                });
        };

        slidingWindow.windowSize = fc.utilities.functorProperty(10);
        slidingWindow.accumulator = fc.utilities.property(fc.utilities.fn.noop);
        slidingWindow.inputValue = fc.utilities.property(fc.utilities.fn.identity);
        slidingWindow.outputValue = fc.utilities.property(function(obj, value) { return value; });

        return slidingWindow;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function() {

        var algorithm = fc.indicators.algorithms.bollingerBands();

        var readCalculatedValue = function(d) {
            return bollingerBands.readCalculatedValue.value(d) || {};
        };

        var area = fc.series.area()
            .y0Value(function(d) {
                return readCalculatedValue(d).upper;
            })
            .y1Value(function(d) {
                return readCalculatedValue(d).lower;
            });

        var upperLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).upper;
            });

        var averageLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).average;
            });

        var lowerLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).lower;
            });

        var bollingerBands = function(selection) {

            algorithm.inputValue(bollingerBands.yValue.value)
                .outputValue(bollingerBands.writeCalculatedValue.value);

            area.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            upperLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            averageLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            lowerLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var areaContianer = container.selectAll('g.area')
                    .data([data]);

                areaContianer.enter()
                    .append('g')
                    .attr('class', 'area');

                areaContianer.call(area);

                var upperLineContainer = container.selectAll('g.upper')
                    .data([data]);

                upperLineContainer.enter()
                    .append('g')
                    .attr('class', 'upper');

                upperLineContainer.call(upperLine);

                var averageLineContainer = container.selectAll('g.average')
                    .data([data]);

                averageLineContainer.enter()
                    .append('g')
                    .attr('class', 'average');

                averageLineContainer.call(averageLine);

                var lowerLineContainer = container.selectAll('g.lower')
                    .data([data]);

                lowerLineContainer.enter()
                    .append('g')
                    .attr('class', 'lower');

                lowerLineContainer.call(lowerLine);
            });
        };

        bollingerBands.xScale = fc.utilities.property(d3.time.scale());
        bollingerBands.yScale = fc.utilities.property(d3.scale.linear());
        bollingerBands.yValue = fc.utilities.property(function(d) { return d.close; });
        bollingerBands.xValue = fc.utilities.property(function(d) { return d.date; });
        bollingerBands.writeCalculatedValue = fc.utilities.property(function(d, value) { d.bollingerBands = value; });
        bollingerBands.readCalculatedValue = fc.utilities.property(function(d) { return d.bollingerBands; });

        d3.rebind(bollingerBands, algorithm, 'multiplier', 'windowSize');

        return bollingerBands;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function() {

        var algorithm = fc.indicators.algorithms.slidingWindow()
            .accumulator(d3.mean);

        var averageLine = fc.series.line();

        var movingAverage = function(selection) {

            algorithm.inputValue(movingAverage.yValue.value)
                .outputValue(movingAverage.writeCalculatedValue.value);

            averageLine.xScale(movingAverage.xScale.value)
                .yScale(movingAverage.yScale.value)
                .xValue(movingAverage.xValue.value)
                .yValue(movingAverage.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                d3.select(this)
                    .call(averageLine);
            });
        };

        movingAverage.xScale = fc.utilities.property(d3.time.scale());
        movingAverage.yScale = fc.utilities.property(d3.scale.linear());
        movingAverage.yValue = fc.utilities.property(function(d) { return d.close; });
        movingAverage.xValue = fc.utilities.property(function(d) { return d.date; });
        movingAverage.writeCalculatedValue = fc.utilities.property(function(d, value) { d.movingAverage = value; });
        movingAverage.readCalculatedValue = fc.utilities.property(function(d) { return d.movingAverage; });

        d3.rebind(movingAverage, algorithm, 'windowSize');

        return movingAverage;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.relativeStrengthIndicator = function() {

        var algorithm = fc.indicators.algorithms.relativeStrengthIndicator();
        var annotations = fc.tools.annotation();
        var rsiLine = fc.series.line();

        var rsi = function(selection) {

            algorithm.outputValue(rsi.writeCalculatedValue.value);

            annotations.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value);

            rsiLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(rsi.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var annotationsContainer = container.selectAll('g.annotations')
                    .data([[
                        rsi.upperValue.value.apply(this, arguments),
                        50,
                        rsi.lowerValue.value.apply(this, arguments)
                    ]]);

                annotationsContainer.enter()
                    .append('g')
                    .attr('class', 'annotations');

                annotationsContainer.call(annotations);

                var rsiLineContainer = container.selectAll('g.indicator')
                    .data([data]);

                rsiLineContainer.enter()
                    .append('g')
                    .attr('class', 'indicator');

                rsiLineContainer.call(rsiLine);
            });
        };

        rsi.xScale = fc.utilities.property(d3.time.scale());
        rsi.yScale = fc.utilities.property(d3.scale.linear());
        rsi.xValue = fc.utilities.property(function(d) { return d.date; });
        rsi.writeCalculatedValue = fc.utilities.property(function(d, value) { d.rsi = value; });
        rsi.readCalculatedValue = fc.utilities.property(function(d) { return d.rsi; });
        rsi.upperValue = fc.utilities.functorProperty(70);
        rsi.lowerValue = fc.utilities.functorProperty(30);

        d3.rebind(rsi, algorithm, 'openValue', 'closeValue', 'windowSize');

        return rsi;
    };
}(d3, fc));
/* globals computeLayout */
(function(d3, fc, cssLayout) {
    'use strict';


    d3.selection.prototype.layout = function(name, value) {
        var layout = fc.layout();
        var n = arguments.length;
        if (n === 2) {
            if (typeof name !== 'string') {
                // layout(number, number) - sets the width and height and performs layout
                layout.width(name).height(value);
                this.call(layout);
            } else {
                // layout(name, value) - sets a layout- attribute
                this.attr('layout-css', name + ':' + value);
            }
        } else if (n === 1) {
            if (typeof name !== 'string') {
                // layout(object) - sets the layout-css property to the given object
                var styleObject = name;
                var layoutCss = Object.keys(styleObject)
                    .map(function(property) {
                        return property + ':' + styleObject[property];
                    })
                    .join(';');
                this.attr('layout-css', layoutCss);
            } else {
                // layout(name) - returns the value of the layout-name attribute
                return Number(this.attr('layout-' + name));
            }
        } else if (n === 0) {
            // layout() - executes layout
            this.call(layout);
        }
        return this;
    };

    fc.layout = function() {

        // parses the style attribute, converting it into a JavaScript object
        function parseStyle(style) {
            if (!style) {
                return {};
            }
            var properties = style.split(';');
            var json = {};
            properties.forEach(function(property) {
                var components = property.split(':');
                if (components.length === 2) {
                    var name = components[0].trim();
                    var value = components[1].trim();
                    json[name] = isNaN(value) ? value : Number(value);
                }
            });
            return json;
        }

        // creates the structure required by the layout engine
        function createNodes(el) {
            function getChildNodes() {
                var children = [];
                for (var i = 0; i < el.childNodes.length; i++) {
                    var child = el.childNodes[i];
                    if (child.nodeType === 1) {
                        if (child.getAttribute('layout-css')) {
                            children.push(createNodes(child));
                        }
                    }
                }
                return children;
            }
            return {
                style: parseStyle(el.getAttribute('layout-css')),
                children: getChildNodes(el),
                element: el,
                layout: {
                    width: undefined,
                    height: undefined,
                    top: 0,
                    left: 0
                }
            };
        }

        // takes the result of layout and applied it to the SVG elements
        function applyLayout(node) {
            node.element.setAttribute('layout-width', node.layout.width);
            node.element.setAttribute('layout-height', node.layout.height);
            if (node.element.nodeName.match(/(?:svg|rect)/i)) {
                node.element.setAttribute('width', node.layout.width);
                node.element.setAttribute('height', node.layout.height);
                node.element.setAttribute('x', node.layout.left);
                node.element.setAttribute('y', node.layout.top);
            } else {
                node.element.setAttribute('transform',
                    'translate(' + node.layout.left + ', ' + node.layout.top + ')');
            }
            node.children.forEach(applyLayout);
        }

        var layout = function(selection) {
            selection.each(function(data) {
                // compute the width and height of the SVG element
                var style = getComputedStyle(this);
                var width, height;

                if (layout.width.value !== -1) {
                    width = layout.width.value;
                } else {
                    width = parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                }
                if (layout.height.value !== -1) {
                    height = layout.height.value;
                } else {
                    height = parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
                }

                // create the layout nodes
                var layoutNodes = createNodes(this);
                // set the width / height of the root
                layoutNodes.style.width = width;
                layoutNodes.style.height = height;

                // use the Facebook CSS goodness
                cssLayout.computeLayout(layoutNodes);

                // apply the resultant layout
                applyLayout(layoutNodes);
            });
        };

        layout.width = fc.utilities.property(-1);
        layout.height = fc.utilities.property(-1);

        return layout;
    };

}(d3, fc, computeLayout));
(function(d3, fc) {
    'use strict';

    fc.scale.dateTime = function() {
        return dateTimeScale();
    };

    // obtains the ticks from the given scale, transforming the result to ensure
    // it does not include any discontinuities
    fc.scale.dateTime.tickTransformer = function(ticks, discontinuityProvider, domain) {
        var clampedTicks = ticks.map(function(tick, index) {
            if (index < ticks.length - 1) {
                return discontinuityProvider.clampUp(tick);
            } else {
                var clampedTick = discontinuityProvider.clampUp(tick);
                return clampedTick < domain[1] ?
                    clampedTick : discontinuityProvider.clampDown(tick);
            }
        });
        var uniqueTicks = clampedTicks.reduce(function(arr, tick) {
            if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
                arr.push(tick);
            }
            return arr;
        }, []);
        return uniqueTicks;
    };

    /**
    * The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
    * As an example, you can use this scale to render a chart where the weekends are skipped.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.dateTime
    */
    function dateTimeScale(adaptedScale, discontinuityProvider) {

        if (!arguments.length) {
            adaptedScale = d3.time.scale();
            discontinuityProvider = fc.scale.discontinuity.identity();
        }

        function discontinuities() { return scale.discontinuityProvider.value; }

        function scale(date) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            // The discontinuityProvider is responsible for determine the distance between two points
            // along a scale that has discontinuities (i.e. sections that have been removed).
            // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
            // over the domain of this axis, versus the discontinuous distance to 'x'
            var totalDomainDistance = discontinuities().distance(domain[0], domain[1]);
            var distanceToX = discontinuities().distance(domain[0], date);
            var ratioToX = distanceToX / totalDomainDistance;
            var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
            return scaledByRange;
        }

        scale.invert = function(x) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            var ratioToX = (x - range[0]) / (range[1] - range[0]);
            var totalDomainDistance = discontinuities().distance(domain[0], domain[1]);
            var distanceToX = ratioToX * totalDomainDistance;
            return discontinuities().offset(domain[0], distanceToX);
        };

        scale.domain = function(x) {
            if (!arguments.length) {
                return adaptedScale.domain();
            }
            // clamp the upper and lower domain values to ensure they
            // do not fall within a discontinuity
            var domainLower = discontinuities().clampUp(x[0]);
            var domainUpper = discontinuities().clampDown(x[1]);
            adaptedScale.domain([domainLower, domainUpper]);
            return scale;
        };

        scale.nice = function() {
            adaptedScale.nice();
            var domain = adaptedScale.domain();
            var domainLower = discontinuities().clampUp(domain[0]);
            var domainUpper = discontinuities().clampDown(domain[1]);
            adaptedScale.domain([domainLower, domainUpper]);
            return scale;
        };

        scale.ticks = function() {
            var ticks = adaptedScale.ticks.apply(this, arguments);
            return fc.scale.dateTime.tickTransformer(ticks, discontinuities(), scale.domain());
        };

        scale.copy = function() {
            return dateTimeScale(adaptedScale.copy(), discontinuities().copy());
        };

        scale.discontinuityProvider = fc.utilities.property(discontinuityProvider);

        return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
            'tickFormat');
    }

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.identity = function() {

        var identity = {};

        identity.distance = function(startDate, endDate) {
            return endDate.getTime() - startDate.getTime();
        };

        identity.offset = function(startDate, ms) {
            return new Date(startDate.getTime() + ms);
        };

        identity.clampUp = fc.utilities.fn.identity;

        identity.clampDown = fc.utilities.fn.identity;

        identity.copy = function() { return identity; };

        return identity;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.skipWeekends = function() {
        var millisPerDay = 24 * 3600 * 1000;
        var millisPerWorkWeek = millisPerDay * 5;
        var millisPerWeek = millisPerDay * 7;

        var skipWeekends = {};

        function isWeekend(date) {
            return date.getDay() === 0 || date.getDay() === 6;
        }

        skipWeekends.clampDown = function(date) {
            if (isWeekend(date)) {
                var daysToSubtract = date.getDay() === 0 ? 2 : 1;
                // round the date up to midnight
                var newDate = d3.time.day.ceil(date);
                // then subtract the required number of days
                return d3.time.day.offset(newDate, -daysToSubtract);
            } else {
                return date;
            }
        };

        skipWeekends.clampUp = function(date) {
            if (isWeekend(date)) {
                var daysToAdd = date.getDay() === 0 ? 1 : 2;
                // round the date down to midnight
                var newDate = d3.time.day.floor(date);
                // then add the required number of days
                return d3.time.day.offset(newDate, daysToAdd);
            } else {
                return date;
            }
        };

        // returns the number of included milliseconds (i.e. those which do not fall)
        // within discontinuities, along this scale
        skipWeekends.distance = function(startDate, endDate) {
            startDate = skipWeekends.clampUp(startDate);
            endDate = skipWeekends.clampDown(endDate);

            // move the start date to the end of week boundary
            var offsetStart = d3.time.saturday.ceil(startDate);
            if (endDate < offsetStart) {
                return endDate.getTime() - startDate.getTime();
            }

            var msAdded = offsetStart.getTime() - startDate.getTime();

            // move the end date to the end of week boundary
            var offsetEnd = d3.time.saturday.ceil(endDate);
            var msRemoved = offsetEnd.getTime() - endDate.getTime();

            // determine how many weeks there are between these two dates
            var weeks = (offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek;

            return weeks * millisPerWorkWeek + msAdded - msRemoved;
        };

        skipWeekends.offset = function(startDate, ms) {
            var date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;
            var remainingms = ms;

            // move to the end of week boundary
            var endOfWeek = d3.time.saturday.ceil(date);
            remainingms -= (endOfWeek.getTime() - date.getTime());

            // if the distance to the boundary is greater than the number of ms
            // simply add the ms to the current date
            if (remainingms < 0) {
                return new Date(date.getTime() + ms);
            }

            // skip the weekend
            date = d3.time.day.offset(endOfWeek, 2);

            // add all of the complete weeks to the date
            var completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
            date = d3.time.day.offset(date, completeWeeks * 7);
            remainingms -= completeWeeks * millisPerWorkWeek;

            // add the remaining time
            date = new Date(date.getTime() + remainingms);
            return date;
        };

        skipWeekends.copy = function() { return skipWeekends; };

        return skipWeekends;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.scale.gridlines = function() {

        var gridlines = function(selection) {

            selection.each(function() {

                var container = d3.select(this);

                var xLines = fc.utilities.simpleDataJoin(container, 'x',
                    gridlines.xScale.value.ticks(gridlines.xTicks.value));

                xLines.enter()
                    .append('line')
                    .attr('class', 'gridline');

                xLines.select('line')
                    .attr({
                        'x1': gridlines.xScale.value,
                        'x2': gridlines.xScale.value,
                        'y1': gridlines.yScale.value.range()[0],
                        'y2': gridlines.yScale.value.range()[1]
                    });

                var yLines = fc.utilities.simpleDataJoin(container, 'y',
                    gridlines.yScale.value.ticks(gridlines.yTicks.value));

                yLines.enter()
                    .append('line')
                    .attr('class', 'gridline');

                yLines.select('line')
                    .attr({
                        'x1': gridlines.xScale.value.range()[0],
                        'x2': gridlines.xScale.value.range()[1],
                        'y1': gridlines.yScale.value,
                        'y2': gridlines.yScale.value
                    });


            });
        };

        gridlines.xScale = fc.utilities.property(d3.time.scale());
        gridlines.yScale = fc.utilities.property(d3.scale.linear());
        gridlines.xTicks = fc.utilities.property(10);
        gridlines.yTicks = fc.utilities.property(10);


        return gridlines;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.area = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return area.xScale.value(area.xValue.value(d)); };
        var y0 = function(d) { return area.yScale.value(area.y0Value.value(d)); };
        var y1 = function(d) { return area.yScale.value(area.y1Value.value(d)); };

        var areaData = d3.svg.area()
            .defined(function(d) {
                return !isNaN(y0(d)) && !isNaN(y1(d));
            })
            .x(x)
            .y0(y0)
            .y1(y1);

        var area = function(selection) {

            selection.each(function(data) {

                var path = d3.select(this)
                    .selectAll('path.area')
                    .data([data]);

                path.enter()
                    .append('path')
                    .attr('class', 'area');

                path.attr('d', areaData);

                area.decorate.value(path);
            });
        };

        area.decorate = fc.utilities.property(fc.utilities.fn.noop);
        area.xScale = fc.utilities.property(d3.time.scale());
        area.yScale = fc.utilities.property(d3.scale.linear());
        area.y0Value = fc.utilities.functorProperty(0);
        area.y1Value = fc.utilities.property(function(d) { return d.close; });
        area.xValue = fc.utilities.property(function(d) { return d.date; });


        return area;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return bar.xScale.value(bar.xValue.value(d)); };
        var barTop = function(d) { return bar.yScale.value(bar.y0Value.value(d) + bar.yValue.value(d)); };
        var barBottom = function(d) { return bar.yScale.value(bar.y0Value.value(d)); };

        var bar = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);
                var series = fc.utilities.simpleDataJoin(container, 'bar', data, bar.xValue.value);

                // enter
                series.enter()
                    .append('rect');

                var width = bar.barWidth.value(data.map(x));

                // update
                series.select('rect')
                    .attr('x', function(d) {
                        return x(d) - width / 2;
                    })
                    .attr('y', barTop)
                    .attr('width', width)
                    .attr('height', function(d) {
                        return barBottom(d) - barTop(d);
                    });

                // properties set by decorate will transition too
                bar.decorate.value(series);
            });
        };

        bar.decorate = fc.utilities.property(fc.utilities.fn.noop);
        bar.xScale = fc.utilities.property(d3.time.scale());
        bar.yScale = fc.utilities.property(d3.scale.linear());
        bar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        bar.yValue = fc.utilities.property(function(d) { return d.close; });
        bar.xValue = fc.utilities.property(function(d) { return d.date; });
        bar.y0Value = fc.utilities.functorProperty(0);

        return bar;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return candlestick.xScale.value(candlestick.xValue.value(d)); };
        var yOpen = function(d) { return candlestick.yScale.value(candlestick.yOpenValue.value(d)); };
        var yHigh = function(d) { return candlestick.yScale.value(candlestick.yHighValue.value(d)); };
        var yLow = function(d) { return candlestick.yScale.value(candlestick.yLowValue.value(d)); };
        var yClose = function(d) { return candlestick.yScale.value(candlestick.yCloseValue.value(d)); };

        var candlestick = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'candlestick', data, candlestick.xValue.value);

                g.enter()
                    .append('path');

                g.classed({
                        'up': function(d) {
                            return candlestick.yCloseValue.value(d) > candlestick.yOpenValue.value(d);
                        },
                        'down': function(d) {
                            return candlestick.yCloseValue.value(d) < candlestick.yOpenValue.value(d);
                        }
                    });

                var barWidth = candlestick.barWidth.value(data.map(x));

                g.select('path')
                    .attr('d', function(d) {
                        // Move to the opening price
                        var body = 'M' + (x(d) - barWidth / 2) + ',' + yOpen(d) +
                        // Draw the width
                        'h' + barWidth +
                        // Draw to the closing price (vertically)
                        'V' + yClose(d) +
                        // Draw the width
                        'h' + -barWidth +
                        // Move back to the opening price
                        'V' + yOpen(d) +
                        // Close the path
                        'z';

                        // Move to the max price of close or open; draw the high wick
                        // N.B. Math.min() is used as we're dealing with pixel values,
                        // the lower the pixel value, the higher the price!
                        var highWick = 'M' + x(d) + ',' + Math.min(yClose(d), yOpen(d)) +
                        'V' + yHigh(d);

                        // Move to the min price of close or open; draw the low wick
                        // N.B. Math.max() is used as we're dealing with pixel values,
                        // the higher the pixel value, the lower the price!
                        var lowWick = 'M' + x(d) + ',' + Math.max(yClose(d), yOpen(d)) +
                        'V' + yLow(d);

                        return body + highWick + lowWick;
                    });

                candlestick.decorate.value(g);
            });
        };

        candlestick.decorate = fc.utilities.property(fc.utilities.fn.noop);
        candlestick.xScale = fc.utilities.property(d3.time.scale());
        candlestick.yScale = fc.utilities.property(d3.scale.linear());
        candlestick.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        candlestick.yOpenValue = fc.utilities.property(function(d) { return d.open; });
        candlestick.yHighValue = fc.utilities.property(function(d) { return d.high; });
        candlestick.yLowValue = fc.utilities.property(function(d) { return d.low; });
        candlestick.yCloseValue = fc.utilities.property(function(d) { return d.close; });
        candlestick.xValue = fc.utilities.property(function(d) { return d.date; });

        return candlestick;

    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return line.xScale.value(line.xValue.value(d)); };
        var y = function(d) { return line.yScale.value(line.yValue.value(d)); };

        var lineData = d3.svg.line()
            .defined(function(d) {
                return !isNaN(y(d));
            })
            .x(x)
            .y(y);

        var line = function(selection) {

            selection.each(function(data) {

                var path = d3.select(this)
                    .selectAll('path.line')
                    .data([data]);

                path.enter()
                    .append('path')
                    .attr('class', 'line');

                path.attr('d', lineData);

                line.decorate.value(path);
            });
        };

        line.decorate = fc.utilities.property(fc.utilities.fn.noop);
        line.xScale = fc.utilities.property(d3.time.scale());
        line.yScale = fc.utilities.property(d3.scale.linear());
        line.yValue = fc.utilities.property(function(d) { return d.close; });
        line.xValue = fc.utilities.property(function(d) { return d.date; });

        return line;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.multi = function() {

        var multi = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = container.selectAll('g.multi-outer')
                    .data(multi.series.value);

                g.enter()
                    .append('g')
                    .attr('class', 'multi-outer')
                    .append('g')
                    .attr('class', 'multi-inner');

                g.exit()
                    .remove();

                g.select('g.multi-inner')
                    .each(function() {

                        var series = d3.select(this.parentNode)
                            .datum()
                            .xScale(multi.xScale.value)
                            .yScale(multi.yScale.value);

                        d3.select(this)
                            .datum(multi.mapping.value(data, series))
                            .call(series);
                    });
            });
        };

        multi.xScale = fc.utilities.property(d3.time.scale());
        multi.yScale = fc.utilities.property(d3.scale.linear());
        multi.series = fc.utilities.property([]);
        multi.mapping = fc.utilities.property(fc.utilities.fn.identity);

        return multi;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return ohlc.xScale.value(ohlc.xValue.value(d)); };
        var yOpen = function(d) { return ohlc.yScale.value(ohlc.yOpenValue.value(d)); };
        var yHigh = function(d) { return ohlc.yScale.value(ohlc.yHighValue.value(d)); };
        var yLow = function(d) { return ohlc.yScale.value(ohlc.yLowValue.value(d)); };
        var yClose = function(d) { return ohlc.yScale.value(ohlc.yCloseValue.value(d)); };

        var ohlc = function(selection) {
            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'ohlc', data, ohlc.xValue.value);

                g.enter()
                    .append('path');

                g.classed({
                        'up': function(d) {
                            return ohlc.yCloseValue.value(d) > ohlc.yOpenValue.value(d);
                        },
                        'down': function(d) {
                            return ohlc.yCloseValue.value(d) < ohlc.yOpenValue.value(d);
                        }
                    });

                var width = ohlc.barWidth.value(data.map(x));
                var halfWidth = width / 2;

                g.select('path')
                    .attr('d', function(d) {
                        var moveToLow = 'M' + x(d) + ',' + yLow(d),
                            verticalToHigh = 'V' + yHigh(d),
                            openTick = 'M' + x(d) + ',' + yOpen(d) + 'h' + (-halfWidth),
                            closeTick = 'M' + x(d) + ',' + yClose(d) + 'h' + halfWidth;
                        return moveToLow + verticalToHigh + openTick + closeTick;
                    });

                ohlc.decorate.value(g);
            });
        };

        ohlc.decorate = fc.utilities.property(fc.utilities.fn.noop);
        ohlc.xScale = fc.utilities.property(d3.time.scale());
        ohlc.yScale = fc.utilities.property(d3.scale.linear());
        ohlc.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        ohlc.yOpenValue = fc.utilities.property(function(d) { return d.open; });
        ohlc.yHighValue = fc.utilities.property(function(d) { return d.high; });
        ohlc.yLowValue = fc.utilities.property(function(d) { return d.low; });
        ohlc.yCloseValue = fc.utilities.property(function(d) { return d.close; });
        ohlc.xValue = fc.utilities.property(function(d) { return d.date; });

        return ohlc;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.point = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return point.xScale.value(point.xValue.value(d)); };
        var y = function(d) { return point.yScale.value(point.yValue.value(d)); };

        var point = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = fc.utilities.simpleDataJoin(container, 'point', data, point.xValue.value);

                g.enter()
                    .append('circle');

                g.select('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', point.radius.value);

                point.decorate.value(g);
            });
        };

        point.decorate = fc.utilities.property(fc.utilities.fn.noop);
        point.xScale = fc.utilities.property(d3.time.scale());
        point.yScale = fc.utilities.property(d3.scale.linear());
        point.yValue = fc.utilities.property(function(d) { return d.close; });
        point.xValue = fc.utilities.property(function(d) { return d.date; });
        point.radius = fc.utilities.functorProperty(5);

        return point;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackLayout = d3.layout.stack();

        var stackedBar = function(selection) {

            var bar = fc.series.bar()
                .xScale(stackedBar.xScale.value)
                .yScale(stackedBar.yScale.value)
                .xValue(stackLayout.x())
                .yValue(stackLayout.y())
                .y0Value(stackedBar.y0Value.value);

            selection.each(function(data) {

                var layers = stackLayout(data);

                var container = d3.select(this);

                // Pull data from series objects.
                var layeredData = layers.map(stackLayout.values());

                var series = container.selectAll('g.stacked-bar')
                    .data(layeredData)
                    .enter()
                    .append('g')
                    .attr('class', 'stacked-bar')
                    .call(bar);

                stackedBar.decorate.value(series);
            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        // Implicitly dependant on the implementation of the stack layout's `out`.
        stackedBar.y0Value = fc.utilities.property(function(d) {
            return d.y0;
        });

        return fc.utilities.rebind(stackedBar, stackLayout, {
            xValue: 'x',
            yValue: 'y',
            out: 'out',
            offset: 'offset',
            values: 'values',
            order: 'order'
        });
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var annotation = function(selection) {
            selection.each(function(data) {
                var xScaleRange = annotation.xScale.value.range(),
                    y = function(d) { return annotation.yScale.value(annotation.yValue.value(d)); };

                var container = d3.select(this);

                // Create a group for each annotation
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, annotation.keyValue.value);

                // Added the required elements - each annotation consists of a line and text label
                var enter = g.enter();
                enter.append('line');
                enter.append('text');

                // Update the line
                g.select('line')
                    .attr('x1', xScaleRange[0])
                    .attr('y1', y)
                    .attr('x2', xScaleRange[1])
                    .attr('y2', y);

                // Update the text label
                var paddingValue = annotation.padding.value.apply(this, arguments);
                g.select('text')
                    .attr('x', xScaleRange[1] - paddingValue)
                    .attr('y', function(d) { return y(d) - paddingValue; })
                    .text(annotation.label.value);

                annotation.decorate.value(g);
            });
        };

        annotation.xScale = fc.utilities.property(d3.time.scale());
        annotation.yScale = fc.utilities.property(d3.scale.linear());
        annotation.yValue = fc.utilities.functorProperty(fc.utilities.fn.identity);
        annotation.keyValue = fc.utilities.functorProperty(fc.utilities.fn.index);
        annotation.label = fc.utilities.functorProperty(annotation.yValue.value);
        annotation.padding = fc.utilities.functorProperty(2);
        annotation.decorate = fc.utilities.property(fc.utilities.fn.noop);

        return annotation;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend');

        var crosshairs = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__crosshairs__) {
                    data.__crosshairs__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.crosshairs', mouseenter);

                if (!data.__crosshairs__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__crosshairs__.overlay = true;
                }

                // ordinal axes have a rangeExtent function, this adds any padding that
                // was applied to the range. This functions returns the rangeExtent
                // if present, or range otherwise
                function rangeForScale(scaleProperty) {
                    return scaleProperty.value.rangeExtent ?
                        scaleProperty.value.rangeExtent() : scaleProperty.value.range();
                }

                function rangeStart(scaleProperty) {
                    return rangeForScale(scaleProperty)[0];
                }

                function rangeEnd(scaleProperty) {
                    return rangeForScale(scaleProperty)[1];
                }

                container.select('rect')
                    .attr('x', rangeStart(crosshairs.xScale))
                    .attr('y', rangeEnd(crosshairs.yScale))
                    .attr('width', rangeEnd(crosshairs.xScale))
                    .attr('height', rangeStart(crosshairs.yScale));

                var g = fc.utilities.simpleDataJoin(container, 'crosshairs', data);

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.horizontal')
                    .attr('x1', rangeStart(crosshairs.xScale))
                    .attr('x2', rangeEnd(crosshairs.xScale))
                    .attr('y1', function(d) { return d.y; })
                    .attr('y2', function(d) { return d.y; });

                g.select('line.vertical')
                    .attr('y1', rangeStart(crosshairs.yScale))
                    .attr('y2', rangeEnd(crosshairs.yScale))
                    .attr('x1', function(d) { return d.x; })
                    .attr('x2', function(d) { return d.x; });

                var paddingValue = crosshairs.padding.value.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', rangeEnd(crosshairs.xScale) - paddingValue)
                    .attr('y', function(d) {
                        return d.y - paddingValue;
                    })
                    .text(crosshairs.yLabel.value);

                g.select('text.vertical')
                    .attr('x', function(d) {
                        return d.x - paddingValue;
                    })
                    .attr('y', paddingValue)
                    .text(crosshairs.xLabel.value);

                crosshairs.decorate.value(g);
            });
        };

        function mouseenter() {
            var mouse = d3.mouse(this);
            var container = d3.select(this)
                .on('mousemove.crosshairs', mousemove)
                .on('mouseleave.crosshairs', mouseleave);
            var snapped = crosshairs.snap.value.apply(this, mouse);
            var data = container.datum();
            data.push(snapped);
            container.call(crosshairs);
            event.trackingstart.apply(this, arguments);
        }

        function mousemove() {
            var mouse = d3.mouse(this);
            var container = d3.select(this);
            var snapped = crosshairs.snap.value.apply(this, mouse);
            var data = container.datum();
            data[data.length - 1] = snapped;
            container.call(crosshairs);
            event.trackingmove.apply(this, arguments);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            data.pop();
            container.call(crosshairs)
                .on('mousemove.crosshairs', null)
                .on('mouseleave.crosshairs', null);
            event.trackingend.apply(this, arguments);
        }

        crosshairs.xScale = fc.utilities.property(d3.time.scale());
        crosshairs.yScale = fc.utilities.property(d3.scale.linear());
        crosshairs.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        crosshairs.decorate = fc.utilities.property(fc.utilities.fn.noop);
        crosshairs.xLabel = fc.utilities.functorProperty('');
        crosshairs.yLabel = fc.utilities.functorProperty('');
        crosshairs.padding = fc.utilities.functorProperty(2);

        d3.rebind(crosshairs, event, 'on');

        return crosshairs;
    };

}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.tools.fibonacciFan = function() {

        var event = d3.dispatch('fansource', 'fantarget', 'fanclear');

        var fan = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__fan__) {
                    data.__fan__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.fan', mouseenter);

                if (!data.__fan__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__fan__.overlay = true;
                }

                container.select('rect')
                    .attr('x', fan.xScale.value.range()[0])
                    .attr('y', fan.yScale.value.range()[1])
                    .attr('width', fan.xScale.value.range()[1])
                    .attr('height', fan.yScale.value.range()[0]);

                var g = fc.utilities.simpleDataJoin(container, 'fan', data);

                g.each(function(d) {
                    d.x = fan.xScale.value.range()[1];
                    d.ay = d.by = d.cy = d.target.y;

                    if (d.source.x !== d.target.x) {

                        if (d.state === 'DONE' && d.source.x > d.target.x) {
                            var temp = d.source;
                            d.source = d.target;
                            d.target = temp;
                        }

                        var gradient = (d.target.y - d.source.y) /
                            (d.target.x - d.source.x);
                        var deltaX = d.x - d.source.x;
                        var deltaY = gradient * deltaX;
                        d.ay = 0.618 * deltaY + d.source.y;
                        d.by = 0.500 * deltaY + d.source.y;
                        d.cy = 0.382 * deltaY + d.source.y;
                    }
                });

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'trend');
                enter.append('line')
                    .attr('class', 'a');
                enter.append('line')
                    .attr('class', 'b');
                enter.append('line')
                    .attr('class', 'c');
                enter.append('polygon')
                    .attr('class', 'area');

                g.select('line.trend')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                g.select('line.a')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.ay; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.b')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.by; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.c')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.cy; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('polygon.area')
                    .attr('points', function(d) {
                        return d.source.x + ',' + d.source.y + ' ' +
                            d.x + ',' + d.ay + ' ' +
                            d.x + ',' + d.cy;
                    })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                fan.decorate.value(g);
            });
        };

        function updatePositions() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            if (datum.state !== 'DONE') {
                var mouse = d3.mouse(this);
                var snapped = fan.snap.value.apply(this, mouse);
                if (datum.state === 'SELECT_SOURCE') {
                    datum.source = datum.target = snapped;
                } else if (datum.state === 'SELECT_TARGET') {
                    datum.target = snapped;
                } else {
                    throw new Error('Unknown state ' + datum.state);
                }
            }
        }

        function mouseenter() {
            var container = d3.select(this)
                .on('click.fan', mouseclick)
                .on('mousemove.fan', mousemove)
                .on('mouseleave.fan', mouseleave);
            var data = container.datum();
            if (data[0] == null) {
                data.push({
                    state: 'SELECT_SOURCE'
                });
            }
            updatePositions.call(this);
            container.call(fan);
        }

        function mousemove() {
            var container = d3.select(this);
            updatePositions.call(this);
            container.call(fan);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
                data.pop();
            }
            container.on('click.fan', null)
                .on('mousemove.fan', null)
                .on('mouseleave.fan', null);
        }

        function mouseclick() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            switch (datum.state) {
                case 'SELECT_SOURCE':
                    updatePositions.call(this);
                    event.fansource.apply(this, arguments);
                    datum.state = 'SELECT_TARGET';
                    break;
                case 'SELECT_TARGET':
                    updatePositions.call(this);
                    event.fantarget.apply(this, arguments);
                    datum.state = 'DONE';
                    break;
                case 'DONE':
                    event.fanclear.apply(this, arguments);
                    datum.state = 'SELECT_SOURCE';
                    updatePositions.call(this);
                    break;
                default:
                    throw new Error('Unknown state ' + datum.state);
            }
            container.call(fan);
        }

        fan.xScale = fc.utilities.property(d3.time.scale());
        fan.yScale = fc.utilities.property(d3.scale.linear());
        fan.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        fan.decorate = fc.utilities.property(fc.utilities.fn.noop);

        d3.rebind(fan, event, 'on');

        return fan;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.measure = function() {

        var event = d3.dispatch('measuresource', 'measuretarget', 'measureclear');

        var measure = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__measure__) {
                    data.__measure__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.measure', mouseenter);

                if (!data.__measure__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__measure__.overlay = true;
                }

                container.select('rect')
                    .attr('x', measure.xScale.value.range()[0])
                    .attr('y', measure.yScale.value.range()[1])
                    .attr('width', measure.xScale.value.range()[1])
                    .attr('height', measure.yScale.value.range()[0]);

                var g = fc.utilities.simpleDataJoin(container, 'measure', data);

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'tangent');
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.tangent')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                g.select('line.horizontal')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.source.y; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.vertical')
                    .attr('x1', function(d) { return d.target.x; })
                    .attr('y1', function(d) { return d.target.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.source.y; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                var paddingValue = measure.padding.value.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', function(d) { return d.source.x + (d.target.x - d.source.x) / 2; })
                    .attr('y', function(d) { return d.source.y - paddingValue; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                    .text(measure.xLabel.value);

                g.select('text.vertical')
                    .attr('x', function(d) { return d.target.x + paddingValue; })
                    .attr('y', function(d) { return d.source.y + (d.target.y - d.source.y) / 2; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                    .text(measure.yLabel.value);

                measure.decorate.value(g);
            });
        };

        function updatePositions() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            if (datum.state !== 'DONE') {
                var mouse = d3.mouse(this);
                var snapped = measure.snap.value.apply(this, mouse);
                if (datum.state === 'SELECT_SOURCE') {
                    datum.source = datum.target = snapped;
                } else if (datum.state === 'SELECT_TARGET') {
                    datum.target = snapped;
                } else {
                    throw new Error('Unknown state ' + datum.state);
                }
            }
        }

        function mouseenter() {
            var container = d3.select(this)
                .on('click.measure', mouseclick)
                .on('mousemove.measure', mousemove)
                .on('mouseleave.measure', mouseleave);
            var data = container.datum();
            if (data[0] == null) {
                data.push({
                    state: 'SELECT_SOURCE'
                });
            }
            updatePositions.call(this);
            container.call(measure);
        }

        function mousemove() {
            var container = d3.select(this);
            updatePositions.call(this);
            container.call(measure);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
                data.pop();
            }
            container.on('click.measure', null)
                .on('mousemove.measure', null)
                .on('mouseleave.measure', null);
        }

        function mouseclick() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            switch (datum.state) {
                case 'SELECT_SOURCE':
                    updatePositions.call(this);
                    event.measuresource.apply(this, arguments);
                    datum.state = 'SELECT_TARGET';
                    break;
                case 'SELECT_TARGET':
                    updatePositions.call(this);
                    event.measuretarget.apply(this, arguments);
                    datum.state = 'DONE';
                    break;
                case 'DONE':
                    event.measureclear.apply(this, arguments);
                    datum.state = 'SELECT_SOURCE';
                    updatePositions.call(this);
                    break;
                default:
                    throw new Error('Unknown state ' + datum.state);
            }
            container.call(measure);
        }

        measure.xScale = fc.utilities.property(d3.time.scale());
        measure.yScale = fc.utilities.property(d3.scale.linear());
        measure.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        measure.decorate = fc.utilities.property(fc.utilities.fn.noop);
        measure.xLabel = fc.utilities.functorProperty('');
        measure.yLabel = fc.utilities.functorProperty('');
        measure.padding = fc.utilities.functorProperty(2);

        d3.rebind(measure, event, 'on');

        return measure;
    };

}(d3, fc));