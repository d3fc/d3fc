const data = [
    { x: 'fish', y: 25 },
    { x: 'cat', y: 15 },
    { x: 'dog', y: 35 }
];

const container = document.querySelector('d3fc-svg');

const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.x))
    .paddingInner(0.2)
    .paddingOuter(0.1);

const yScale = d3
    .scaleLinear()
    .domain(fc.extentLinear().include([0])(data.map(d => d.y)));

const series = fc
    .autoBandwidth(fc.seriesSvgBar())
    .xScale(xScale)
    .yScale(yScale)
    .align('left')
    .crossValue(d => d.x)
    .mainValue(d => d.y);

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(data)
            .call(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.rangeRound([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
