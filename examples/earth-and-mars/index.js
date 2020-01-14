const options = {
    numPoints: 1e5,
    chartType: 'WebGL',
    showMultiColor: false
};

let data = [];
let currentData;

const worker = new Worker('worker.js');
worker.onmessage = e => {
    data = e.data;
    currentData = data.slice(0, options.numPoints);

    x.domain([currentData[0].date, currentData[currentData.length - 1].date]);
    x2 = x.copy();

    render();
};

const x = d3.scaleTime();
const y = d3.scaleLinear();

y.domain([0, 400]);
let x2 = x.copy();

const crossValue = d => d.date;
const mainValue = d => d.distance;

const blueGradientDecorate = program => {
    program.fragmentShader().appendBody(`
        vec4 color = vec4(70.0/255.0, 130.0/255.0, 180.0/255.0, 1.0);
        float colorModifier = 1.0 - gl_FragCoord.y / 421.0;
        colorModifier = smoothstep(0.875, 1.0, colorModifier);
        gl_FragColor = vec4(color + ((1.0 - color) * colorModifier));
    `);
};

const webglArea = fc
    .seriesWebglArea()
    .mainValue(mainValue)
    .crossValue(crossValue)
    .defined(() => true)
    .equals(d => d.length)
    .decorate(blueGradientDecorate);

const webglLine = fc
    .seriesWebglLine()
    .mainValue(mainValue)
    .crossValue(crossValue)
    .defined(() => true)
    .equals(d => d.length);

const webglSeries = fc.seriesWebglMulti().series([webglArea, webglLine]);

const canvasArea = fc
    .seriesCanvasArea()
    .mainValue(mainValue)
    .crossValue(crossValue)
    .decorate(context => {
        const canvasHeight = d3.select('.plot-area').node().offsetHeight;

        const grd = context.createLinearGradient(
            0,
            canvasHeight * 0.875,
            0,
            canvasHeight
        );
        grd.addColorStop(0, 'steelblue');
        grd.addColorStop(1, 'white');

        context.fillStyle = grd;
    });

const canvasLine = fc
    .seriesCanvasLine()
    .mainValue(mainValue)
    .crossValue(crossValue);

const canvasSeries = fc.seriesCanvasMulti().series([canvasArea, canvasLine]);

const requestRedraw = () => {
    d3.select('d3fc-group')
        .node()
        .requestRedraw();
};

const zoom = d3.zoom().on('zoom', () => {
    x.domain(d3.event.transform.rescaleX(x2).domain());
    requestRedraw();
});

const decorate = sel => {
    sel.select('.plot-area')
        .on('measure.range', () => {
            x2.range([0, d3.event.detail.width]);
        })
        .call(zoom);
};

const multiColorAreaDecorate = program => {
    program.vertexShader().appendHeader(`varying lowp vec4 vColor;`)
        .appendBody(`float colourModifier = smoothstep(50.0, 400.0, aMainValue);
        vColor = (vec4(0.55, 0.65, 0.75, 1) * colourModifier) + ((1.0 - colourModifier) * vec4(0.75, 0.45, 0.45, 1));
        float verticalFade = max(0.0, smoothstep(-1.1, -0.9, gl_Position.y) - 0.15);
        vColor.a = vColor.a * verticalFade;
    `);

    program.fragmentShader().appendHeader(`
        varying lowp vec4 vColor;
    `).appendBody(`
        gl_FragColor = vColor;
    `);
};

const multiColorLineDecorate = program => {
    program.vertexShader().appendHeader(`varying lowp vec4 vColor;`)
        .appendBody(`float colourModifier = smoothstep(-0.875, 1.0, gl_Position.y);
            vColor = (vec4(0.55, 0.65, 0.75, 1) * colourModifier) + ((1.0 - colourModifier) * vec4(0.75, 0.45, 0.45, 1));`);

    program.fragmentShader().appendHeader(`varying lowp vec4 vColor;`)
        .appendBody(`
            gl_FragColor = vColor;
    `);
};

const addShowMultiColor = () => {
    gui.add(options, 'showMultiColor').onChange(render);
};

const render = () => {
    currentData = data.slice(0, options.numPoints);
    updateSeries();
    decorateWebglSeries();

    chart
        .canvasPlotArea(options.chartType === 'Canvas' ? canvasSeries : null)
        .webglPlotArea(options.chartType === 'WebGL' ? webglSeries : null);

    d3.select('#chart')
        .datum(currentData)
        .call(chart);

    zoom.transform(d3.select('.plot-area'), d3.zoomIdentity);
};

// eslint-disable-next-line no-undef
const gui = new dat.GUI();
gui.add(options, 'numPoints')
    .min(2)
    .max(options.numPoints)
    .onFinishChange(render);
gui.add(options, 'chartType', ['WebGL', 'Canvas']).onFinishChange(chartType => {
    switch (chartType) {
        case 'WebGL':
            addShowMultiColor();
            break;
        case 'Canvas':
            gui.__controllers[2].remove();
            options.showMultiColor = false;
            break;
        default:
            throw new Error('Invalid chart type used.');
    }

    render();
});
addShowMultiColor();

const chart = fc
    .chartCartesian(x, y)
    .yOrient('left')
    .chartLabel('The distance between Earth and Mars over time')
    .xLabel('Year')
    .yLabel('Distance (million Km)')
    .decorate(decorate);

const updateSeries = () => {
    webglSeries
        .xScale()
        .domain([
            currentData[0].date,
            currentData[currentData.length - 1].date
        ]);

    canvasSeries
        .xScale()
        .domain([
            currentData[0].date,
            currentData[currentData.length - 1].date
        ]);
};

const decorateWebglSeries = () => {
    const [areaSeries, lineSeries] = webglSeries.series();
    areaSeries.decorate(
        options.showMultiColor ? multiColorAreaDecorate : blueGradientDecorate
    );
    lineSeries
        .lineWidth(options.showMultiColor ? 2 : 1)
        .decorate(options.showMultiColor ? multiColorLineDecorate : () => {});
};

worker.postMessage({ numPoints: options.numPoints });
