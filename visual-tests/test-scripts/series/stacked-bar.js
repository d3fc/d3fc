(function(d3, fc) {
    'use strict';

    var chartLayout = fc.utilities.chartLayout();

    // Setup the chart
    var chart = d3.select('#stacked-bar')
        .call(chartLayout);

    d3.csv('stackedBarData.csv', function(error, data) {

        var categories = data.slice(1).map(function(d) { return d.State; });
        var yMax = d3.max(data, function(d) {
            var total = 0;
            for (var prop in d) {
                if (prop !== 'State') {
                    total += +d[prop];
                }
            }
            return total;
        });

        // create scales
        var x = d3.scale.ordinal()
            .domain(categories)
            .rangePoints([0, chartLayout.getPlotAreaWidth()], 1);

        var color = d3.scale.category10();

        var y = d3.scale.linear()
          .domain([0, yMax])
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
          .xValueKey('State')
          .yScale(y)
          .decorate(function(sel) {
              sel.attr('fill', function(d, i) { return color(i); });
          });

        chartLayout.getPlotArea(chart)
          .datum(data.slice(1))
          .call(stack);
    });

})(d3, fc);
