const data = [{ x: 450, y: 450 }];

const container = document.querySelector('d3fc-svg');

const xScale = d3.scaleLinear().domain([0, 1]);

const yScale = d3.scaleLinear().domain([0, 1]);

const format = d3.format('.2f');

const crosshair = fc
    .annotationSvgCrosshair()
    .xScale(xScale)
    .yScale(yScale)
    .xLabel(d => format(xScale.invert(d.x)))
    .yLabel(d => format(yScale.invert(d.y)))
    .decorate(sel => {
        sel.selectAll('.point>path').attr('transform', 'scale(10)');
    });

const xAxis = d3.axisBottom(xScale).tickFormat('');

const yAxis = d3.axisRight(yScale).tickFormat('');

const xAxisJoin = fc.dataJoin('g', 'x-axis');

const yAxisJoin = fc.dataJoin('g', 'y-axis');

const svg = d3.select(container).select('svg');

d3.select(container)
    .on('draw', () => {
        svg.datum(data).call(crosshair);
    })
    .on('mousemove', () => {
        const { clientX, clientY } = event;
        data[0] = { x: clientX, y: clientY };
        container.requestRedraw();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([10, width - 30]);
        yScale.range([5, height - 20]);
        xAxisJoin(svg, d => [d])
            .attr('transform', `translate(0, ${height - 20})`)
            .call(xAxis);
        yAxisJoin(svg, d => [d])
            .attr('transform', `translate(${width - 30}, 0)`)
            .call(yAxis);
    });

container.requestRedraw();
