const container = document.querySelector('d3fc-svg');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const xAxis = d3.axisBottom(xScale);

const yAxis = d3.axisRight(yScale);

const xAxisJoin = fc.dataJoin('g', 'x-axis');

const yAxisJoin = fc.dataJoin('g', 'y-axis');

const gridline = fc
    .annotationSvgGridline()
    .xScale(xScale)
    .yScale(yScale);

let drawWidth = 0;
let drawHeight = 0;

d3.select(container)
    .on('draw', () => {
        xScale.domain([0, Math.random() * 100]);
        yScale.domain([0, Math.random() * 100]);

        const svg = d3
            .select(container)
            .select('svg')
            .transition()
            .duration(1000)
            .ease(d3.easeLinear);

        const xAxisSelection = xAxisJoin(svg, d => [d])
            .attr('transform', `translate(0, ${drawHeight - 20})`)
            .call(xAxis);
        xAxisSelection
            .enter()
            .attr('transform', `translate(0, ${drawHeight - 20})`);
        const yAxisSelection = yAxisJoin(svg, d => [d])
            .attr('transform', `translate(${drawWidth - 30}, 0)`)
            .call(yAxis);
        yAxisSelection
            .enter()
            .attr('transform', `translate(${drawWidth - 30}, 0)`);

        svg.call(gridline);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);

        drawWidth = width;
        drawHeight = height;
    });

container.requestRedraw();
setInterval(() => {
    container.requestRedraw();
}, 1100);
