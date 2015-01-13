(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#crosshairs'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .alignPixels(true)
        .hideWeekends(true)
        .domain([dateFrom, dateTo])
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
        .alignPixels(true)
        .domain([priceFrom, priceTo])
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

    var color = d3.scale.category10();

    // Create the bar series
    var bar = fc.series.bar()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(fc.utilities.valueAccessor('close'))
        .decorate(function(sel) {
            sel.style('fill', function(d) { return color(d.date.getDay()); });
        })
        .barWidth(9);

    // Add the primary bar series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(bar);

    // Create a crosshairs tool
    var crosshairs = fc.tools.crosshairs()
        .xScale(dateScale)
        .yScale(priceScale)
        .snap(fc.utilities.seriesPointSnap(bar, data))
        .xLabel(function(d) { return d.datum && d3.time.format('%a, %e %b')(d.datum.date); })
        .yLabel(function(d) { return d.datum && d3.format('.2f')(d.datum.close); })
        .padding(8)
        .decorate(function(selection) {
            selection.enter()
                .append('rect')
                .attr('class', 'example')
                .attr('width', 50)
                .attr('height', 50)
                .style('opacity', 0.5);
            selection.select('rect.example')
                .attr('x', function(d) { return d.x - 25; })
                .attr('y', function(d) { return d.y - 25; })
                .style('fill', function(d) { return color(d.datum ? d.datum.date.getDay() : 0); });
        });

    // Add it to the chart
    chartLayout.getPlotArea()
        .append('g')
        .attr('class', 'crosshairs-container')
        .call(crosshairs);

})(d3, fc);
