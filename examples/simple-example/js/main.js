(function (d3, sl) {
    'use strict';

    var chartOptions = {
        name:'slChart',
        xTicks: 5,
        yTicks: 5
    };

    // Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
    var data = sl.utilities.dataGenerator()
        .fromDate(new Date(2014, 1, 1))
        .toDate(new Date(2014, 3, 1))
        .generate();


    // Setup the chartLayout
    var chartLayout = sl.utilities.chartLayout()
        .marginBottom(30)
        .marginLeft(80)
        .marginRight(40);

    // The overall chart
    var setupArea = d3.select('#' + chartOptions.name);

    setupArea.data(["test"]).call(chartLayout);

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
        .range([0, chartLayout.innerWidth()]);

    var priceScale = d3.scale.linear()
        .domain([chartScale.priceFrom, chartScale.priceTo])
        .nice()
        .range([chartLayout.innerHeight(), 0]);

    var volumeScale = d3.scale.linear()
        .domain([chartScale.volumeFrom, chartScale.volumeTo])
        .nice()
        .range([chartLayout.innerHeight(), 0]);

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
        .attr('transform', 'translate(0,' + chartLayout.innerHeight() + ')')
        .call(dateAxis);

    chart.append('g')
        .attr('class', 'axis price')
        .attr('transform', 'translate(' + chartLayout.innerWidth() + ',0)')
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
    // The indicator chart

    var indicatorsOptions = {
        name:'slIndicatorChart',
        xTicks: 5,
        yTicks: 5
    };

    var indicators = {
        series: []
    };

    // Setup the chartLayout
    indicators.chartLayout = sl.utilities.chartLayout()
        .marginBottom(30)
        .marginLeft(80)
        .marginRight(40);

    // The overall chart
    indicators.setupArea = d3.select('#' + indicatorsOptions.name)
        .call(indicators.chartLayout);

    // Select the elements which we'll want to add other elements to
    indicators.svg = indicators.setupArea.select('svg');
    indicators.chart = indicators.svg.select('g');
    indicators.plotArea = indicators.chart.select('.plotArea');

    // Style the svg with a CSS class
    indicators.svg.attr('class', 'slIndicatorChartArea');

    indicators.dateScale = sl.scale.finance()
        .domain([chartScale.dateFrom, chartScale.dateTo])
        .range([0, indicators.chartLayout.innerWidth()]);

    indicators.percentageScale = d3.scale.linear()
        .domain([0, 100])
        .nice()
        .range([indicators.chartLayout.innerHeight(), 0]);

    // Create the axes
    indicators.dateAxis = d3.svg.axis()
        .scale(indicators.dateScale)
        .orient('bottom')
        .ticks(indicatorsOptions.xTicks);

    indicators.percentageAxis = d3.svg.axis()
        .scale(indicators.percentageScale)
        .orient('right')
        .ticks(indicatorsOptions.yTicks);

    // Add the axes to the chart
    indicators.chart.append('g')
        .attr('class', 'axis date')
        .attr('transform', 'translate(0,' + indicators.chartLayout.innerHeight() + ')')
        .call(indicators.dateAxis);

    indicators.chart.append('g')
        .attr('class', 'axis percentage')
        .attr('transform', 'translate(' + indicators.chartLayout.innerWidth() + ',0)')
        .call(indicators.percentageAxis);

    // Create RSI
    var rsi = sl.indicators.rsi()
        .xScale(indicators.dateScale)
        .yScale(indicators.percentageScale)
        .lambda(0.94)
        .upperMarker(70)
        .lowerMarker(30)
        .samplePeriods(14);

    indicators.plotArea.append('g')
        .attr('class', 'slIndicatorsChart_1')
        .attr('id', 'rsi')
        .datum(data)
        .call(rsi);

    indicators.series.push(rsi);
}(d3, sl));
