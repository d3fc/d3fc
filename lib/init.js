
var dataSeries1 = fc.utilities.dataGenerator()
	.fromDate(new Date(2014, 1, 1))
	.toDate(new Date(2014, 3, 1))
	.generate();

var dataSeries2 = fc.utilities.dataGenerator()
	.fromDate(new Date(2014, 1, 1))
	.toDate(new Date(2014, 3, 1))
	.generate();

var dataSeries3 = fc.utilities.dataGenerator()
	.fromDate(new Date(2014, 1, 1))
	.toDate(new Date(2014, 3, 1))
	.generate();

var dataSeries_Large = fc.utilities.dataGenerator()
	.fromDate(new Date(2013, 1, 1))
	.toDate(new Date(2014, 1, 1))
	.generate();


function createPlotArea(dataSeries, name, useVolumeScale, leftAlignPriceScale) {
	var chartLayout = fc.utilities.chartLayout()
		.marginTop(10)
		.marginBottom(30)
		.marginLeft(40)
		.marginRight(40);

	// The overall chart
	var setupArea = d3
		.select(name)
		.call(chartLayout);

	// Select the elements which we'll want to add other elements to
	var svg = setupArea.select('svg'),
		chart = svg.select('g'),
		plotArea = chart.select('.plotArea');

	// Style the svg with a CSS class
	svg.attr('class', 'chartArea');

	// Calculate the scales from the data
	var chartScale = {
		dateFrom: new Date(d3.min(dataSeries, function (d) { return d.date; }).getTime() - 8.64e7),
		dateTo: new Date(d3.max(dataSeries, function (d) { return d.date; }).getTime() + 8.64e7),
		priceFrom: d3.min(dataSeries, function (d) { return d.low; }),
		priceTo: d3.max(dataSeries, function (d) { return d.high; }),
		volumeFrom: d3.min(dataSeries, function (d) { return d.volume; }),
		volumeTo: d3.max(dataSeries, function (d) { return d.volume; }),
	};

	var dateScale = fc.scale.finance()
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
		.ticks(5);

	var priceAxis = d3.svg.axis()
		.scale(priceScale)
		.orient(leftAlignPriceScale ? 'left' : 'right')
		.ticks(5);

	var volumeAxis = d3.svg.axis()
		.scale(volumeScale)
		.orient('left')
		.ticks(5)
		.tickFormat(function(d) { return d3.format('s')(d); });

	// Add the axes to the chart
	chart.append('g')
		.attr('id', 'dateAxis')
		.attr('class', 'axis date')
		.attr('transform', 'translate(0,' + chartLayout.innerHeight() + ')')
		.call(dateAxis);

	if( useVolumeScale ) {
		chart.append('g')
			.attr('id', 'volumeAxis')
			.attr('class', 'axis volume')
			.attr('transform', 'translate(0,0)')
			.call(volumeAxis);
	}
	else {
		chart.append('g')
			.attr('id', 'priceAxis')
			.attr('class', 'axis price')
			.attr('transform', 'translate(' + (leftAlignPriceScale ? 0 : chartLayout.innerWidth()) + ',0)')
			.call(priceAxis);
	}

	return { 
		chart: chart,
		layout: chartLayout,
		plotArea: plotArea, 
		dateScale: dateScale, 
		priceScale: priceScale, 
		volumeScale: volumeScale, 
		dateAxis: dateAxis, 
		priceAxis: priceAxis, 
		volumeAxis: volumeAxis
	};
}
