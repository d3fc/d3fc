(function(d3, fc) {
    'use strict';

    var chartLayout = fc.utilities.chartLayout();

    // Setup the chart
    var chart = d3.select('#stacked-bar')
        .call(chartLayout);

    d3.csv('stackedBarData.csv', function(error, data) {

        // Collect all series keys.
        var seriesKeys = data.reduce(function(previous, current) {
            var currentKeys = fc.utilities.object.keys(current).filter(function(element) { 
                return element !== 'State';
            });
            return previous.concat(currentKeys);
        }, []);
        seriesKeys = d3.set(seriesKeys).values();
        
        // Create an array of series objects.
        var series = seriesKeys.map(function(element) {
            return { name: element, data: [] };
        });

        // Populate those series objects with data objects.
        var series = data.reduce(function(series, current) {
            series.forEach(function(element) {
                element.data.push({
                    state: current.State,
                    value: parseFloat(current[element.name])
                });
            });

            return series;
        }, series);

        // Collect the X values.
        var xCategories = series.reduce(function(previous, current) {
            return previous.concat(current.data.map(function(element) { return element.state; }));
        }, []);
        xCategories = d3.set(xCategories).values();

        // create scales
        var x = d3.scale.ordinal()
            .domain(xCategories)
            .rangePoints([0, chartLayout.getPlotAreaWidth()], 1);

        var color = d3.scale.category10();

        var y = d3.scale.linear()
          .domain([0, 40000000])
          .nice()
          .range([chartLayout.getPlotAreaHeight(), 0]);

        // add axes
        var bottomAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');
        chartLayout.getAxisContainer('bottom').call(bottomAxis);

        var rightAxis = d3.svg.axis()
            .scale(y)
            .orient('right')
            .ticks(5);
        chartLayout.getAxisContainer('right').call(rightAxis);

        var stack = fc.series.stackedBar()
            .xScale(x)
            .yScale(y)
            .values(function(d) { return d.data; })
            .x(function(d) { return d.state; })
            .y(function(d) { return d.value; })
            .decorate(function(sel) {
                sel.attr('fill', function(d, i) {
                    return color(i);
                });
            });

        chartLayout.getPlotArea(chart)
          .append('g')
          .attr('class', 'series')
          .datum(series)
          .call(stack);

        function findClosest(arr, minimize) {
            var nearestIndex = 0,
              nearestDiff = Number.MAX_VALUE;
            for (var i = 0, l = arr.length; i < l; i++) {
                var diff = minimize(arr, i);
                if (diff < nearestDiff) {
                    nearestDiff = diff;
                    nearestIndex = i;
                }
            }
            return nearestIndex;
        }

        function runningTotal(arr) {
            var total = 0, result = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                total += arr[i];
                result.push(total);
            }
            return result;
        }

        function pixelSnap(xPixel, yPixel) {
            // find the nearest x location
            var nearestXIndex = findClosest(x.range(), function(arr, index) {
                return Math.abs(arr[index] - xPixel);
            });
            var datum = data[nearestXIndex];

            // create an array of y pixel locations for each stacked bar
            var keys = Object.keys(datum).filter(function(p) { return p !== 'State'; });
            var yValues = keys.map(function(d) { return +datum[d]; });
            var yPixels = runningTotal(yValues).map(y);

            // find the nearest y index
            var nearestYIndex = findClosest(yPixels, function(arr, index) {
                return Math.abs(arr[index] - yPixel);
            });
            var nearestYProperty = keys[nearestYIndex];
            return {
                datum: {
                    x: x.domain()[nearestXIndex],
                    yProperty: nearestYProperty,
                    yValue: datum[nearestYProperty]
                },
                x: x.range()[nearestXIndex],
                y: yPixels[nearestYIndex]
            };
        }

        // Create a crosshairs tool
        var crosshairs = fc.tools.crosshairs()
          .xScale(x)
          .yScale(y)
          .padding(8)
          .xLabel(function(d) {
              return d.datum.x;
          })
          .yLabel(function(d) { return d.datum.yProperty + ' : ' + d.datum.yValue; })
          .snap(pixelSnap);

        // Add it to the chart
        chartLayout.getPlotArea()
          .append('g')
          .attr('class', 'crosshairs-container')
          .call(crosshairs);
    });

})(d3, fc);
