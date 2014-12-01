// Define limits
var minN = d3.min(dataSeries_Large, function (d) { return d.date; }).getTime(),
    maxN = d3.max(dataSeries_Large, function (d) { return d.date; }).getTime();
var minDate = new Date(minN - 8.64e7),
    maxDate = new Date(maxN + 8.64e7);
var yMin = d3.min(dataSeries_Large, function (d) { return d.low; }),
    yMax = d3.max(dataSeries_Large, function (d) { return d.high; });

var daysShown = 30;

// The upper chart
var chart = createPlotArea(dataSeries_Large, '#chart_title');

// Create the gridlines component
var gridlines = fc.scale.gridlines()
	.xScale(chart.dateScale)
	.yScale(chart.priceScale)
	.xTicks(5);

// Add gridlines to the chart area
chart.plotArea.call(gridlines);

// Create the crosshairs component
var crosshairs = fc.tools.crosshairs()
	.target(chart.plotArea)
	.series(dataSeries_Large)
	.xScale(chart.dateScale)
	.yScale(chart.priceScale)
	.formatH(function(d) { return crosshairs.highlightedField() + ': ' + d3.format('.1f')(d); })
	.formatV(function(d) { return d3.time.format('%b %e')(d); });

// Add crosshairs to the chart area
chart.plotArea.call(crosshairs);

// Apply the data OHLC series
var series = renderOHLC();

// The lower navigation Chart
var nav = createPlotArea(dataSeries_Large, '#chart_title_nav');

var navLine = fc.series.line()
	.xScale(nav.dateScale)
	.yScale(nav.priceScale);
nav.plotArea.append('g')
	.attr('class', 'series')
	.datum(dataSeries_Large)
	.call(navLine);

// Create Navigator Viewport Interactivity
var viewport = d3.svg.brush()
	.x(nav.dateScale)
	.on("brush", function () {
		chart.dateScale.domain(viewport.empty() ? nav.dateScale.domain() : viewport.extent());
		redrawChart();
	});

nav.plotArea.append("g")
    .attr("class", "viewport")
    .call(viewport)
    .selectAll("rect")
    .attr("height", nav.layout.innerHeight());

//  Create Chart Interactivity
var zoom = d3.behavior.zoom()
    .x(chart.dateScale)
    .on('zoom', function() {
        if (chart.dateScale.domain()[0] < minDate) {
	    	var x = zoom.translate()[0] - chart.dateScale(minDate) + chart.dateScale.range()[0];
            zoom.translate([x, 0]);
        } else if (chart.dateScale.domain()[1] > maxDate) {
	    var x = zoom.translate()[0] - chart.dateScale(maxDate) + chart.dateScale.range()[1];
            zoom.translate([x, 0]);
        }
        redrawChart();
        updateViewportFromChart();
    });

var overlay = d3.svg.area()
    .x(function (d) { return chart.dateScale(d.date); })
    .y0(0)
    .y1(chart.layout.innerHeight());

chart.plotArea.append('path')
    .attr('class', 'overlay')
    .attr('d', overlay(dataSeries_Large))
    .call(zoom);

// Connect it all together
viewport.on("brushend", function () {
    updateZoomFromChart();
});

chart.dateScale.domain([
    dataSeries_Large[dataSeries_Large.length - daysShown - 1].date,
    dataSeries_Large[dataSeries_Large.length - 1].date
]);

redrawChart();
updateViewportFromChart();
updateZoomFromChart();

function renderCandles() {
	chart.plotArea.selectAll('.series').remove();
	var candles = fc.series.candlestick()
		.xScale(chart.dateScale)
		.yScale(chart.priceScale);
	var viewportData = chart.plotArea.append('g')
		.attr('class', 'series')
		.datum(dataSeries_Large)
		.call(candles);

	return { element: viewportData, data: candles };
}

function selectCandles() {
	series = renderCandles();
}

function renderOHLC() {
	chart.plotArea.selectAll('.series').remove();
	var ohlc = fc.series.ohlc()
		.xScale(chart.dateScale)
		.yScale(chart.priceScale);
	var viewportData = chart.plotArea.append('g')
		.attr('class', 'series')
		.datum(dataSeries_Large)
		.call(ohlc);

	return { element: viewportData, data: ohlc };
}

function selectOHLC() {
	series = renderOHLC();
}

function redrawChart() {
	chart.plotArea.call(gridlines);
    chart.chart.select('#dateAxis').call(chart.dateAxis);
    series.element.call(series.data);
}

function updateViewportFromChart() {
    if ((chart.dateScale.domain()[0] <= minDate) && (chart.dateScale.domain()[1] >= maxDate)) {
        viewport.clear();
    }
    else {
        viewport.extent(chart.dateScale.domain());
    }
    nav.plotArea.select('.viewport').call(viewport);
}

function updateZoomFromChart() {
    zoom.x(chart.dateScale);
    var fullDomain = maxDate - minDate,
        currentDomain = chart.dateScale.domain()[1] - chart.dateScale.domain()[0];
    var minScale = currentDomain / fullDomain,
        maxScale = minScale * 20;
    zoom.scaleExtent([minScale, maxScale]);
}


