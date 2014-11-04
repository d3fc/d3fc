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
  'dataGenerator'
], function initCharts(d3, sl, dataGenerator) {

    var chartOptions = {
      name:'slChart',
      xTicks: 5,
      yTicks: 5
    };

    // Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
    var data = sl.utilities.dataGenerator()
      .mu(0.1)
      .sigma(0.1)
      .startingPrice(100)
      .intraDaySteps(50)
      .fromDate(new Date(2014, 10, 1))
      .toDate(new Date(2014, 10, 30))
      .generate();

    // Calculate scale from data
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
      .range([0, $('#' + chartOptions.name).parent().width()]);

    var priceScale = d3.scale.linear()
      .domain([chartScale.priceFrom, chartScale.priceTo])
      .nice()
      .range([$('#' + chartOptions.name).height(), 0]);

    var volumeScale = d3.scale.linear()
      .domain([chartScale.volumeFrom, chartScale.volumeTo])
      .nice()
      .range([$('#' + chartOptions.name).height(), 0]);

    var width = $('#' + chartOptions.name).parent().width();
    var height = $('#' + chartOptions.name).height();

    // The overall chart
    var chart = d3.select('#' + chartOptions.name)
      .append('svg')
      .attr('id', 'slChartArea')
      .attr('class', 'slChartArea')
      .attr('width', width)
      .attr('height', height);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // The main chart area
    d3.select('#slChartArea')
      .append('g')
      .attr('id', 'slPrimaryChart')
      .attr('class', 'slPrimaryChart')
      .attr('width', width)
      .attr('height', function() { return height / 2.0; })

    // Create axes from the scale
    d3.select('#slPrimaryChart')
      .append('g')
      .attr('id', 'slPrimaryAxes')
      .attr('class', 'slPrimaryAxes');

    var dateAxis = d3.svg.axis()
      .scale(dateScale)
      .orient('bottom')
      .ticks(chartOptions.xTicks);

    var priceAxis = d3.svg.axis()
      .scale(priceScale)
      .orient('right')
      .ticks(chartOptions.yTicks);

    var volumeAxis = d3.svg.axis()
      .scale(priceScale)
      .orient('left')
      .ticks(chartOptions.yTicks);
      
    // The axes for the main chart
    d3.select('#slPrimaryAxes')
      .append('g')
      .attr('class', 'axis date')
      .attr('transform', 'translate(0,' + height + ')')
      .call(dateAxis);

    d3.select('#slPrimaryAxes')
      .append('g')
      .attr('class', 'axis price')
      .attr('transform', 'translate(' + width + ',0)')
      .call(priceAxis);

    d3.select('#slPrimaryAxes')
      .append('g')
      .attr('class', 'axis volume')
      .call(volumeAxis);

    // The main plotting area
    d3.select('#slPrimaryChart')
      .append('g')
      .attr('id', 'slPrimaryPlot')
      .attr('class', 'slPrimaryPlot')
      .attr('clip-path', 'url(#slPrimaryPlotClip)');

    d3.select('#slPrimaryPlot')
      .append('clipPath')
      .attr('id', 'slPrimaryPlotClip')
      .append('rect')
      .attr({ width: width, height: height });

    /*var dimensions = sl.utility.dimensions()
      .marginBottom(30)
      .marginLeft(30)
      .width(30)
      .height(30);

    d3.select('#slPrimaryChart')
      .call(dimensions);*/

    // The primary data series
    d3.selectAll(".series").remove();
    d3.select('#slPrimaryPlot')
      .append('g')
      .attr('class', 'series')
      .datum(data)
      .call(sl.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale)
      );

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Main chart tools

    // gridlines
    var gridlines = sl.scale.gridlines()
            .xScale(dateScale)
            .yScale(priceScale)
            .xTicks(5);

    d3.select('#slPrimaryPlot')
      .call(gridlines);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Any secondary indicators
    d3.select('#slChartArea')
      .append('g')
      .attr('id', 'slIndicatorsChart_1')
      .attr('class', 'slIndicatorsChart_1');

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Any tertiary indicators
    d3.select('#slChartArea')
      .append('g')
      .attr('id', 'slIndicatorsChart_2')
      .attr('class', 'slIndicatorsChart_2');

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // The chart navigator
    d3.select('#slChartArea')
      .append('g')
      .attr('id', 'slChartNavigation')
      .attr('class', 'slChartNavigation');
  }
);
