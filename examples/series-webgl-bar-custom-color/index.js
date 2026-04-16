// Per-datapoint custom colors via shader attributes.
//
// Demonstrates:
// - program.vertexShader().appendHeader() / .appendBody()
// - program.fragmentShader().appendHeader() / .appendBody()
// - fc.webglAttribute() for per-datapoint data
// - program.buffers().attribute() for binding attributes to shaders

const data = fc.randomGeometricBrownianMotion().steps(30)(1);

// Assign a color to each bar based on whether the value increased or decreased
const colors = data.map((d, i) => {
    if (i === 0) return [0.4, 0.4, 0.5, 1.0]; // slate for first bar
    return d > data[i - 1]
        ? [0.13, 0.39, 0.76, 1.0] // blue for increase
        : [0.84, 0.35, 0.11, 1.0]; // orange for decrease
});

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear()(data));

const container = document.querySelector('d3fc-canvas');

const series = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((d, i) => i)
    .mainValue(d => d)
    .bandwidth(10)
    .defined(() => true)
    .equals(previousData => previousData.length > 0)
    .decorate(program => {
        // Declare a custom attribute in the vertex shader to receive per-bar colors,
        // and a varying to forward it to the fragment shader.
        program
            .vertexShader()
            .appendHeader('attribute vec4 aColor;')
            .appendHeader('varying lowp vec4 vColor;')
            .appendBody('vColor = aColor;');

        // In the fragment shader, use the forwarded color.
        program
            .fragmentShader()
            .appendHeader('varying lowp vec4 vColor;')
            .appendBody('gl_FragColor = vColor;');

        // Create a per-datapoint attribute containing RGBA color values.
        const colorAttribute = fc
            .webglAttribute()
            .size(4)
            .type(program.context().FLOAT)
            .data(colors);

        // Bind the attribute to the shader variable name.
        program.buffers().attribute('aColor', colorAttribute);
    });

let gl = null;

d3.select(container)
    .on('measure', event => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
        gl = container.querySelector('canvas').getContext('webgl');
        series.context(gl);
    })
    .on('draw', () => {
        series(data);
    });

container.requestRedraw();
