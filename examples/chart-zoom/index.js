// create some test data
const prng = d3.randomNormal();

const data = d3.range(1e3).map(d => ({
    x: prng(),
    y: prng()
}));

const x = d3.scaleLinear().domain([-5, 5]);
const y = d3.scaleLinear().domain([-5, 5]);

// secondary scales for the purposes of computing the zoom
const x2 = x.copy();
const y2 = y.copy();

const area = fc
    .seriesCanvasPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .size(4);

// create a d3-zoom that handles the mouse / touch interactions
const zoom = d3.zoom().on('zoom', function() {
    // update the scale used by the chart to use the updated domain
    x.domain(d3.event.transform.rescaleX(x2).domain());
    y.domain(d3.event.transform.rescaleY(y2).domain());
    render();
});

// the chart!
const chart = fc
    .chartCartesian(x, y)
    .chartLabel('Canvas Zoom 1,000 Points')
    .canvasPlotArea(area)
    .decorate(sel => {
        // add the zoom interaction on the enter selection
        sel.enter()
            .select('.plot-area')
            .on('measure.range', () => {
                x2.range([0, d3.event.detail.width]);
                y2.range([d3.event.detail.height, 0]);
            })
            .call(zoom);
    });

function render() {
    d3.select('#zoom-chart')
        .datum(data)
        .call(chart);
}

render();
