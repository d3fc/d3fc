// Unified shader decoration: custom colors, uniforms, and conditional hatching.
//
// Combines all three shader decoration concepts:
// - Per-datapoint colors via webglAttribute (blue/orange based on price movement)
// - Uniform-controlled hatch spacing via webglUniform
// - Conditional fragment shading (every third bar hatched, others solid)
// - Opacity dimming for bars below the mean value
//
// Based on the pattern from https://github.com/d3fc/d3fc/issues/1894

const data = fc.randomGeometricBrownianMotion().steps(30)(1);

const meanValue = d3.mean(data);

// Per-datapoint colors: blue for increase, orange for decrease,
// dimmed to 40% opacity if below the mean
const colors = data.map((d, i) => {
    const alpha = d < meanValue ? 0.4 : 1.0;
    if (i === 0) return [0.4, 0.4, 0.5, alpha];
    return d > data[i - 1]
        ? [0.13, 0.39, 0.76, alpha]
        : [0.84, 0.35, 0.11, alpha];
});

// State flag: every third bar is "confirmed" and gets the hatch pattern
const states = data.map((d, i) => (i % 3 === 0 ? 1.0 : 0.0));

const hatchSpacing = 8.0;

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
        // Vertex shader: forward color and state to fragment shader
        program
            .vertexShader()
            .appendHeader('attribute vec4 aColor;')
            .appendHeader('attribute float aState;')
            .appendHeader('varying lowp vec4 vColor;')
            .appendHeader('varying float vState;')
            .appendBody(
                `
                vColor = aColor;
                vState = aState;
                `
            );

        // Fragment shader: apply color with conditional diagonal hatch
        program
            .fragmentShader()
            .appendHeader('varying lowp vec4 vColor;')
            .appendHeader('varying float vState;')
            .appendHeader('uniform highp float uHatchSpacing;')
            .appendBody(
                `
                if (vState == 1.0) {
                    // Diagonal hatch pattern using fragment coordinates
                    float diagonal = mod(gl_FragCoord.x + gl_FragCoord.y, uHatchSpacing);
                    float isHatch = step(diagonal, uHatchSpacing * 0.5);
                    vec4 hatchColor = vec4(0.0, 0.0, 0.0, 0.0);
                    gl_FragColor = mix(vColor, hatchColor, isHatch);
                } else {
                    // Solid fill with per-datapoint color and alpha
                    gl_FragColor = vColor;
                }
                `
            );

        // Per-datapoint color attribute (RGBA with opacity dimming)
        const colorAttribute = fc
            .webglAttribute()
            .size(4)
            .type(program.context().FLOAT)
            .data(colors);

        // Per-datapoint state flag (0.0 = solid, 1.0 = hatched)
        const stateAttribute = fc
            .webglAttribute()
            .size(1)
            .type(program.context().FLOAT)
            .data(states);

        // Global hatch spacing uniform
        const hatchSpacingUniform = fc.webglUniform().data(hatchSpacing);

        program
            .buffers()
            .attribute('aColor', colorAttribute)
            .attribute('aState', stateAttribute)
            .uniform('uHatchSpacing', hatchSpacingUniform);
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
