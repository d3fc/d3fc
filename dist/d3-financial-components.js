sl = {
    version: '0.0.0',
    indicators: {},
    scale: {},
    series: {},
    tools: {},
    utilities: {}
};
(function(d3, sl) {

    var weekdayCache = {};
    var dateCache = {};

    // Returns the weekday number for the given date relative to January 1, 1970.
    function weekday(date) {
        if (date in weekdayCache) {
            return weekdayCache[date];
        }
        var weekdays = weekdayOfYear(date),
            year = date.getFullYear();
        while (--year >= 1970) weekdays += weekdaysInYear(year);

        weekdayCache[date] = weekdays;
        return weekdays;
    }

    // Returns the date for the specified weekday number relative to January 1, 1970.
    weekday.invert = function(weekdays) {
        if (weekdays in dateCache) {
            return dateCache[weekdays];
        }
        var year = 1970,
            yearWeekdays,
            result;

        // Compute the year.
        while ((yearWeekdays = weekdaysInYear(year)) <= weekdays) {
            ++year;
            weekdays -= yearWeekdays;
        }

        // Compute the date from the remaining weekdays.
        var days = weekdays % 5,
            day0 = ((new Date(year, 0, 1)).getDay() + 6) % 7;
        if (day0 + days > 4) days += 2;

        result = new Date(year, 0, (weekdays / 5 | 0) * 7 + days + 1);
        dateCache[weekdays] = result;
        return result;
    };

    // Returns the number of weekdays in the specified year.
    function weekdaysInYear(year) {
        return weekdayOfYear(new Date(year, 11, 31)) + 1;
    }

    // Returns the weekday number for the given date relative to the start of the year.
    function weekdayOfYear(date) {
        var days = d3.time.dayOfYear(date),
            weeks = days / 7 | 0,
            day0 = (d3.time.year(date).getDay() + 6) % 7,
            day1 = day0 + days - weeks * 7;
        return Math.max(0, days - weeks * 2
            - (day0 <= 5 && day1 >= 5 || day0 <= 12 && day1 >= 12) // extra saturday
            - (day0 <= 6 && day1 >= 6 || day0 <= 13 && day1 >= 13)); // extra sunday
    }

    sl.utilities.weekday = weekday;

}(d3, sl));

