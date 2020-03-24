const data = fc.randomGeometricBrownianMotion().steps(25)(1);

const container = document.querySelector('d3fc-canvas');

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear().pad([0.5, 0.5])(data));

const bar = fc
    .seriesCanvasBar()
    .crossValue((_, i) => i)
    .mainValue(d => d);

const line = fc
    .seriesCanvasLine()
    .crossValue((_, i) => i)
    .mainValue(d => d);

const series = fc
    .seriesCanvasMulti()
    .xScale(xScale)
    .yScale(yScale)
    .series([fc.autoBandwidth(bar), line]);

d3.select(container)
    .on('draw', () => {
        series(data);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);

        const ctx = container.querySelector('canvas').getContext('2d');
        series.context(ctx);
    });

container.requestRedraw();
