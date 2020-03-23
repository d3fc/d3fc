const data = fc.randomGeometricBrownianMotion().steps(25)(1);

const container = document.querySelector('d3fc-svg');
const margin = 25;

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(fc.extentLinear().pad([0.1, 0.1])(data));

const series = fc
    .seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue(d => d)
    .decorate(selection => {
        selection
            .enter()
            .append('text')
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(0, -10)')
            .text(d => d3.format('.3f')(d))
            .attr('fill', 'black');
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