(function (d3, sl) {
	'use strict';

	sl.indicators.bollingerBands = function () {

		var xScale = d3.time.scale(),
			yScale = d3.scale.linear();

		var yValue = 0,
			movingAverage = 20,
			standardDeviations = 2;

		var cssBandArea = 'bollingerBandArea',
			cssBandUpper = 'bollingerBandUpper',
			cssBandLower = 'bollingerBandLower',
			cssAverage = 'bollingerAverage';

		var bollingerBands = function (selection) {

			var areaBands = d3.svg.area(),
				lineUpper = d3.svg.line(),
				lineLower = d3.svg.line(),
				lineAverage = d3.svg.line();

			areaBands.x(function (d) { return xScale(d.date); });
			lineUpper.x(function (d) { return xScale(d.date); });
			lineLower.x(function (d) { return xScale(d.date); });
			lineAverage.x(function (d) { return xScale(d.date); });

			var calculateMovingAverage = function (data, i) {

				if (movingAverage === 0) {
					return data[i][yValue];
				}

				var count = Math.min(movingAverage, i + 1),
				first = i + 1 - count;

				var sum = 0;
				for (var index = first; index <= i; ++index) {
					var x = data[index][yValue];
					sum += x;
				}

				return sum / count;
			};

			var calculateMovingStandardDeviation = function (data, i, avg) {

				if (movingAverage === 0) {
					return 0;
				}

				var count = Math.min(movingAverage, i + 1),
					first = i + 1 - count;

				var sum = 0;
				for (var index = first; index <= i; ++index) {
					var x = data[index][yValue];
					var dx = x - avg;
					sum += (dx * dx);
				}

				var variance = sum / count;
				return Math.sqrt(variance);
			};

			selection.each(function (data) {

				var bollingerData = {};
				for (var index = 0; index < data.length; ++index) {

					var date = data[index].date;

					var avg = calculateMovingAverage(data, index);
					var sd = calculateMovingStandardDeviation(data, index, avg);

					bollingerData[date] = {avg: avg, sd: sd};
				}

				areaBands.y0(function (d) {

					var avg = bollingerData[d.date].avg;
					var sd = bollingerData[d.date].sd;

					return yScale(avg + (sd * standardDeviations));
				});

				areaBands.y1(function (d) {

					var avg = bollingerData[d.date].avg;
					var sd = bollingerData[d.date].sd;

					return yScale(avg - (sd * standardDeviations));
				});

				lineUpper.y(function (d) {

					var avg = bollingerData[d.date].avg;
					var sd = bollingerData[d.date].sd;

					return yScale(avg + (sd * standardDeviations));
				});

				lineLower.y(function (d) {

					var avg = bollingerData[d.date].avg;
					var sd = bollingerData[d.date].sd;

					return yScale(avg - (sd * standardDeviations));
				});

				lineAverage.y(function (d) {

					var avg = bollingerData[d.date].avg;

					return yScale(avg);
				});

				var prunedData = [];
				for (var index = movingAverage; index < data.length; ++index) {
					prunedData.push(data[index]);
				}

				var pathArea = d3.select(this).selectAll('.area')
					.data([prunedData]);
				var pathUpper = d3.select(this).selectAll('.upper')
					.data([prunedData]);
				var pathLower = d3.select(this).selectAll('.lower')
					.data([prunedData]);
				var pathAverage = d3.select(this).selectAll('.average')
					.data([prunedData]);

				pathArea.enter().append('path');
				pathUpper.enter().append('path');
				pathLower.enter().append('path');
				pathAverage.enter().append('path');

				pathArea.attr('d', areaBands)
					.classed('area', true)
					.classed(cssBandArea, true);
				pathUpper.attr('d', lineUpper)
					.classed('upper', true)
					.classed(cssBandUpper, true);
				pathLower.attr('d', lineLower)
					.classed('lower', true)
					.classed(cssBandLower, true);
				pathAverage.attr('d', lineAverage)
					.classed('average', true)
					.classed(cssAverage, true);

				pathArea.exit().remove();
				pathUpper.exit().remove();
				pathLower.exit().remove();
				pathAverage.exit().remove();
			});
		};

		bollingerBands.xScale = function (value) {
			if (!arguments.length) {
				return xScale;
			}
			xScale = value;
			return bollingerBands;
		};

		bollingerBands.yScale = function (value) {
			if (!arguments.length) {
				return yScale;
			}
			yScale = value;
			return bollingerBands;
		};

		bollingerBands.yValue = function (value) {
			if (!arguments.length) {
				return yValue;
			}
			yValue = value;
			return bollingerBands;
		};

		bollingerBands.movingAverage = function (value) {
			if (!arguments.length) {
				return movingAverage;
			}
			if (value >= 0) {
				movingAverage = value;
			}
			return bollingerBands;
		};

		bollingerBands.standardDeviations = function (value) {
			if (!arguments.length) {
				return standardDeviations;
			}
			if (value >= 0) {
				standardDeviations = value;
			}
			return bollingerBands;
		};

		bollingerBands.cssBandUpper = function (value) {
			if (!arguments.length) {
				return cssBandUpper;
			}
			cssBandUpper = value;
			return bollingerBands;
		};

		bollingerBands.cssBandLower = function (value) {
			if (!arguments.length) {
				return cssBandLower;
			}
			cssBandLower = value;
			return bollingerBands;
		};

		bollingerBands.cssBandArea = function (value) {
			if (!arguments.length) {
				return cssBandArea;
			}
			cssBandArea = value;
			return bollingerBands;
		};

		bollingerBands.cssAverage = function (value) {
			if (!arguments.length) {
				return cssAverage;
			}
			cssAverage = value;
			return bollingerBands;
		};

		return bollingerBands;
	};
}(d3, sl));

(function (d3, sl) {
	'use strict';

	sl.indicators.movingAverage = function () {

		var xScale = d3.time.scale(),
			yScale = d3.scale.linear(),
			yValue = 0,
			yLabel = '',
			averagePoints = 0,
			css = '';

		var movingAverage = function (selection) {
			var line = d3.svg.line();
			line.x(function (d) { return xScale(d.date); });

			selection.each(function (data) {

				if (!isNaN(parseFloat(yValue))) {
					line.y(yScale(yValue));
				}
				else {
					if (averagePoints === 0) {
						line.y(function (d) { return yScale(d[yValue]); });
					}
					else {
						line.y(function (d, i) {
							var count = Math.min(averagePoints, i + 1),
							    first = i + 1 - count;

							var sum = 0;
							for (var index = first; index <= i; ++index) {
							    sum += data[index][yValue];
							}
							var mean = sum / count;

							return yScale(mean);
						});
					}
				}

				var path = d3.select(this).selectAll('.indicator')
					.data([data]);

				path.enter().append('path');

				path.attr('d', line)
					.classed('indicator', true)
					.classed(css, true);

				path.exit().remove();
			});
		};

		movingAverage.xScale = function (value) {
			if (!arguments.length) {
				return xScale;
			}
			xScale = value;
			return movingAverage;
		};

		movingAverage.yScale = function (value) {
			if (!arguments.length) {
				return yScale;
			}
			yScale = value;
			return movingAverage;
		};

		movingAverage.yValue = function (value) {
			if (!arguments.length) {
				return yValue;
			}
			yValue = value;
			return movingAverage;
		};

		movingAverage.yLabel = function (value) {
			if (!arguments.length) {
				return yLabel;
			}
			yLabel = value;
			return movingAverage;
		};

		movingAverage.averagePoints = function (value) {
			if (!arguments.length) {
				return averagePoints;
			}
			if (value >= 0) {
			averagePoints = value;
			}
			return movingAverage;
		};

		movingAverage.css = function (value) {
			if (!arguments.length) {
				return css;
			}
			css = value;
			return movingAverage;
		};

		return movingAverage;
	};
}(d3, sl));

