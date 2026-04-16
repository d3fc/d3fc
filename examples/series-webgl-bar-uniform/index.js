// Custom uniforms for global shader parameters.
//
// Demonstrates:
// - fc.webglUniform() for global shader values
// - program.buffers().uniform() for binding uniforms to shaders
// - Using a uniform to control a visual property (stripe pattern width)

const data = fc.randomGeometricBrownianMotion().steps(200)(1);

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear()(data));

const container = document.querySelector('d3fc-canvas');

// Stripe width in pixels — controls the visual density of the pattern
const stripeWidth = 6.0;

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
        // Declare a uniform in the fragment shader for the stripe spacing.
        program
            .fragmentShader()
            .appendHeader('uniform highp float uStripeWidth;')
            .appendBody(
                `
                // Create horizontal stripes using the fragment's y-coordinate.
                // Alternating bands of the fill color and a darker shade.
                float stripe = mod(gl_FragCoord.y, uStripeWidth * 2.0);
                if (stripe < uStripeWidth) {
                    gl_FragColor = vec4(0.26, 0.53, 0.96, 1.0);
                } else {
                    gl_FragColor = vec4(0.18, 0.38, 0.71, 1.0);
                }
                `
            );

        // Create a uniform with a scalar value and bind it to the shader.
        const stripeWidthUniform = fc.webglUniform().data(stripeWidth);

        program.buffers().uniform('uStripeWidth', stripeWidthUniform);
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
