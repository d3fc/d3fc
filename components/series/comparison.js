(function(d3, fc) {
    'use strict';

    /**
     * <p>Constructs an instance of the comparison series component.
     * This component plots the relative percentage changes of a collection of data series.
     * For each series, a path is drawn showing the percentage change from an initial
     * x value taken as the value nearest to the x value which precedes the start of the x scale's domain.</p>
     *
     * <p>The data bound to the element should be an array of arrays,
     * with the inner array's elements being JavaScript objects.
     * By default, the component looks for 'date' and 'close' properties in these objects
     * for the x values and y values respectively. This behavior can be customised by specifying
     * {@link fc.series.comparison#xValue|xValue} and
     * {@link fc.series.comparison#yValue|yValue} accessor functions.</p>
     *
     * <p>Note that the yScale domain is modified by this component automatically to fit
     * the extent of the percentage changes of the paths. As such, one should call any
     * axis component which uses this scale after calling this component's
     * {@link fc.series.comparison#comparison|create/update function} or
     * {@link fc.series.comparison#zoom|zoom listener}. To set the tickFormat of the axis component
     * to display percentages, use axis.tickFormat(d3.format('%'))</p>
     *
     *
     * @type {object}
     * @memberof fc.series
     * @namespace fc.series.comparison
     */
    fc.series.comparison = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = fc.utilities.valueAccessor('date'),
            yValue = fc.utilities.valueAccessor('close');

        var xValueInternal = fc.utilities.valueAccessor('xValue');

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

        var findIndex = function(seriesData, value, xAccessor) {
            // Find insertion point of an xValue in seriesData.
            var bisect = d3.bisector(
                function(d) {
                    return xAccessor(d);
                }).left;

            var initialIndex = bisect(seriesData, value);
            if (initialIndex === 0) {
                // Google finance style, calculate changes from the
                // xValue one before initial xValue if possible, or index 0.
                initialIndex += 1;
            }
            return initialIndex;
        };

        var percentageChange = function(seriesData, initialXValue, rebase) {
            // Computes the percentage change data of a series from an initial xValue.
            // or changes the initial xValue existing percentage changes should be based from.
            var xAccessor = rebase ? xValueInternal : xValue;
            var initialIndex = findIndex(seriesData, initialXValue, xAccessor) - 1;
            return seriesData.map(function(d) {
                if (rebase) {
                    return {xValue: xAccessor(d), change: d.change - seriesData[initialIndex].change};
                } else {
                    return {xValue: xAccessor(d), change: (yValue(d) / yValue(seriesData[initialIndex])) - 1};
                }
            });
        };

        var calculateYDomain = function(data, xDomain) {
            var start, end;

            data = data.map(function(series) {
                series = series.data;
                start = findIndex(series, xDomain[0], xValueInternal) - 1;
                end = findIndex(series, xDomain[1], xValueInternal) + 1;
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

        var lineTransform = function(initialYScale, initialChange, yTransform, xTransform) {
            var yTransformTranslate = initialYScale(0) - initialYScale(initialChange);

            yTransformTranslate *= yTransform.scale;
            yTransformTranslate += yTransform.translate;
            return 'translate(' + xTransform.translate + ',' + yTransformTranslate + ')' +
                ' scale(' + xTransform.scale + ',' + yTransform.scale + ')';
        };

        var line = d3.svg.line().interpolate('linear');

        /**
         * Applies the component to a D3 selection.
         * Creates/updates the series comparison line paths, and modifies the yScale domain
         * to make each path visible throughout the extent of the x scale's domain.
         *
         * @memberof fc.series.comparison#
         * @method comparison
         * @param {selection} selection - A D3 selection
         */
        var comparison = function(selection) {
            var series, lines;

            selection.each(function(data) {
                // Save the current scales on the element.
                this.__chart__ = this.__chart__ || {};
                var chartYScale = this.__chart__.yScale || yScale;
                var chartXScale = this.__chart__.xScale || xScale;
                this.__chart__.yScale = chartYScale;
                this.__chart__.xScale = chartXScale;

                data = data.map(function(d) {
                    return {
                        data: percentageChange(d, chartXScale.domain()[0])
                    };
                });
                chartYScale.domain(calculateYDomain(data, chartXScale.domain()));

                this.__chart__.initialData = data;
                this.__chart__.initialYScale = chartYScale.copy();

                line.x(function(d) {
                        return chartXScale(xValueInternal(d));
                    })
                    .y(function(d) {
                        return chartYScale(d.change);
                    });

                series = d3.select(this).selectAll('.comparison-series').data([data]);
                series.enter().append('g').classed('comparison-series', true);

                lines = series.selectAll('.line')
                    .data(data)
                    .enter().append('path').classed('line', true);

                series.selectAll('.line')
                    .attr('class', function(d) {
                        return 'line ' + 'line' + data.indexOf(d);
                    })
                    .attr('d', function(d) {
                        return line(d.data);
                    })
                    // Remove existing transform
                    .attr('transform', null);
            });
        };

        /**
         * A zoom 'listener'. Updates the positions of each line path given a change to
         * the x scale domain by setting an SVG transform property on each path.
         *
         * It assumes the x scale's domain is controlled using a d3.behavior.zoom component.
         *
         * @memberof fc.series.comparison#
         * @method zoom
         * @param {selection} selection - A D3 selection.
         */
        comparison.zoom = function(selection) {
            // Apply a transformation for each line to update its position wrt the new initial xValue,
            // then apply the yScale transformation to reflect the updated yScale domain.
            selection.each(function() {
                var initialData = this.__chart__.initialData,
                    initialYScale = this.__chart__.initialYScale,
                    chartXScale = this.__chart__.xScale,
                    chartYScale = this.__chart__.yScale,
                    yTransform,
                    yDomain,
                    xTransform = {
                        scale: d3.event.scale,
                        translate: d3.event.translate[0]
                    },
                    domainData = initialData.map(function(d) {
                        return {
                            data: percentageChange(d.data, chartXScale.domain()[0], true)
                        };
                    });

                // Set the new y domain
                yDomain = calculateYDomain(domainData, chartXScale.domain());
                chartYScale.domain(yDomain);
                yTransform = yScaleTransform(initialYScale, chartYScale);
                // Set a transform for each line
                selection.selectAll('.line')
                    .attr('visibility', function() {return (yDomain[0] || yDomain[1]) ? 'visible' : 'hidden';})
                    .attr('transform', function(d) {
                        var initialIndex = findIndex(d.data, chartXScale.domain()[0], xValueInternal) - 1;
                        if (yDomain[0] || yDomain[1]) {
                            return lineTransform(initialYScale, d.data[initialIndex].change, yTransform, xTransform);
                        } else {
                            return null;
                        }
                    });
            });
        };

        /**
         * Get/set the x scale
         *
         * @memberof fc.series.comparison#
         * @method xScale
         * @param  {scale} [value] The scale used for the x dimension
         * @returns {scale|comparison} If value is specified, sets the scale and returns
         * the component's create/update function. If value is not specified, returns the current x scale.
         */
        comparison.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return comparison;
        };

        /**
         * Get/set the y scale
         *
         * @memberof fc.series.comparison#
         * @method yScale
         * @param  {scale} [value] The scale used for the y dimension
         * @returns {scale|comparison} If value is specified, sets the scale and returns
         * the component's create/update function. If value is not specified, returns the current y scale.
         */
        comparison.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return comparison;
        };

        /**
         * Get/set the x accessor function
         *
         * @memberof fc.series.comparison#
         * @method xValue
         * @param  {accessor} [value = fc.utilities.valueAccessor('date')] -
         * A function that retrieves x values from a data object.
         * @returns {accessor|comparison} If value is specified, sets the accessor and returns
         * the component's create/update function. If value is not specified, returns the current accessor.
         */
        comparison.xValue = function(value) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = value;
            return comparison;
        };

        /**
         * Get/set the y accessor function
         *
         * @memberof fc.series.comparison#
         * @method yValue
         * @param  {accessor} [value = fc.utilities.valueAccessor('close')] -
         * A function that retrieves y values from a data object.
         * @returns {accessor|comparison} If value is specified, sets the accessor and returns
         * the component's create/update function. If value is not specified, returns the current accessor.
         */
        comparison.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return comparison;
        };

        return comparison;
    };
}(d3, fc));