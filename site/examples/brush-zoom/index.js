// see: http://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6

// create some test data
const random = d3.randomNormal(0, 0.2);
const sqrt3 = Math.sqrt(3);
const points0 = d3.range(300).map(() => [random() + sqrt3, random() + 1, 0]);
const points1 = d3.range(300).map(() => [random() - sqrt3, random() + 1, 1]);
const points2 = d3.range(300).map(() => [random(), random() - 1, 2]);
const data = d3.merge([points0, points1, points2]);

const yExtent = fc
    .extentLinear()
    .accessors([d => d[1]])
    .pad([0.1, 0.1]);

const xExtent = fc
    .extentLinear()
    .accessors([d => d[0]])
    .pad([0.1, 0.1]);

const x = d3.scaleLinear().domain(xExtent(data));
const y = d3.scaleLinear().domain(yExtent(data));
const color = d3.scaleOrdinal(d3.schemeCategory10);

const pointSeries = fc
    .seriesSvgPoint()
    .crossValue(d => d[0])
    .mainValue(d => d[1])
    .size(15)
    .decorate(selection => {
        selection.enter().style('fill', d => color(d[2]));
    });

let idleTimeout;
const idleDelay = 350;

const brush = fc.brush().on('end', e => {
    if (!e.selection) {
        if (!idleTimeout) {
            // detect double clicks
            idleTimeout = setTimeout(() => (idleTimeout = null), idleDelay);
        } else {
            x.domain(xExtent(data));
            y.domain(yExtent(data));
            render();
        }
    } else {
        x.domain(e.xDomain);
        y.domain(e.yDomain);
        render();
    }
});

const multi = fc
    .seriesSvgMulti()
    .series([pointSeries, brush])
    .mapping((data, index, series) => {
        switch (series[index]) {
            case pointSeries:
                return data;
            case brush:
                // the brush is transient, so always has null data
                return null;
        }
    });

const mainChart = fc.chartCartesian(x, y).svgPlotArea(multi);

function render() {
    d3.select('#main-chart')
        .datum(data)
        .transition()
        .call(mainChart);
}

render();
