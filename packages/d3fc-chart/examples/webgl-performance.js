const symbols = [d3.symbolCircle, d3.symbolCross, d3.symbolDiamond, d3.symbolSquare, d3.symbolStar, d3.symbolTriangle, d3.symbolWye];
const colors = ['blue', 'green', 'red', 'cyan', 'gray', 'yellow', 'purple'];

let numPoints = 20000;
const speed = 0.1;

let usingWebGL = true;
let data;
let speedData; 
let bubbleMovement = true;
let allShapes = false;

const generateData = () => {
    const numSeries = allShapes ? symbols.length : 1;
    const numPerSeries = Math.floor(numPoints / numSeries);
    speedData = [];
    data = [];
    for (let s = 0; s < numSeries; s++) {
        const series = usingWebGL ? new Float32Array(numPerSeries * 3) :  []; 
        const seriesSpeed = []; 
        let index = 0; 
        for (let n = 0; n < numPerSeries; n++) { 
            const item = { 
                x: Math.random() * 100, 
                y: Math.random() * 100, 
                s: 50 + Math.random() * 50, 
                dx: Math.random() * speed - speed / 2, 
                dy: Math.random() * speed - speed / 2 
            };

            if (usingWebGL) {
                series[index++] = item.x; 
                series[index++] = item.y; 
                series[index++] = item.s; 
                 
                seriesSpeed.push({dx: item.dx, dy: item.dy}); 
            } else {
                series.push(item); 
            }
        } 
        speedData.push(seriesSpeed); 
        data.push(series);
    }
};
generateData();

let showBorders = false;
const createSeries = (asWebGL) => {
    const seriesType = asWebGL ? fc.seriesWebglPoint : fc.seriesCanvasPoint;
    const multiType = asWebGL ? fc.seriesWebglMulti : fc.seriesCanvasMulti;

    var allSeries = symbols.map((symbol, i) =>
        seriesType()
            .size(d => d.s)
            .type(symbol)
            .decorate(context => {
                const color = d3.color(colors[i]);
                if (showBorders) {
                    context.strokeStyle = color + '';
                    color.opacity = 0.5;
                } else {
                    context.strokeStyle = 'transparent';
                }
                context.fillStyle = color + '';
            })
    );

    return multiType()
        .series(allSeries)
        .mapping((data, index) => {
            return data[index];
        });
};

const createChart = (asWebGL) => {
    const chart = fc.chartCartesian(d3.scaleLinear(), d3.scaleLinear())
        .yDomain([0, 100])
        .xDomain([0, 100]);

    if (asWebGL) {
        chart.webglPlotArea(createSeries(asWebGL));
    } else {
        chart.canvasPlotArea(createSeries(asWebGL));
    }
    return chart;
};
let chart = createChart(true);

const moveBubbles = () => {
    data.forEach((series, seriesIndex) => { 
        if (usingWebGL) {
            speedData[seriesIndex].forEach((b, i) => { 
                const index = i * 3; 
     
                series[index] += b.dx; 
                series[index + 1] += b.dy; 
     
                if (series[index] > 100 || series[index] < 0) b.dx = -b.dx; 
                if (series[index + 1] > 100 || series[index + 1] < 0) b.dy = -b.dy; 
            }); 
        } else {
            series.forEach(b => { 
                b.x += b.dx; 
                b.y += b.dy; 
    
                if (b.x > 100 || b.x < 0) b.dx = -b.dx; 
                if (b.y > 100 || b.y < 0) b.dy = -b.dy; 
            }); 
        }
    }); 
};

d3.select('#seriesCanvas').on('click', () => restart(!d3.event.target.checked));
d3.select('#withBorders').on('click', () => { showBorders = d3.event.target.checked; });
d3.select('#moveBubbles').on('click', () => { bubbleMovement = d3.event.target.checked; });
d3.select('#allShapes').on('click', () => {
    allShapes = d3.event.target.checked;
    restart(usingWebGL);
});

let lastTime = 0;
const times = [];
let i = 0;

const showFPS = (t) => {
    const dt = t - lastTime;
    lastTime = t;
    times.push(dt);
    i++;
    if (times.length > 10) times.splice(0, 1);
    if (i > 10) {
        i = 0;
        const avg = times.reduce((s, t) => s + t, 0) / times.length;
        d3.select('#fps').text(`fps: ${Math.floor(1000 / avg)}`);
    }
};

const render = (t) => {
    showFPS(t);
    if (bubbleMovement) moveBubbles();

    // render
    d3.select('#content')
        .datum(data)
        .call(chart);

    if (stopRequest) {
        stopRequest();
    } else {
        requestAnimationFrame(render);
    }
};

const pointSlider = window.slider().max(100000).value(numPoints).on('change', value => {
    numPoints = value;
    generateData();
});
d3.select('#slider').call(pointSlider);

let stopRequest = null;
const stop = () => {
    return new Promise(resolve => {
        stopRequest = () => {
            stopRequest = null;
            resolve();
        };
    });
};
const start = () => requestAnimationFrame(render);

const restart = asWebGL => {
    stop().then(() => {
        d3.select('#content').html('');

        usingWebGL = asWebGL;
        generateData();
        chart = createChart(asWebGL);

        start();
    });
};

start();
