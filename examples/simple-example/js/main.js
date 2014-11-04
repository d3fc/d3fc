define ([
  'd3',
  'sl',
  'gridlines',
  'crosshairs',
  'measure',
  'financeScale',
  'candlestickSeries',
  'ohlcSeries',
  'annotationSeries',
  'trackerSeries',
  'volumeSeries',
  'bollingerSeries',
  'mockData'
], function initCharts(d3, sl, mockData) {

    var chartOptions = {
      name:'slChart',
      xTicks: 5,
      yTicks: 5
    };

    var chartScale = {
       dateFrom: new Date(2014, 10, 1),
       dateTo: new Date(2014, 10, 31),
       priceFrom: 0,
       priceTo: 200,
       volumeFrom: 0,
       volumeTo: 200000000
    };

    // Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
    //var data = new mockData(0.1, 0.1, 100, 50, function (moment) { return !(moment.day() === 0 || moment.day() === 6); }).generateOHLC(new Date(2012, 1, 1), new Date(2014, 10, 22));

    // Calculate scale from data
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

    // Create axes from the scale
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

    // The overall chart
    var chart = d3.select('#' + chartOptions.name)
      .append('svg')
      .attr('id', 'slChartArea')
      .attr('class', 'slChartArea')
      .attr('width', function() { return $('#' + chartOptions.name).parent().width(); })
      .attr('height', function() { return $('#' + chartOptions.name).height(); });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // The main chart area
    d3.select('#slChartArea')
      .append('g')
      .attr('id', 'slPrimaryChart')
      .attr('class', 'slPrimaryChart')
      .attr('width', function() { return $('#' + chartOptions.name).width(); })
      .attr('height', function() { return $('#' + chartOptions.name).height() / 2.0; })
      
    // The axes for the main chart
    d3.select('#slPrimaryChart')
      .append('g')
      .attr('class', 'axis date')
      .call(dateAxis);

    d3.select('#slPrimaryChart')
      .append('g')
      .attr('class', 'axis price')
      .call(priceAxis);

    d3.select('#slPrimaryChart')
      .append('g')
      .attr('class', 'axis volume')
      .call(volumeAxis);

    var dimensions = sl.utility.dimensions()
      .marginBottom(30)
      .marginLeft(30)
      .width(30)
      .height(30);

    d3.select('#slPrimaryChart')
      .call(dimensions);

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
