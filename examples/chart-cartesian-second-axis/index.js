const data = d3.range(50).map(d => ({
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
}));

const xExtent = fc.extentLinear().accessors([d => d.x]);
const yExtent = fc
    .extentLinear()
    .accessors([d => d.y, d => d.z])
    .pad([0.1, 0.1]);

const gridlines = fc.annotationSvgGridline();
const line = fc.seriesCanvasLine();
const area = fc.seriesCanvasArea().mainValue(d => d.z);

const multi = fc.seriesCanvasMulti().series([area, line]);

const chart = fc
    .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .yOrient('left')
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(gridlines)
    .canvasPlotArea(multi);

// create a scale for the second axis
const zScale = d3.scaleLinear().domain([-1000, 1000]);
// create an axis for the scale
const zAxis = d3.axisRight(zScale);

chart.decorate(selection => {
    // when the chart is added to the DOM
    selection
        .enter()
        // additionally add a d3fc-svg element for the axis
        .append('d3fc-svg')
        // move the element into the right-axis cell
        .style('grid-column', 4)
        .style('grid-row', 3)
        // and give the axis a width
        .style('width', '3em')
        // when there's a measure event (namespaced to avoid removing existing handlers)
        .on('measure.z-axis', () => {
            // set the range on the scale to the elements height
            zScale.range([d3.event.detail.height, 0]);
        })
        .on('draw.z-axis', (d, i, nodes) => {
            // draw the axis into the svg within the d3fc-svg element
            d3.select(nodes[i])
                .select('svg')
                .call(zAxis);
        });
});

d3.select('#chart')
    .datum(data)
    .call(chart);
