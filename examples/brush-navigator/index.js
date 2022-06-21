// create some test data
const generator = fc.randomGeometricBrownianMotion().steps(1000);
const data = generator(10);

const yExtent = fc.extentLinear().pad([0.1, 0.1]);

// create the scales
const x = d3.scaleLinear().domain([0, data.length]);
const y = d3.scaleLinear().domain(yExtent(data));

// create the data that is bound to the charts. It is a combination of the chart data
// and the brushed / navigator range
const chartData = {
    series: data,
    brushedRange: [0.75, 1]
};

const area = fc
    .seriesSvgArea()
    .crossValue((d, i) => i)
    .mainValue((d, i) => d)
    .decorate(selection => {
        selection
            .enter()
            .style('fill', 'lightgreen')
            .style('fill-opacity', 0.5);
    });

const brush = fc.brushX().on('brush', e => {
    // if the brush has zero height there is no selection
    if (e.selection) {
        chartData.brushedRange = e.selection;
        mainChart.xDomain(e.xDomain);
        render();
    }
});

const multi = fc
    .seriesSvgMulti()
    .series([area, brush])
    .mapping((data, index, series) => {
        switch (series[index]) {
            case area:
                return data.series;
            case brush:
                return data.brushedRange;
        }
    });

const mainChart = fc.chartCartesian(x, y).svgPlotArea(area);

const navigatorChart = fc.chartCartesian(x.copy(), y.copy()).svgPlotArea(multi);

// set the initial domain based on the brushed range
const scale = d3.scaleLinear().domain(x.domain());
mainChart.xDomain(chartData.brushedRange.map(scale.invert));

function render() {
    d3.select('#main-chart')
        .datum(chartData.series)
        .call(mainChart);

    d3.select('#navigator-chart')
        .datum(chartData)
        .call(navigatorChart);
}

render();
