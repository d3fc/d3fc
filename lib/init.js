
var dataSeed = 12345;

var dataSeries1 = fc.utilities.dataGenerator()
	.randomSeed(dataSeed)
	.seedDate(new Date(2014, 1, 1))
	.generate(60);

var dataSeries2 = fc.utilities.dataGenerator()
	.randomSeed(dataSeed)
	.seedDate(new Date(2014, 1, 1))
	.generate(60);

var dataSeries3 = fc.utilities.dataGenerator()
	.randomSeed(dataSeed)
	.seedDate(new Date(2014, 1, 1))
	.generate(60);

var dataSeries_Small = fc.utilities.dataGenerator()
	.mu(0.1)
	.sigma(0.2)
	.randomSeed(dataSeed)
	.seedDate(new Date(2014, 1, 1))
	.generate(28);

var dataSeries_Large = fc.utilities.dataGenerator()
	.mu(0.1)
	.sigma(0.2)
	.randomSeed(dataSeed)
	.seedDate(new Date(2013, 1, 1))
	.generate(365);


function createPlotArea(dataSeries, name, useVolumeScale, leftAlignPriceScale, userPercentageScale, useNoneFinancialX) {
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
		percentageFrom: 0,
		percentageTo: 100
	};

	var dateScale = useNoneFinancialX ? 
		d3.time.scale()
			.domain([chartScale.dateFrom, chartScale.dateTo])
			.range([0, chartLayout.innerWidth()]) :
		fc.scale.dateTime()
			.domain([chartScale.dateFrom, chartScale.dateTo])
			.range([0, chartLayout.innerWidth()]);

	var priceScale = fc.scale.linear()
		.domain([chartScale.priceFrom, chartScale.priceTo])
		.nice()
		.range([chartLayout.innerHeight(), 0]);

	var volumeScale = fc.scale.linear()
		.domain([chartScale.volumeFrom, chartScale.volumeTo])
		.nice()
		.range([chartLayout.innerHeight(), 0]);

	var percentageScale = fc.scale.linear()
		.domain([chartScale.percentageFrom, chartScale.percentageTo])
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

	var percentageAxis = d3.svg.axis()
		.scale(percentageScale)
		.orient('right')
		.ticks(5);

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
	else if( userPercentageScale ) {
		chart.append('g')
			.attr('id', 'percentageAxis')
			.attr('class', 'axis percentage')
			.attr('transform', 'translate(' + (leftAlignPriceScale ? 0 : chartLayout.innerWidth()) + ',0)')
			.call(percentageAxis);
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
		percentageScale: percentageScale, 
		dateAxis: dateAxis, 
		priceAxis: priceAxis, 
		volumeAxis: volumeAxis,
		percentageAxis: percentageAxis
	};
}
