(function(d3, fc) {
    'use strict';

    var width = 600, height = 250;

    var container = d3.select('#stacked-bar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    function renderChart(data, offset, yDomain) {
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

        var stackLayout = d3.layout.stack()
            .offset(offset)
            .x(function(d) { return d.state; })
            .y(function(d) { return d.value; });

        var stackedData = stackLayout(series.map(function(d) { return d.data; }));
        stackedData.crosshair = [];

        // Collect the X values.
        var xCategories = data.map(function(d) { return d.State; });

        // create scales
        var x = d3.scale.ordinal()
            .domain(xCategories)
            .rangePoints([0, width], 1);

        var color = d3.scale.category10();

        var y = d3.scale.linear()
          .domain(yDomain)
          .nice()
          .range([height, 0]);

        var stackedBar = fc.series.stacked.bar()
            .xScale(x)
            .yScale(y)
            .xValue(function(d) { return d.state; })
            .decorate(function(sel, index) {
                sel.select('path')
                    .style('fill', color(index));
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

        function pixelSnap(stackedData, xPixel, yPixel) {
            // find the nearest x location
            var nearestXIndex = findClosest(x.range(), function(arr, index) {
                return Math.abs(arr[index] - xPixel);
            });
            var datum = data[nearestXIndex];

            // create an array of y pixel locations for each stacked bar
            var keys = Object.keys(datum).filter(function(p) { return p !== 'State'; });
            var yPixels = stackedData.map(function(d) {
                var datum = d[nearestXIndex];
                return y(datum.y0 + datum.y);
            });

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

        // Create a crosshair tool
        var crosshair = fc.tool.crosshair()
          .xLabel(function(d) {
              return d.datum.x;
          })
          .yLabel(function(d) { return d.datum.yProperty + ' : ' + d.datum.yValue; })
          .snap(pixelSnap.bind(null, stackedData));

        // Add it to the chart
        var multi = fc.series.multi()
            .xScale(x)
            .yScale(y)
            .series([stackedBar, crosshair])
            .mapping(function(series) {
                switch (series) {
                    case stackedBar:
                        return this;
                    case crosshair:
                        return this.crosshair;
                }
            });

        container.datum(stackedData)
            .call(multi);
    }

    var csvData;
    d3.csv('stackedBarData.csv', function(error, data) {
        csvData = data;


        var zeroRadio = document.getElementById('zero');
        zeroRadio.addEventListener('click', renderChart.bind(null, csvData, 'zero', [0, 40000000]));
        zeroRadio.setAttribute('checked', true);

        document.getElementById('expand')
            .addEventListener('click', renderChart.bind(null, csvData, 'expand', [0, 1]));

        renderChart(data, 'zero', [0, 40000000]);
    });

})(d3, fc);
