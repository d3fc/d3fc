define ([
    'd3',
    'sl',
    'gridlines',
    'crosshairs',
    'measure',
    'financeScale',
    'candlestick',
    'ohlc',
    'annotation',
    'movingAverage',
    'volume',
    'bollingerBands',
    'dataGenerator',
    'dimensions'
], function initCharts(d3, sl) {
    'use strict';

    var chartOptions = {
        name:'slChart',
        xTicks: 5,
        yTicks: 5
    };

    // Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
    var data = sl.utilities.dataGenerator()
        .fromDate(new Date(2014, 10, 1))
        .toDate(new Date(2014, 10, 30))
        .filter(function (moment) { return !(moment.day() === 0 || moment.day() === 6); })
        .generate();

    // Setup the dimensions
    var dimensions = sl.utilities.dimensions()
        .marginBottom(30)
        .marginLeft(80)
        .marginRight(40);

    // The overall chart
    var setupArea = d3.select('#' + chartOptions.name)
        .call(dimensions);

    // Select the elements which we'll want to add other elements to
    var svg = setupArea.select('svg'),
        chart = svg.select('g'),
        plotArea = chart.select('.plotArea');

    // Style the svg with a CSS class
    svg.attr('class', 'slChartArea');

    // Calculate the scales from the data
    var chartScale = {
        dateFrom: new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7),
        dateTo: new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7),
        priceFrom: d3.min(data, function (d) { return d.low; }),
        priceTo: d3.max(data, function (d) { return d.high; }),
        volumeFrom: d3.min(data, function (d) { return d.volume; }),
        volumeTo: d3.max(data, function (d) { return d.volume; })
    };

    var dateScale = sl.scale.finance()
        .domain([chartScale.dateFrom, chartScale.dateTo])
        .range([0, dimensions.innerWidth()]);

    var priceScale = d3.scale.linear()
        .domain([chartScale.priceFrom, chartScale.priceTo])
        .nice()
        .range([dimensions.innerHeight(), 0]);

    var volumeScale = d3.scale.linear()
        .domain([chartScale.volumeFrom, chartScale.volumeTo])
        .nice()
        .range([dimensions.innerHeight(), 0]);

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(chartOptions.xTicks);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(chartOptions.yTicks);

    var volumeAxis = d3.svg.axis()
        .scale(volumeScale)
        .orient('left')
        .ticks(chartOptions.yTicks);

    // Add the axes to the chart
    chart.append('g')
        .attr('class', 'axis date')
        .attr('transform', 'translate(0,' + dimensions.innerHeight() + ')')
        .call(dateAxis);

    chart.append('g')
        .attr('class', 'axis price')
        .attr('transform', 'translate(' + dimensions.innerWidth() + ',0)')
        .call(priceAxis);

    chart.append('g')
        .attr('class', 'axis volume')
        .call(volumeAxis);

    // Create the OHLC series
    var ohlc = sl.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    plotArea.selectAll('.series').remove();
    plotArea.append('g')
        .attr('class', 'slPrimaryPlot series')
        .datum(data)
        .call(ohlc);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Main chart tools

    // Gridlines
    var gridlines = sl.scale.gridlines()
        .xScale(dateScale)
        .yScale(priceScale)
        .xTicks(5);

    plotArea.call(gridlines);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Any secondary indicators
    chart.append('g')
        .attr('id', 'slIndicatorsChart_1')
        .attr('class', 'slIndicatorsChart_1');

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Any tertiary indicators
    chart.append('g')
        .attr('id', 'slIndicatorsChart_2')
        .attr('class', 'slIndicatorsChart_2');

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // The chart navigator
    chart.append('g')
        .attr('id', 'slChartNavigation')
        .attr('class', 'slChartNavigation');

});