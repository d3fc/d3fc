let numPoints = 100000;
let data;

const generateData = () => {
    data = d3.range(numPoints).map(i => ({
        x: Math.random(),
        y: Math.random()
    }));
};
generateData();

d3.select('#numPoints').on('change', () => {
    numPoints = parseInt(d3.event.target.value);
    generateData();
    selectedChart.chartLabel(`${numPoints} Points`);
});

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
        .decorate(program => {
            // decorated so that styling matches canvas point implementation
            // ideally this wouldn't be needed (i.e. web gl points would natively be styled the same as canvas points)

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

const getCanvasSeries = () =>
    fc
        .seriesCanvasPoint()
        .crossValue(crossValue)
        .mainValue(mainValue);

// create a d3-zoom that handles the mouse / touch interactions
const zoom = d3.zoom().on('zoom', () => {
    // update the scale used by the chart to use the udpated domain
    x.domain(d3.event.transform.rescaleX(x2).domain());
    y.domain(d3.event.transform.rescaleY(y2).domain());
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

const getChart = () =>
    fc
        .chartCartesian(x, y)
        .chartLabel(`${numPoints} Points`)
        .decorate(decorate);

const getWebglChart = () => getChart().webglPlotArea(getWebglSeries());

const getCanvasChart = () => getChart().canvasPlotArea(getCanvasSeries());

let selectedChart = getWebglChart();

let lastFrame, elapsed, frames;
const resetFPS = () => {
    document.querySelector('#fps').innerHTML = '- FPS';
    lastFrame = 0;
    elapsed = 0;
    frames = 0;
};
resetFPS();

const updateFPS = () => {
    if (lastFrame > 0) {
        elapsed += Date.now() - lastFrame;
        frames++;
    }
    lastFrame = Date.now();

    if (frames > 30) {
        document.querySelector('#fps').innerHTML = `${(
            (frames * 1000) /
            elapsed
        ).toFixed(2)} FPS`;
        frames = 0;
        elapsed = 0;
    }
};

let stopRequest = null;

const restart = getNewChart => {
    stopRequest = () => {
        stopRequest = null;

        d3.select('#chart').html('');
        selectedChart = getNewChart();
        x.domain([0, 1]);
        y.domain([0, 1]);
        requestAnimationFrame(render);
    };
};

d3.select('#webgl').on('click', () => {
    restart(getWebglChart);
});

d3.select('#canvas').on('click', () => {
    restart(getCanvasChart);
});

function render() {
    d3.select('#chart')
        .datum(data)
        .call(selectedChart);

    if (stopRequest) {
        resetFPS();
        stopRequest();
    } else {
        updateFPS();
        requestAnimationFrame(render);
    }
}

requestAnimationFrame(render);
