const data = fc.randomGeometricBrownianMotion().steps(50)(1);

const container = document.querySelector('d3fc-svg');
const margin = 10;

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(extent(data));

const color = d3.scaleOrdinal(d3.schemeCategory10);

const series = fc
    .seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .decorate(selection => {
        selection.enter().style('fill', (_, i) => color(i));
    });

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(data)
            .call(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([margin, width - margin]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