(function (d3, sl) {
	'use strict';

	sl.indicators.rsi = function () {

		var xScale = d3.time.scale(),
			yScale = d3.scale.linear(),
			samplePeriods = 14,
			upperMarker = 70,
			lowerMarker = 30,
			lambda = 1.0,
			css = '';

		var upper = null,
			centre = null,
			lower = null;

		var rsi = function (selection) {

			selection.selectAll('.marker').remove();

			upper = selection.append("line")
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
			line.x(function (d) { return xScale(d.date); });

			selection.each(function (data) {

				if (samplePeriods === 0) {
					line.y(function (d) { return yScale(0); });
				}
				else {
					line.y(function (d, i) {
						var from = i - samplePeriods,
							to = i,
							up = [],
							down = [];

						if(from < 1) from = 1;

						for( var offset = to; offset >= from; offset--) {
							var dnow = data[offset],
							dprev = data[offset-1];

							var weight = Math.pow(lambda, offset);
							up.push(dnow.close > dprev.close ? (dnow.close - dprev.close) * weight : 0);
							down.push(dnow.close < dprev.close ? (dprev.close - dnow.close) * weight : 0);
						}

						if(up.length <= 0 || down.length <= 0) return yScale(0);

						var rsi = 100 - (100/(1+(d3.mean(up)/d3.mean(down))));
						return yScale(rsi);
					});
				}

				var path = d3.select(this).selectAll('.rsi')
					.data([data]);

				path.enter().append('path');

				path.attr('d', line)
					.classed('rsi', true)
					.classed(css, true);

				path.exit().remove();
			});
		};

		rsi.xScale = function (value) {
			if (!arguments.length) {
				return xScale;
			}
			xScale = value;
			return rsi;
		};

		rsi.yScale = function (value) {
			if (!arguments.length) {
				return yScale;
			}
			yScale = value;
			return rsi;
		};

		rsi.samplePeriods = function (value) {
			if (!arguments.length) {
				return samplePeriods;
			}
			samplePeriods = value < 0 ? 0 : value;
			return rsi;
		};

		rsi.upperMarker = function (value) {
			if (!arguments.length) {
				return upperMarker;
			}
			upperMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
			return rsi;
		};

		rsi.lowerMarker = function (value) {
			if (!arguments.length) {
				return lowerMarker;
			}
			lowerMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
			return rsi;
		};

		rsi.lambda = function (value) {
			if (!arguments.length) {
				return lambda;
			}
			lambda = value > 1.0 ? 1.0 : (value < 0.0 ? 0.0 : value);
			return rsi;
		};

		rsi.css = function (value) {
			if (!arguments.length) {
				return css;
			}
			css = value;
			return rsi;
		};

		return rsi;
	};
}(d3, sl));
(function (d3, sl) {
    'use strict';

    var weekday = sl.utilities.weekday

    sl.scale.finance = function () {
        return financialScale();
    };

    function financialScale(linear) {

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        function scale(x) {
            if (typeof x === 'number') {
                // When scaling ticks.
                return linear(x);
            } else {
                // When scaling dates.
                return linear(weekday(x));
            }
        };

        scale.copy = function () {
            return financialScale(linear.copy());
        };

        scale.domain = function (domain) {
            if (!arguments.length) {
                return linear.domain().map(weekday.invert);
            }
            if (typeof domain[0] === 'number') {
                linear.domain(domain);
            } else {
                linear.domain(domain.map(weekday));
            }
            return scale;
        };

        scale.ticks = function (n) {
            return arguments.length ? linear.ticks(n) : linear.ticks();
        };

        scale.tickFormat = function (count, f) {
            return function(n) {
                var date = weekday.invert(n);
                return d3.time.format('%b %e')(date);
            };
        };

        scale.invert = function (pixel) {
            return weekday.invert(linear.invert(pixel))
        };

        return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp", "nice");
    }
}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.scale.gridlines = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xTicks = 10,
            yTicks = 10;

        var xLines = function (data, grid) {
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

        var yLines = function (data, grid) {
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

        var gridlines = function (selection) {
            var grid, xTickData, yTickData;

            selection.each(function () {
                xTickData = xScale.ticks(xTicks);
                yTickData = yScale.ticks(yTicks);

                grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
                grid.enter().append('g').classed('gridlines', true);
                xLines(xTickData, grid);
                yLines(yTickData, grid);
            });
        };

        gridlines.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return gridlines;
        };

        gridlines.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return gridlines;
        };

        gridlines.xTicks = function (value) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = value;
            return gridlines;
        };

        gridlines.yTicks = function (value) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = value;
            return gridlines;
        };

        return gridlines;
    };
}(d3, sl));

