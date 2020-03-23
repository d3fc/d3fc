const data = fc.randomGeometricBrownianMotion().steps(25)(1);

const container = document.querySelector('d3fc-svg');

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear().pad([0.5, 0.5])(data));

const bar = fc
    .seriesSvgBar()
    .crossValue((_, i) => i)
    .mainValue(d => d);

const line = fc
    .seriesSvgLine()
    .crossValue((_, i) => i)
    .mainValue(d => d);

const series = fc
    .seriesSvgMulti()
    .xScale(xScale)
    .yScale(yScale)
    .series([fc.autoBandwidth(bar), line]);

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(data)
            .call(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
