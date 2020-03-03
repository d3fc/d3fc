const numPoints = 1000;
const data = d3.range(numPoints).map(() => ({
    x: Math.random(),
    y: Math.random()
}));

const x = d3.scaleLinear().domain([0, 1]);
const y = d3.scaleLinear().domain([0, 1]);

const x2 = x.copy();
const y2 = y.copy();

const webglSeries = fc
    .seriesWebglPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y);

const canvasSeries = fc
    .seriesCanvasPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y);

const zoom = d3.zoom().on('zoom', () => {
    const t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    y.domain(t.rescaleY(y2).domain());

    d3.select('d3fc-group')
        .node()
        .requestRedraw();
});

const decorate = sel => {
    sel.select('.plot-area')
        .on('measure.range', () => {
            const d = d3.event.detail;
            x2.range([0, d.width]);
            y2.range([d.height, 0]);
        })
        .call(zoom);
};

const chart = fc
    .chartCartesian(x, y)
    .canvasPlotArea(null)
    .webglPlotArea(webglSeries)
    .decorate(decorate);

d3.select('#chart')
    .datum(data)
    .call(chart);

d3.select('#chart-type').on('change', () => {
    const chartType = d3.select('#chart-type').property('value');

    chart
        .canvasPlotArea(chartType === 'canvas' ? canvasSeries : null)
        .webglPlotArea(chartType === 'webgl' ? webglSeries : null);

    d3.select('#chart')
        .datum(data)
        .call(chart);

    zoom.transform(d3.select('.plot-area'), d3.zoomIdentity);
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
