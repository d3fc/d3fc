// Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
var data = sl.utilities.dataGenerator()
  .fromDate(new Date(2013, 1, 1))
  .toDate(new Date(2014, 1, 1))
  .generate();

// Calculate the scales from the data
var chartScale = {
    dateFrom: new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7),
    dateTo: new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7),
    priceFrom: d3.min(data, function (d) { return d.low; }),
    priceTo: d3.max(data, function (d) { return d.high; }),
    volumeFrom: d3.min(data, function (d) { return d.volume; }),
    volumeTo: d3.max(data, function (d) { return d.volume; }),
};

// The data chart
var dataLayout = sl.utilities.chartLayout()
		  .marginTop(5)
		  .marginBottom(20)
		  .marginLeft(0)
		  .marginRight(40);
		  
var dataArea = d3.select('#chart1').call(dataLayout),
	dataSvg = dataArea.select('svg').attr('class', 'dataArea'),
	dataChart = dataSvg.select('g'),
	dataPlot = dataChart.select('.plotArea');

// The volume chart
var volumeLayout = sl.utilities.chartLayout()
		  .marginTop(5)
		  .marginBottom(20)
		  .marginLeft(0)
		  .marginRight(40);
		  
var volumeArea = d3.select('#chart2').call(volumeLayout),
	volumeSvg = volumeArea.select('svg').attr('class', 'volumeArea'),
	volumeChart = volumeSvg.select('g'),
	volumePlot = volumeChart.select('.plotArea');

// Scales
var dateScale = sl.scale.finance()
    .domain([chartScale.dateFrom, chartScale.dateTo])
    .range([0, dataLayout.innerWidth()]);

var priceScale = sl.scale.linear()
    .domain([chartScale.priceFrom, chartScale.priceTo])
    .nice()
    .range([dataLayout.innerHeight(), 0]);

var volumeScale = sl.scale.linear()
    .domain([chartScale.volumeFrom, chartScale.volumeTo])
    .nice()
    .range([volumeLayout.innerHeight(), 0]);

// Axes
var dateAxis = d3.svg.axis()
    .scale(dateScale)
    .orient('bottom')
    .ticks(5);

var dateAxis2 = d3.svg.axis()
    .scale(dateScale)
    .orient('top')
    .ticks(5)
    .tickFormat(function(d) { return ''; });

var priceAxis = d3.svg.axis()
    .scale(priceScale)
    .orient('right')
    .ticks(10);

var volumeAxis = d3.svg.axis()
    .scale(volumeScale)
    .orient('right')
    .ticks(5)
    .tickFormat(function(d) { return d3.format('s')(d); });

// Add the axes to the chart
dataChart.append('g')
    .attr('class', 'axis date')
    .attr('transform', 'translate(0,' + (dataLayout.innerHeight()-0.5) + ')')
    .call(dateAxis);

dataChart.append('g')
    .attr('class', 'axis price')
    .attr('transform', 'translate(' + (dataLayout.innerWidth()-0.5) + ',0)')
    .call(priceAxis);

volumeChart.append('g')
    .attr('class', 'axis date')
    .attr('transform', 'translate(0,0)')// + (volumeLayout.innerHeight()-0.5) + ')')
    .call(dateAxis2);

volumeChart.append('g')
    .attr('class', 'axis volume')
    .attr('transform', 'translate(' + (volumeLayout.innerWidth()-0.5) + ',0)')
    .call(volumeAxis);

// Gridlines
var dataGridlines = sl.scale.gridlines()
    .xScale(dateScale)
    .yScale(priceScale)
    .yTicks(10)
    .xTicks(5);
    
dataPlot.call(dataGridlines);

var volumeGridlines = sl.scale.gridlines()
    .xScale(dateScale)
    .yScale(volumeScale)
    .yTicks(5)
    .xTicks(5);
    
volumePlot.call(volumeGridlines);

// Create the volume series
var volumeSeries = sl.series.volume()
	.barWidth(0.5)
    .xScale(dateScale)
    .yScale(volumeScale);

volumePlot.selectAll('.series').remove();
volumePlot.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(volumeSeries);


// Create the data series

function renderOhlc() {
	
	var dataSeries = sl.series.ohlc()
		.tickWidth(2)
	    .xScale(dateScale)
	    .yScale(priceScale);

	dataPlot.selectAll('.series').remove();
	dataPlot.append('g')
	    .attr('class', 'series')
	    .datum(data)
	    .call(dataSeries);
}

function renderLine() {

	var dataSeries = sl.series.line()
	    .yValue('close')
	    .xScale(dateScale)
	    .yScale(priceScale);

	dataPlot.selectAll('.series').remove();
	dataPlot.append('g')
	    .attr('class', 'series')
	    .datum(data)
	    .call(dataSeries);
}

function renderCandle() {
	
	var dataSeries = sl.series.candlestick()
		.rectangleWidth(2)
	    .xScale(dateScale)
	    .yScale(priceScale);

	dataPlot.selectAll('.series').remove();
	dataPlot.append('g')
	    .attr('class', 'series')
	    .datum(data)
	    .call(dataSeries);
}

renderLine();
