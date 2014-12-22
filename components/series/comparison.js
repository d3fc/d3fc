(function(d3, fc) {
    'use strict';

    fc.series.comparison = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = fc.utilities.valueAccessor('date'),
            yValue = fc.utilities.valueAccessor('close');

        // Internal use
        var cachedData, cachedScale,
            xValueInternal = fc.utilities.valueAccessor('xValue');

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

        var percentageChange = function(seriesData, initialXValue) {
            // Computes the percentage change data of a series from an initial xValue.
            var initialIndex = findIndex(seriesData, initialXValue, xValue) - 1;
            var initialYValue = yValue(seriesData[initialIndex]);

            return seriesData.map(function(d) {
                return {
                    xValue: xValue(d),
                    change: (yValue(d) / initialYValue) - 1
                };
            });
        };

        var rebaseChange = function(seriesData, initialXValue) {
            // Change the initial xValue the percentage changes should be based from.
            var initialIndex = findIndex(seriesData, initialXValue, xValueInternal) - 1;
            var initialChange = seriesData[initialIndex].change;

            return seriesData.map(function(d) {
                return {
                    xValue: xValueInternal(d),
                    change: d.change - initialChange
                };
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

        var line = d3.svg.line()
            .interpolate('linear')
            .x(function(d) {
                return xScale(xValueInternal(d));
            })
            .y(function(d) {
                return yScale(d.change);
            });

        var comparison = function(selection) {
            var series, lines;

            selection.each(function(data) {

                data = data.map(function(d) {
                    return {
                        data: percentageChange(d, xScale.domain()[0])
                    };
                });

                cachedData = data; // Save for rebasing.

                yScale.domain(calculateYDomain(data, xScale.domain()));
                cachedScale = yScale.copy();

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

        comparison.zoom = function(selection) {
            // Apply a transformation for each line to update its position wrt the new initial xValue,
            // then apply the yScale transformation to reflect the updated yScale domain.
            var xTransformScale = d3.event.scale,
                xTransformTranslate = d3.event.translate[0],
                initialIndex,
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
                    data: rebaseChange(d.data, xScale.domain()[0])
                };
            });

            yScale.domain(calculateYDomain(domainData, xScale.domain()));
            yTransform = yScaleTransform(cachedScale, yScale);

            cachedData = cachedData.map(function(d) {
                initialIndex = findIndex(d.data, xScale.domain()[0], xValueInternal) - 1;
                return {
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

        comparison.xValue = function(value) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = value;
            return comparison;
        };

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