(function(d3, fc) {
    'use strict';

    var chartLayout = fc.utilities.chartLayout();

    // Setup the chart
    var chart = d3.select('#stacked-bar')
        .call(chartLayout);

    d3.csv('stackedBarData.csv', function(error, data) {

        var categories = data.map(function(d) { return d.State; });

        // Format data into a map of series key to series data & a data array to pass to our stacked-bar series.
        var seriesMap = {};
        var seriesData = [];
        data.forEach(function(stateData) {
            for (var propertyName in stateData) {
                if (stateData.hasOwnProperty(propertyName) && propertyName !== 'State') {

                    if (!seriesMap[propertyName]) {
                        var dataArray = [];
                        // Store the series names mapped to the data arrays.
                        seriesMap[propertyName] = dataArray;
                        // Store the data arrays to pass to our stackedBar series.
                        seriesData.push(dataArray);
                    }

                    seriesMap[propertyName].push({
                        x: stateData.State,
                        y: parseInt(stateData[propertyName])
                    });
                }
            }
        });

        // create scales
        var x = d3.scale.ordinal()
            .domain(categories)
            .rangePoints([0, chartLayout.getPlotAreaWidth()], 1);

        var color = d3.scale.category10();

        var y = d3.scale.linear()
          .domain([0, 10000000])
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
            .decorate(function(sel) {
                sel.attr('fill', function(d, i) {
                    return color(i);
                });
            });

        chartLayout.getPlotArea(chart)
          .append('g')
          .attr('class', 'series')
          .datum(seriesData)
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
