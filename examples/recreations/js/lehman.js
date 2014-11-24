// Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
var data = sl.utilities.dataGenerator()
  .fromDate(new Date(2013, 6, 1))
  .toDate(new Date(2014, 1, 1))
  .generate();

// Calculate the scales from the data
var chartScale = {
    dateFrom: new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7),
    dateTo: new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7),
    priceFrom: d3.min(data, function (d) { return d.low; }),
    priceTo: d3.max(data, function (d) { return d.high; })
};

// The data chart
var dataLayout = sl.utilities.chartLayout()
		  .marginTop(20)
		  .marginBottom(30)
		  .marginLeft(40)
		  .marginRight(20);
		  
var dataArea = d3.select('#chart').call(dataLayout),
	dataSvg = dataArea.select('svg').attr('class', 'dataArea'),
	dataChart = dataSvg.select('g'),
	dataPlot = dataChart.select('.plotArea');

// Scales
var dateScale = sl.scale.finance()
    .domain([chartScale.dateFrom, chartScale.dateTo])
    .range([0, dataLayout.innerWidth()]);

var priceScale = sl.scale.linear()
    .domain([chartScale.priceFrom, chartScale.priceTo])
    .nice()
    .range([dataLayout.innerHeight(), 0]);

// Axes
var dateAxis = d3.svg.axis()
    .scale(dateScale)
    .orient('bottom')
    .ticks(10);

var priceAxis = d3.svg.axis()
    .scale(priceScale)
    .orient('left')
    .ticks(10);

// Add the axes to the chart
dataChart.append('g')
    .attr('class', 'axis date')
    .attr('transform', 'translate(0,' + (dataLayout.innerHeight()-0.5) + ')')
    .call(dateAxis);

dataChart.append('g')
    .attr('class', 'axis price')
    //.attr('transform', 'translate(' + (dataLayout.innerWidth()-0.5) + ',0)')
    .call(priceAxis);

// Gridlines
var dataGridlines = sl.scale.gridlines()
    .xScale(dateScale)
    .yScale(priceScale)
    .yTicks(10)
    .xTicks(10);
    
dataPlot.call(dataGridlines);

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

	crosshairs.yValue('');
}

function renderLine() {

	var dataSeries = sl.series.line()
		.underFill(false)
	    .yValue('close')
	    .xScale(dateScale)
	    .yScale(priceScale);

	dataPlot.selectAll('.series').remove();
	dataPlot.append('g')
	    .attr('class', 'series')
	    .datum(data)
	    .call(dataSeries);

	if(crosshairs)
		crosshairs.yValue('close');
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

	crosshairs.yValue('');
}

// Add annotations

var index = 0;
var annotations = [
	sl.tools.annotation()
		.index(index++)
		.xScale(dateScale)
		.yScale(priceScale)
		.yValue(chartScale.priceFrom + ((chartScale.priceTo - chartScale.priceFrom)*0.25))
		.yLabel("25%")
		.formatCallout(function(d) { return d3.format('.1f')(d); }),
	sl.tools.annotation()
		.index(index++)
		.xScale(dateScale)
		.yScale(priceScale)
		.yValue(chartScale.priceFrom + ((chartScale.priceTo - chartScale.priceFrom)*0.5))
		.yLabel("50%")
		.formatCallout(function(d) { return d3.format('.1f')(d); }),
	sl.tools.annotation()
		.index(index++)
		.xScale(dateScale)
		.yScale(priceScale)
		.yValue(chartScale.priceFrom + ((chartScale.priceTo - chartScale.priceFrom)*0.75))
		.yLabel("75%")
		.formatCallout(function(d) { return d3.format('.1f')(d); })
];

for(var i=0; i<annotations.length; i++)
	dataPlot.call(annotations[i]);

// Draw the line chart
renderLine();

// Overlay to capture events and Crosshairs component
var overlay = d3.svg.area()
    .x(function (d) { return dateScale(d.date); })
    .y0(0)
    .y1(dataLayout.innerHeight());

var crosshairs = sl.tools.crosshairs()
    .target(dataPlot)
    .series(data)
    .xScale(dateScale)
    .yScale(priceScale)
    .yValue('close')
    .formatV(function(d) { return d3.time.format('%b %e')(d); })
    .formatH(function(d, field) { return field + " : " + d3.format('.1f')(d); })
    .onSnap(function(d) {
		dataPlot.selectAll('.callouts').remove();

		var formatLabel = d3.format('.1f');
		var callouts = sl.tools.callouts()
		    .xScale(dateScale)
		    .yScale(priceScale)
		    .rotationStart(30)
		    .rotationSteps(30)
		    .rounded(8)
			.addCallout( {
				x: d.date,
				y: d.open,
				label: 'open:' + formatLabel(d.open)
			})
			.addCallout( {
				x: d.date,
				y: d.high,
				label: 'high:' + formatLabel(d.high)
			})
			.addCallout( {
				x: d.date,
				y: d.low,
				label: 'low:' + formatLabel(d.low)
			})
			.addCallout( {
				x: d.date,
				y: d.close,
				label: 'close:' + formatLabel(d.close)
			});

		dataPlot.append('g')
			.attr("class", "callouts")
			.call(callouts);
    });

dataPlot.append('path')
    .attr('class', 'overlay')
    .attr('d', overlay(data))
    .call(crosshairs);

