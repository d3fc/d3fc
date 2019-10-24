const randInt = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));

const randColor = () =>
    [Math.random(), Math.random(), Math.random(), 1.0];

// Prepare data.
const data1 = [];
const data2 = [];
for (let i = 1; i < 20; i++) {
    data1.push({ x: i, y0: 0, y1: randInt(1, 5), w: 0.75, color: randColor() });
    data2.push({ x: i, y0: 0, y1: randInt(1, 5), w: 0.75, color: randColor() });
}
data2.forEach((d, i) => {
    const offset = data1[i].y1;
    d.y0 += offset;
    d.y1 += offset;
});
const data = [...data1, ...data2];

const color = [];
data.forEach(({ color: [r, g, b, a] }) => {
    for (let i = 0; i < 6; i++) {
        color.push(r, g, b, a);
    }
});

// Render chart.
const x = d3.scaleLinear();
const y = d3.scaleLinear();

x.domain([0, 20]);
y.domain([0, 10]);

const x2 = x.copy();
const y2 = y.copy();

const getWebglSeries = () => fc.seriesWebglBar()
    .crossValue((d) => d.x)
    .baseValue((d) => d.y0)
    .mainValue((d) => d.y1)
    .bandwidth((d) => d.w)
    .decorate((program) => {
        // TODO: Since a lot of these are applied to the header and
        //       body of both shaders, is something like this possible?
        //       program.shaders().append(fc.shaderSnippets.multiColor)
        //       Which would resolve to the below.
        program.vertexShader()
            .appendHeader(fc.vertexShaderSnippets.multiColor.header)
            .appendBody(fc.vertexShaderSnippets.multiColor.body);

        program.fragmentShader()
            .appendHeader(fc.fragmentShaderSnippets.multiColor.header)
            .appendBody(fc.fragmentShaderSnippets.multiColor.body);

        const colorArray = new Float32Array(color);
        program.buffers()
            .attribute('aColor', fc.attributeBuilder(colorArray).components(4));
    });

const zoom = d3.zoom()
    .on('zoom', () => {
        x.domain(d3.event.transform.rescaleX(x2).domain());
        y.domain(d3.event.transform.rescaleY(y2).domain());
    });

const decorate = (selection) => {
    selection.enter()
        .select('.plot-area')
        .on('measure.range', () => {
            x2.range([0, d3.event.detail.width]);
            y2.range([d3.event.detail.height, 0]);
        })
        .call(zoom);

    requestAnimationFrame(render);
};

const getChart = () => fc.chartCartesian(x, y)
    .decorate(decorate)
    .webglPlotArea(getWebglSeries());

const chart = getChart();
const render = () => {
    d3.select('#chart')
        .datum(data)
        .call(chart);
};
requestAnimationFrame(render);
