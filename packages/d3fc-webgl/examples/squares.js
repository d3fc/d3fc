const numPoints = 1000;
const data = d3.range(numPoints).map(() => ({
    x: Math.random(),
    y: Math.random()
}));

const x = d3.scaleLinear();
const y = d3.scaleLinear();

x.domain([0, 1]);
y.domain([0, 1]);

const x2 = x.copy();
const y2 = y.copy();

const crossValue = d => d.x;
const mainValue = d => d.y;

const getWebglSeries = () =>
    fc
        .seriesWebglPoint()
        .crossValue(crossValue)
        .mainValue(mainValue)
        .type(d3.symbolSquare)
        .decorate(program => {
            fc.pointFill()(program);
            fc.pointStroke()(program);
            fc.pointAntiAlias()(program);

            const context = program.context();
            context.enable(context.BLEND);
            context.blendFuncSeparate(
                context.SRC_ALPHA,
                context.ONE_MINUS_SRC_ALPHA,
                context.ONE,
                context.ONE_MINUS_SRC_ALPHA
            );
        });

// create a d3-zoom that handles the mouse / touch interactions
const zoom = d3.zoom().on('zoom', () => {
    // update the scale used by the chart to use the updated domain
    x.domain(d3.event.transform.rescaleX(x2).domain());
    y.domain(d3.event.transform.rescaleY(y2).domain());
    d3.select('d3fc-group')
        .node()
        .requestRedraw();
});

const decorate = sel => {
    // add the zoom interaction on the enter selection
    sel.enter()
        .select('.plot-area')
        .on('measure.range', () => {
            x2.range([0, d3.event.detail.width]);
            y2.range([d3.event.detail.height, 0]);
        })
        .call(zoom);
};

const chart = fc
    .chartCartesian(x, y)
    .chartLabel(`${numPoints} Points`)
    .decorate(decorate)
    .webglPlotArea(getWebglSeries());

d3.select('#chart')
    .datum(data)
    .call(chart);
