const DAY_MS = 1000 * 60 * 60 * 24;
const checkbox = document.getElementById('skip');

// create some test data that skips weekends
const generator = fc.randomFinancial().filter(fc.randomSkipWeekends);
const data = generator(50);

// use the date to determine the x extent, padding by one day at each end
const xExtent = fc
    .extentDate()
    .accessors([d => d.date])
    .padUnit('domain')
    .pad([DAY_MS, DAY_MS]);

// compute the y extent from the high / low values, padding by 10%
const yExtent = fc
    .extentLinear()
    .accessors([d => d.high, d => d.low])
    .pad([0.1, 0.1]);

// Create the gridlines and series
const gridlines = fc.annotationSvgGridline();
const candlestick = fc.seriesSvgCandlestick();

// add them to the chart via a multi-series
const multi = fc.seriesSvgMulti().series([gridlines, candlestick]);

// adapt the d3 time scale in a discontinuous scale that skips weekends
const skipWeekendScale = fc
    .scaleDiscontinuous(d3.scaleTime())
    .discontinuityProvider(fc.discontinuitySkipWeekends());

function renderChart() {
    // create a chart
    const chart = fc
        .chartCartesian(
            checkbox.checked ? skipWeekendScale : d3.scaleTime(),
            d3.scaleLinear()
        )
        .xDomain(xExtent(data))
        .yDomain(yExtent(data))
        .svgPlotArea(multi);

    // render the chart
    d3.select('#chart')
        .datum(data)
        .call(chart);
}

renderChart();
checkbox.addEventListener('click', renderChart);
