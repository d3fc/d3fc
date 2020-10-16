// create some test data
const prng = d3.randomNormal();

const data = d3.range(1e3).map(d => ({
    x: prng(),
    y: prng()
}));

const x = d3.scaleLinear().domain([-5, 5]);
const y = d3.scaleLinear().domain([-5, 5]);

const area = fc
    .seriesCanvasPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .size(4);

// create a d3fc-zoom that handles the mouse / touch interactions
const zoom = fc.zoom().on('zoom', render);

// the chart!
const chart = fc
    .chartCartesian(x, y)
    .chartLabel('Canvas Zoom 1,000 Points')
    .canvasPlotArea(area)
    .decorate(sel => {
        // add the zoom interaction on the enter selection
        // use selectAll to avoid interfering with the existing data joins
        sel.enter()
            .selectAll('.plot-area')
            .call(zoom, x, y);
        sel.enter()
            .selectAll('.x-axis')
            .call(zoom, x, null);
        sel.enter()
            .selectAll('.y-axis')
            .call(zoom, null, y);
    });

function render() {
    d3.select('#zoom-chart')
        .datum(data)
        .call(chart);
}

render();
