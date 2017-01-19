// create some test data
var generator = fc.randomGeometricBrownianMotion()
    .steps(1000);
var data = generator(10);

var yExtent = fc.extentLinear()
    .pad([0.1, 0.1]);

// create the scales
var x = d3.scaleLinear()
    .domain([0, data.length]);
var y = d3.scaleLinear()
    .domain(yExtent(data));

// create the data that is bound to the charts. It is a combination of the chart data
// and the brushed / navigator range
var chartData = {
    series: data,
    brushedRange: [0.75, 1]
};

var area = fc.seriesSvgArea()
    .crossValue(function(d, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate(function(selection) {
        selection.enter()
            .style('fill', 'lightgreen')
            .style('fill-opacity', 0.5);
    });

var brush = fc.brushX()
    .on('brush', function(evt) {
        // if the brush has zero height there is no selection
        if (evt.selection) {
            chartData.brushedRange = evt.selection;
            mainChart.xDomain(evt.xDomain);
            render();
        }
    });

var multi = fc.seriesSvgMulti()
    .series([area, brush])
    .mapping((data, index, series) => {
        switch (series[index]) {
        case area:
            return data.series;
        case brush:
            return data.brushedRange;
        }
    });

var mainChart = fc.chartSvgCartesian(x, y)
    .plotArea(area);

var navigatorChart = fc.chartSvgCartesian(x.copy(), y.copy())
    .plotArea(multi);

// set the initial domain based on the brushed range
var scale = d3.scaleLinear().domain(x.domain());
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
