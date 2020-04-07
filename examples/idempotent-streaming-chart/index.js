// create some test data
const stream = fc.randomFinancial().stream();
const data = stream.take(110);

function renderChart() {
    // add a new datapoint and remove an old one
    data.push(stream.next());
    data.shift();

    // Create and apply the bollinger algorithm
    const bollingerAlgorithm = fc.indicatorBollingerBands().value(d => d.close);
    const bollingerData = bollingerAlgorithm(data);
    const mergedData = data.map((d, i) => ({
        ...d,
        bollinger: bollingerData[i]
    }));

    // Offset the range to include the full bar for the latest value
    const DAY_MS = 1000 * 60 * 60 * 24;
    const xExtent = fc
        .extentDate()
        .accessors([d => d.date])
        .padUnit('domain')
        .pad([DAY_MS * -bollingerAlgorithm.period()(mergedData), DAY_MS]);

    // ensure y extent includes the bollinger bands
    const yExtent = fc
        .extentLinear()
        .accessors([
            d => d.bollinger.upper,
            d => d.high,
            d => d.bollinger.lower,
            d => d.low
        ]);

    // create a chart
    const chart = fc
        .chartCartesian(d3.scaleTime(), d3.scaleLinear())
        .xDomain(xExtent(mergedData))
        .yDomain(yExtent(mergedData))
        .chartLabel('Streaming Idempotent Chart');

    // Create the gridlines and series
    const gridlines = fc.annotationSvgGridline();
    const candlestick = fc.seriesSvgCandlestick();

    const bollingerBands = function() {
        const area = fc
            .seriesSvgArea()
            .mainValue(d => d.bollinger.upper)
            .baseValue(d => d.bollinger.lower)
            .crossValue(d => d.date);

        const upperLine = fc
            .seriesSvgLine()
            .mainValue(d => d.bollinger.upper)
            .crossValue(d => d.date);

        const averageLine = fc
            .seriesSvgLine()
            .mainValue(d => d.bollinger.average)
            .crossValue(d => d.date);

        const lowerLine = fc
            .seriesSvgLine()
            .mainValue(d => d.bollinger.lower)
            .crossValue(d => d.date);

        const bollingerMulti = fc
            .seriesSvgMulti()
            .series([area, upperLine, lowerLine, averageLine])
            .decorate(g => {
                g.enter().attr(
                    'class',
                    (_, i) =>
                        'multi bollinger ' +
                        ['area', 'upper', 'lower', 'average'][i]
                );
            });

        return bollingerMulti;
    };

    // add them to the chart via a multi-series
    const multi = fc
        .seriesSvgMulti()
        .series([gridlines, bollingerBands(), candlestick]);

    chart.svgPlotArea(multi);

    d3.select('#streaming-chart')
        .datum(mergedData)
        .call(chart);
}

// re-render the chart every 200ms
renderChart();
setInterval(renderChart, 200);
