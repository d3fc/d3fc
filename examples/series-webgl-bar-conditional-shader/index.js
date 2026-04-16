// Conditional fragment shading based on data state.
//
// Demonstrates:
// - Passing data-driven state flags to shaders via per-datapoint attributes
// - Conditional logic in fragment shaders (solid vs diagonal hatch)
// - Combining attributes and uniforms in a single shader

const data = fc.randomGeometricBrownianMotion().steps(200)(1);

// Assign a "confirmed" state to roughly half the bars (alternating)
const states = data.map((d, i) => (i % 3 === 0 ? 1.0 : 0.0));

// All bars are the same blue — the visual distinction comes from the shader
const barColor = [0.13, 0.39, 0.76, 1.0];
const colors = data.map(() => barColor);

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear()(data));

const container = document.querySelector('d3fc-canvas');

const hatchSpacing = 8.0;

const series = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((d, i) => i)
    .mainValue(d => d)
    .bandwidth(1)
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

        // Fragment shader: solid fill or diagonal hatch based on state
        program
            .fragmentShader()
            .appendHeader('varying lowp vec4 vColor;')
            .appendHeader('varying float vState;')
            .appendHeader('uniform highp float uHatchSpacing;')
            .appendBody(
                `
                if (vState == 1.0) {
                    // Diagonal hatch: use fragment coordinates to create a stripe pattern
                    float diagonal = mod(gl_FragCoord.x + gl_FragCoord.y, uHatchSpacing);
                    float isHatch = step(diagonal, uHatchSpacing * 0.5);
                    vec4 hatchColor = vec4(0.0, 0.0, 0.0, 0.0);
                    gl_FragColor = mix(vColor, hatchColor, isHatch);
                } else {
                    // Solid fill
                    gl_FragColor = vColor;
                }
                `
            );

        // Per-datapoint color attribute
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
