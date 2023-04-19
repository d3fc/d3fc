const checkbox = document.getElementById('skip');

// define non-trading time ranges for any day of the week
const nonTradingHoursPattern = {
    Monday: [
        ['07:45', '08:30'],
        ['13:20', '19:00']
    ],
    Tuesday: [
        ['07:45', '08:30'],
        ['13:20', '19:00']
    ],
    Wednesday: [
        ['07:45', '08:30'],
        ['13:20', '19:00']
    ],
    Thursday: [
        ['07:45', '08:30'],
        ['13:20', '19:00']
    ],
    Friday: [
        ['07:45', '08:30'],
        ['13:20', 'EOD']
    ],
    Saturday: [['SOD', 'EOD']],
    Sunday: [['SOD', '19:00']]
};

// create discontinous date range
const dates = d3.timeMinute
    .range(new Date(2018, 0, 1), new Date(2018, 0, 8))
    .filter(dt => {
        const dow = dt.getDay();
        switch (dow) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                if (
                    (dt.getHours() === 7 && dt.getMinutes() >= 45) ||
                    (dt.getHours() === 8 && dt.getMinutes() < 30) ||
                    (dt.getHours() === 13 && dt.getMinutes() >= 20) ||
                    (dt.getHours() >= 14 && dow !== 5 && dt.getHours() < 19) ||
                    (dt.getHours() >= 14 && dow === 5)
                ) {
                    return false;
                }
                return true;
            case 6:
                return false;
            case 0:
                return dt.getHours() >= 19;
        }
    });

// create some test data that skips weekends
const data = fc.randomFinancial()(dates.length);

for (let i = 0; i < dates.length; i++) {
    // console.log(`Changing: ${data[i].date} to ${dates[i]}`);
    data[i].date = dates[i];
}

// use the date to determine the x extent, padding by one day at each end
const xExtent = fc
    .extentDate()
    .accessors([d => d.date])
    .padUnit('domain')
    .pad([60 * 1000, 60 * 1000]);

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
const skipWeeklyPatternScale = fc
    .scaleDiscontinuous(d3.scaleTime())
    .discontinuityProvider(
        fc.discontinuitySkipWeeklyPattern(nonTradingHoursPattern)
    );

function renderChart() {
    // create a chart
    const chart = fc
        .chartCartesian(
            checkbox.checked ? skipWeeklyPatternScale : d3.scaleTime(),
            d3.scaleLinear()
        )
        .xDomain(xExtent(data))
        .yDomain(yExtent(data))
        .xTicks(30)
        .svgPlotArea(multi);

    // render the chart
    d3.select('#chart')
        .datum(data)
        .call(chart);
}

renderChart();
checkbox.addEventListener('click', renderChart);