(function (d3, sl) {
    'use strict';

    sl.series.candlestick = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var rectangleWidth = 5;

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var line = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var highLowLines = function (bars) {

            var paths = bars.selectAll('.high-low-line').data(function (d) {
                return [d];
            });

            paths.enter().append('path');

            paths.classed('high-low-line', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });
        };

        var rectangles = function (bars) {
            var rect;

            rect = bars.selectAll('rect').data(function (d) {
                return [d];
            });

            rect.enter().append('rect');

            rect.attr('x', function (d) {
                return xScale(d.date) - rectangleWidth;
            })
                .attr('y', function (d) {
                    return isUpDay(d) ? yScale(d.close) : yScale(d.open);
                })
                .attr('width', rectangleWidth * 2)
                .attr('height', function (d) {
                    return isUpDay(d) ?
                        yScale(d.open) - yScale(d.close) :
                        yScale(d.close) - yScale(d.open);
                });
        };

        var candlestick = function (selection) {
            var series, bars;

            selection.each(function (data) {
                series = d3.select(this).selectAll('.candlestick-series').data([data]);

                series.enter().append('g')
                    .classed('candlestick-series', true);

                bars = series.selectAll('.bar')
                    .data(data, function (d) {
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

        candlestick.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return candlestick;
        };

        candlestick.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return candlestick;
        };

        candlestick.rectangleWidth = function (value) {
            if (!arguments.length) {
                return rectangleWidth;
            }
            rectangleWidth = value;
            return candlestick;
        };

        return candlestick;

    };
}(d3, sl));
// TODO where is yScaleTransform?
(function (d3, sl, yScaleTransform) {
    'use strict';

    sl.series.comparison = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var cachedData, cachedScale;

        var findIndex = function (seriesData, date) {
            var bisect = d3.bisector(
                function (d) {
                    return d.date;
                }).left;

            var initialIndex = bisect(seriesData, date);
            if (!initialIndex) {
                initialIndex += 1;
            }
            return initialIndex;
        };

        var percentageChange = function (seriesData, initialDate) {
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialClose = seriesData[initialIndex].close;

            return seriesData.map(function (d) {
                return {
                    date: d.date,
                    change: (d.close / initialClose) - 1
                };
            });
        };

        var rebaseChange = function (seriesData, initialDate) {
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialChange = seriesData[initialIndex].change;

            return seriesData.map(function (d) {
                return {
                    date: d.date,
                    change: d.change - initialChange
                };
            });
        };

         var calculateYDomain = function (data, xDomain) {
            var start, end;

            data = data.map(function (series) {
                series = series.data;
                start = findIndex(series,xDomain[0]) - 1;
                end = findIndex(series,xDomain[1]) + 1;
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
            .interpolate("linear")
            .x(function (d) {
                return xScale(d.date);
            })
            .y(function (d) {
                return yScale(d.change);
            });

        var comparison = function (selection) {
            var series, lines;

            selection.each(function (data) {

                data = data.map(function (d) {
                    return {
                        name: d.name,
                        data: percentageChange(d.data, xScale.domain()[0])
                    };
                });

                cachedData = data; // Save for rebasing.

                color.domain(data.map(function (d) {
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
                    .enter().append("path")
                    .attr("class", "line")
                    .attr("d", function (d) {
                        return line(d.data);
                    })
                    .style("stroke", function (d) {
                        return color(d.name);
                    });

                series.selectAll('.line')
                    .attr("d", function (d) {
                        return line(d.data);
                    });
            });
        };

        comparison.geometricZoom = function (selection, xTransformTranslate, xTransformScale) {
            // Apply a transformation for each line to update its position wrt the new initial date,
            // then apply the yScale transformation to reflect the updated yScale domain.

            var initialIndex,
                yTransform;

            var lineTransform = function (initialChange) {
                var yTransformLineTranslate = cachedScale(0) - cachedScale(initialChange);

                yTransformLineTranslate *= yTransform.scale;
                yTransformLineTranslate += yTransform.translate;

                return 'translate(' + xTransformTranslate + ',' + yTransformLineTranslate + ')' +
                    ' scale(' + xTransformScale + ',' + yTransform.scale + ')';
            };

            var domainData = cachedData.map(function (d) {
                return {
                    name: d.name,
                    data: rebaseChange(d.data, xScale.domain()[0])
                }
            });

            yScale.domain(calculateYDomain(domainData, xScale.domain()));
            yTransform = yScaleTransform(cachedScale, yScale);

            cachedData = cachedData.map(function (d) {
                initialIndex = findIndex(d.data, xScale.domain()[0]) - 1;
                return {
                    name: d.name,
                    data: d.data,
                    transform: lineTransform(d.data[initialIndex].change)
                };
            });

            selection.selectAll('.line')
                .data(cachedData)
                .attr('transform', function (d) { return d.transform; });
        };

        comparison.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return comparison;
        };

        comparison.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return comparison;
        };

        return comparison;
    };
}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.series.ohlc = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var tickWidth = 5;

        var line = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var highLowLines = function (bars) {

            var paths = bars.selectAll('.high-low-line').data(function (d) {
                return [d];
            });

            paths.enter().append('path');

            paths.classed('high-low-line', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.high) },
                        { x: xScale(d.date), y: yScale(d.low) }
                    ]);
                });
        };

        var openCloseTicks = function (bars) {
            var open,
                close;

            open = bars.selectAll('.open-tick').data(function (d) {
                return [d];
            });

            close = bars.selectAll('.close-tick').data(function (d) {
                return [d];
            });

            open.enter().append('path');
            close.enter().append('path');

            open.classed('open-tick', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date) - tickWidth, y: yScale(d.open) },
                        { x: xScale(d.date), y: yScale(d.open) }
                    ]);
                });

            close.classed('close-tick', true)
                .attr('d', function (d) {
                    return line([
                        { x: xScale(d.date), y: yScale(d.close) },
                        { x: xScale(d.date) + tickWidth, y: yScale(d.close) }
                    ]);
                });

            open.exit().remove();
            close.exit().remove();
        };

        var ohlc = function (selection) {
            var series, bars;

            selection.each(function (data) {
                // series = d3.select(this);

                series = d3.select(this).selectAll('.ohlc-series').data([data]);
                series.enter().append('g').classed('ohlc-series', true);

                bars = series.selectAll('.bar')
                    .data(data, function (d) {
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
                openCloseTicks(bars);

                bars.exit().remove();


            });
        };

        ohlc.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return ohlc;
        };

        ohlc.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return ohlc;
        };

        ohlc.tickWidth = function (value) {
            if (!arguments.length) {
                return tickWidth;
            }
            tickWidth = value;
            return ohlc;
        };

        return ohlc;

    };
}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.series.volume = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var barWidth = 5;

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var rectangles = function (bars) {
            var rect;

            rect = bars.selectAll('rect').data(function (d) {
                return [d];
            });

            rect.enter().append('rect');

            rect.attr('x', function (d) { return xScale(d.date) - barWidth; })
                .attr('y', function(d) { return yScale(d.volume); } )
                .attr('width', barWidth * 2)
                .attr('height', function(d) { return yScale(0) - yScale(d.volume); });
        };

        var volume = function (selection) {
            var series, bars;

            selection.each(function (data) {
                series = d3.select(this).selectAll('.volume-series').data([data]);

                series.enter().append('g')
                    .classed('volume-series', true);

                bars = series.selectAll('.volumebar')
                    .data(data, function (d) {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed('volumebar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });
                rectangles(bars);
                bars.exit().remove();
           });
        };

        volume.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return volume;
        };

        volume.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return volume;
        };

        volume.barWidth = function (value) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = value;
            return volume;
        };

        return volume;
    };
}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.tools.annotation = function () {

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

        var annotation = function (selection) {

            root = selection.append('g')
                .attr('id', 'annotation_' + index)
                .attr('class', 'annotation');

            line = root.append("line")
                .attr('class', 'marker')
                .attr('x1', xScale.range()[0]) 
                .attr('y1', yScale(yValue))
                .attr('x2', xScale.range()[1]) 
                .attr('y2', yScale(yValue));


            callout = root.append("text")
                .attr('class', 'callout')
                .attr('x', xScale.range()[1] - padding)
                .attr('y', yScale(yValue) - padding)
                .attr('style', 'text-anchor: end;')
                .text(yLabel + " : " + formatCallout(yValue));
        };

        annotation.index = function (value) {
            if (!arguments.length) {
                return index;
            }
            index = value;
            return annotation;
        };

        annotation.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return annotation;
        };

        annotation.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return annotation;
        };

        annotation.yValue = function (value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return annotation;
        };

        annotation.yLabel = function (value) {
            if (!arguments.length) {
                return yLabel;
            }
            yLabel = value;
            return annotation;
        };

        annotation.padding = function (value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return annotation;
        };

        annotation.formatCallout = function (value) {
            if (!arguments.length) {
                return formatCallout;
            }
            formatCallout = value;
            return annotation;
        };

        return annotation;
    };
}(d3, sl));
(function (d3, sl) {
    'use strict';

sl.tools.crosshairs = function () {

    var target = null,
        series = null,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yValue = null,
        formatH = null,
        formatV = null,
        active = true,
        freezable = true,
        padding = 2;

    var lineH = null,
        lineV = null,
        circle = null,
        calloutH = null,
        calloutV = null;

    var highlight = null,
        highlightedField = null;

    var crosshairs = function () {

        var root = target.append('g')
            .attr('class', 'crosshairs');

        lineH = root.append("line")
            .attr('class', 'crosshairs horizontal')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1])
            .attr('display', 'none');

        lineV = root.append("line")
            .attr('class', 'crosshairs vertical')
            .attr('y1', yScale.range()[0])
            .attr('y2', yScale.range()[1])
            .attr('display', 'none');

        circle = root.append("circle")
            .attr('class', 'crosshairs circle')
            .attr('r', 6)
            .attr('display', 'none');

        calloutH = root.append("text")
            .attr('class', 'crosshairs callout horizontal')
            .attr('x', xScale.range()[1] - padding)
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');

        calloutV = root.append("text")
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

            if (!data.hasOwnProperty(property) || (property === 'date')) {
                continue;
            }

            var dy = Math.abs(yTarget - data[property]);
            if (dy <= minDiff) {
                minDiff = dy;
                field = property;
            }
        }

        return field;
    }

    function redraw() {

        var x = xScale(highlight.date),
            y = yScale(highlight[highlightedField]);

        lineH.attr('y1', y)
            .attr('y2', y);
        lineV.attr('x1', x)
            .attr('x2', x);
        circle.attr('cx', x)
            .attr('cy', y);
        calloutH.attr('y', y - padding)
            .text(formatH(highlight[highlightedField], highlightedField));
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

            var mouse = d3.mouse(target[0][0]),
                xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                nearest = findNearest(xMouse);

            if (nearest !== null) {

                var field = null;
                if (nearest[yValue]) {
                    field = yValue;
                } else {
                    field = findField(yMouse, nearest);
                }

                if ((nearest !== highlight) || (field !== highlightedField)) {

                    highlight = nearest;
                    highlightedField = field;

                    redraw();
                }
            }
        }
    };

    crosshairs.clear = function() {

        highlight = null;
        highlightedField = null;

        lineH.attr('display', 'none');
        lineV.attr('display', 'none');
        circle.attr('display', 'none');
        calloutH.attr('display', 'none');
        calloutV.attr('display', 'none');
    };

    crosshairs.target = function (value) {
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

    crosshairs.series = function (value) {
        if (!arguments.length) {
            return series;
        }
        series = value;
        return crosshairs;
    };

    crosshairs.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return crosshairs;
    };

    crosshairs.yScale = function (value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return crosshairs;
    };

    crosshairs.yValue = function (value) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = value;
        return crosshairs;
    };

    crosshairs.formatH = function (value) {
        if (!arguments.length) {
            return formatH;
        }
        formatH = value;
        return crosshairs;
    };

    crosshairs.formatV = function (value) {
        if (!arguments.length) {
            return formatV;
        }
        formatV = value;
        return crosshairs;
    };

    crosshairs.active = function (value) {
        if (!arguments.length) {
            return active;
        }
        active = value;

        lineH.classed('frozen', !active);
        lineV.classed('frozen', !active);
        circle.classed('frozen', !active);

        return crosshairs;
    };

    crosshairs.freezable = function (value) {
        if (!arguments.length) {
            return freezable;
        }
        freezable = value;
        return crosshairs;
    };

    crosshairs.padding = function (value) {
        if (!arguments.length) {
            return padding;
        }
        padding = value;
        return crosshairs;
    };

    crosshairs.highlightedField = function() {
        return highlightedField;
    };

    return crosshairs;
};

}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.tools.fibonacciFan = function () {

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

        var fibonacciFan = function () {

            var root = target.append('g')
                .attr('class', 'fibonacci-fan');

            circleOrigin = root.append("circle")
                .attr('class', 'fibonacci-fan origin')
                .attr('r', 6)
                .attr('display', 'none');

            circleTarget = root.append("circle")
                .attr('class', 'fibonacci-fan target')
                .attr('r', 6)
                .attr('display', 'none');

            lineSource = root.append("line")
                .attr('class', 'fibonacci-fan source')
                .attr('display', 'none');

            lineA = root.append("line")
                .attr('class', 'fibonacci-fan a')
                .attr('display', 'none');

            lineB = root.append("line")
                .attr('class', 'fibonacci-fan b')
                .attr('display', 'none');

            lineC = root.append("line")
                .attr('class', 'fibonacci-fan c')
                .attr('display', 'none');

            fanArea = root.append("polygon")
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

            var mouse = d3.mouse(target[0][0]),
                xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                point = findPoint(xMouse);

            if (point !== null) {

                var field = findField(yMouse, point);

                if (field !== null) {

                    return { point: point, field: field }
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

                if (!data.hasOwnProperty(property) || (property === 'date')) {
                    continue;
                }

                var dy = Math.abs(yTarget - data[property]);
                if (dy <= minDiff) {
                    minDiff = dy;
                    field = property;
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

                var pointsFinal = originX + ',' + originY
                    + ' ' + finalX + ',' + finalY.a
                    + ' ' + finalX + ',' + finalY.c;

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

            var points = originX + ',' + originY
                + ' ' + finalX + ',' + finalYa
                + ' ' + finalX + ',' + finalYc;

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

        fibonacciFan.update = function () {

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

        fibonacciFan.visible = function (value) {

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

        fibonacciFan.target = function (value) {
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

        fibonacciFan.series = function (value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return fibonacciFan;
        };

        fibonacciFan.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return fibonacciFan;
        };

        fibonacciFan.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return fibonacciFan;
        };

        fibonacciFan.active = function (value) {
            if (!arguments.length) {
                return active;
            }
            active = value;
            return fibonacciFan;
        };

        return fibonacciFan;
    };

}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.tools.measure = function () {

        var target = null,
            series = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            active = true,
            padding = 2,
            formatH = null,
            formatV = null;

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

        var measure = function () {

            var root = target.append('g')
                .attr('class', 'measure');

            circleOrigin = root.append("circle")
                .attr('class', 'measure origin')
                .attr('r', 6)
                .attr('display', 'none');

            circleTarget = root.append("circle")
                .attr('class', 'measure target')
                .attr('r', 6)
                .attr('display', 'none');

            lineSource = root.append("line")
                .attr('class', 'measure source')
                .attr('display', 'none');

            lineX = root.append("line")
                .attr('class', 'measure x')
                .attr('display', 'none');

            lineY = root.append("line")
                .attr('class', 'measure y')
                .attr('display', 'none');

            calloutX = root.append("text")
                .attr('class', 'measure callout horizontal')
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');

            calloutY = root.append("text")
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

            var mouse = d3.mouse(target[0][0]),
                xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                point = findPoint(xMouse);

            if (point !== null) {

                var field = findField(yMouse, point);

                if (field !== null) {

                    return { point: point, field: field }
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

                if (!data.hasOwnProperty(property) || (property === 'date')) {
                    continue;
                }

                var dy = Math.abs(yTarget - data[property]);
                if (dy <= minDiff) {
                    minDiff = dy;
                    field = property;
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

            calloutX.attr('x', targetX - padding)
                .attr('y', originY - (originY - targetY) / 2.0)
                .text(formatV(Math.abs(locationTarget.point[locationTarget.field] - locationOrigin.point[locationOrigin.field])));
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

        measure.update = function () {

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

        measure.visible = function (value) {

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

        measure.target = function (value) {
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

        measure.series = function (value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return measure;
        };

        measure.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return measure;
        };

        measure.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return measure;
        };

        measure.active = function (value) {
            if (!arguments.length) {
                return active;
            }
            active = value;
            return measure;
        };

        measure.padding = function (value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return measure;
        };

        measure.formatH = function (value) {
            if (!arguments.length) {
                return formatH;
            }
            formatH = value;
            return measure;
        };

        measure.formatV = function (value) {
            if (!arguments.length) {
                return formatV;
            }
            formatV = value;
            return measure;
        };

        return measure;
    };

}(d3, sl));
(function (d3, sl) {
    'use strict';

    sl.utilities.chartLayout = function () {

        // Default values
        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        var chartLayout = function (selection) {
            selection.each( function () {
                var element = d3.select(this),
                    style = getComputedStyle(this);

                // Attempt to automatically size the chart to the selected element
                if (defaultWidth === true) {
                    // Set the width of the chart to the width of the selected element,
                    // excluding any margins, padding or borders
                    var paddingWidth = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
                    width = this.clientWidth - paddingWidth;

                    // If the new width is too small, use a default width
                    if (chartLayout.innerWidth() < 1) {
                        width = 800 + margin.left + margin.right;
                    }
                }

                if (defaultHeight === true) {
                    // Set the height of the chart to the height of the selected element,
                    // excluding any margins, padding or borders
                    var paddingHeight = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
                    height = this.clientHeight - paddingHeight;

                    // If the new height is too small, use a default height
                    if (chartLayout.innerHeight() < 1) {
                        height = 400 + margin.top + margin.bottom;
                    }
                }

                // Create svg
                var svg = element.append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // Create group for the chart
                var chart =  svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // Clipping path
                chart.append('defs').append('clipPath')
                    .attr('id', 'plotAreaClip')
                    .append('rect')
                    .attr({ width: chartLayout.innerWidth(), height: chartLayout.innerHeight() });

                // Create plot area, using the clipping path
                chart.append('g')
                    .attr('clip-path', 'url(#plotAreaClip)')
                    .attr('class', 'plotArea');
            });
        };

        chartLayout.marginTop = function (value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return chartLayout;
        };

        chartLayout.marginRight = function (value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return chartLayout;
        };

        chartLayout.marginBottom = function (value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return chartLayout;
        };

        chartLayout.marginLeft = function (value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return chartLayout;
        };

        chartLayout.width = function (value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return chartLayout;
        };

        chartLayout.height = function (value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return chartLayout;
        };

        chartLayout.innerWidth = function () {
            var innerWidth = width - margin.left - margin.right;
            return innerWidth;
        };

        chartLayout.innerHeight = function () {
            var innerHeight = height - margin.top - margin.bottom;
            return innerHeight;
        };

        return chartLayout;
    };
}(d3, sl));
(function (sl, moment, jStat) {
    'use strict';

    sl.utilities.dataGenerator = function () {

        var mu = 0.1,
            sigma = 0.1,
            startingPrice = 100,
            startingVolume = 100000,
            intraDaySteps = 50,
            volumeNoiseFactor = 0.3,
            toDate = new Date(),
            fromDate = new Date(),
            filter = function (moment) {
                return !(moment.day() === 0 || moment.day() === 6);
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
            // Geometric Brownian motion model.
            var deltaY = period / steps,
                sqrtDeltaY = Math.sqrt(deltaY),
                deltaW = jStat().randn(1, steps).multiply(sqrtDeltaY),
                increments =  deltaW
                    .multiply(sigma)
                    .add((mu - ((sigma * sigma) / 2)) * deltaY),
                expIncrements = increments.map(function (x) {
                    return Math.exp(x);
                });

            return jStat.row(expIncrements, 0);
        };

        var generate = function() {

            var range = moment().range(fromDate, toDate),
                msec_per_year = 3.15569e10,
                rangeYears = range / msec_per_year,
                daysIncluded = 0,
                prices,
                volume,
                ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            range.by('days', function (moment) {
                if (!filter || filter(moment)) {
                    daysIncluded += 1;
                }
            });

            prices = generatePrices(rangeYears, daysIncluded * intraDaySteps);
            volume = generateVolumes(rangeYears, daysIncluded);

            range.by('days', function (moment) {
                if (!filter || filter(moment)) {
                    daySteps = prices.slice(currentIntraStep, currentIntraStep + intraDaySteps);
                    ohlcv.push({
                        date: moment.toDate(),
                        open: daySteps[0],
                        high: Math.max.apply({}, daySteps),
                        low: Math.min.apply({}, daySteps),
                        close: daySteps[intraDaySteps - 1],
                        volume: volume[currentStep]
                    });
                    currentIntraStep += intraDaySteps;
                    currentStep += 1
                }
            });

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
}(sl, moment, jStat));
//# sourceMappingURL=d3-financial-components.js.map