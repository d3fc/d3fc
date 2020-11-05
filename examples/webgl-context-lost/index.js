const numPoints = 1000;
const data = d3.range(numPoints).map(() => ({
    x: Math.random(),
    y: Math.random()
}));

const x = d3.scaleLinear().domain([0, 1]);
const y = d3.scaleLinear().domain([0, 1]);

const webglSeries = fc
    .seriesWebglPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y);

const canvasSeries = fc
    .seriesCanvasPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y);

const zoom = fc.zoom().on('zoom', event => render());

const chart = fc
    .chartCartesian(x, y)
    .canvasPlotArea(null)
    .webglPlotArea(webglSeries)
    .decorate(sel => {
        sel.enter().call(zoom, x, y);
    });

const render = () => {
    d3.select('#chart')
        .datum(data)
        .call(chart);
};

render();

d3.select('#chart-type').on('change', () => {
    const chartType = d3.select('#chart-type').property('value');

    chart
        .canvasPlotArea(chartType === 'canvas' ? canvasSeries : null)
        .webglPlotArea(chartType === 'webgl' ? webglSeries : null);

    x.domain([0, 1]);
    y.domain([0, 1]);

    render();
});

const canvas = d3.select('d3fc-canvas canvas').node();
const context = canvas.getContext('webgl');
const ext = context.getExtension('WEBGL_lose_context');

d3.select('#lose-context').on('click', () => {
    ext.loseContext();
});
d3.select('#restore-context').on('click', () => {
    ext.restoreContext();
});
