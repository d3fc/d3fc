(function(d3, fc) {
    'use strict';

    var width = 600, height = 250;

    var container = d3.select('#stacked-bar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    d3.csv('stackedBarData.csv', function(error, data) {
        /*  Build series objects for each series in the data set.
            Assumption: first data object holds all series keys. */
        var series = Object.keys(data[0])
            .filter(function(key) {
                return key !== 'State';
            })
            .map(function(key) {
                return {
                    name: key,
                    data: []
                };
            });

        // Populate these series objects.
        data.forEach(function(datum) {
            series.forEach(function(series) {
                series.data.push({
                    state: datum.State,
                    value: parseInt(datum[series.name])
                });
            });
        });

        series.crosshairs = [];

        // Collect the X values.
        var xCategories = data.map(function(d) { return d.State; });

        // create scales
        var x = d3.scale.ordinal()
            .domain(xCategories)
            .rangePoints([0, width], 1);

        var color = d3.scale.category10();

        var y = d3.scale.linear()
          .domain([0, 40000000])
          .nice()
          .range([height, 0]);

        var stack = fc.series.stackedBar()
            .values(function(d) { return d.data; })
            .xValue(function(d) { return d.state; })
            .yValue(function(d) { return d.value; })
            .decorate(function(sel) {
                sel.attr('fill', function(d, i) {
                    return color(i);
                });
            });

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
                y: yPixels[nearestYIndex],
                xInDomainUnits: false,
                yInDomainUnits: false
            };
        }

        // Create a crosshairs tool
        var crosshairs = fc.tool.crosshairs()
          .xLabel(function(d) {
              return d.datum.x;
          })
          .yLabel(function(d) { return d.datum.yProperty + ' : ' + d.datum.yValue; })
          .snap(pixelSnap);

        // Add it to the chart
        var multi = fc.series.multi()
            .xScale(x)
            .yScale(y)
            .series([stack, crosshairs])
            .mapping(function(series) {
                switch (series) {
                    case stack:
                        return this;
                    case crosshairs:
                        return this.crosshairs;
                }
            });

        container.datum(series)
            .call(multi);
    });

})(d3, fc);
