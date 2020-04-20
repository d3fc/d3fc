const data = fc.randomGeometricBrownianMotion().steps(100)(1);

const container = document.querySelector('d3fc-svg');

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear()(data));

const series = fc
    .seriesSvgLine()
    .xScale(xScale)
    .yScale(yScale)
    .defined((_, i) => i % 20 !== 0)
    .crossValue((_, i) => i)
    .mainValue(d => d);

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
