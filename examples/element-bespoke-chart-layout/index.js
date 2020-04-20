const sample = d => ({ x: d / 3, y: Math.sin(d / 3) });

const data = d3.range(50).map(sample);

const xScale = d3.scaleLinear();

const yScale = d3.scaleLinear();

d3.select('#x-axis-top')
    .on('measure', (d, i, nodes) => {
        const { width, height } = d3.event.detail;
        d3.select(nodes[i])
            .select('svg')
            .attr('viewBox', `0 ${-height} ${width} ${height}`);
    })
    .on('draw', (d, i, nodes) => {
        const xAxis = d3.axisTop(xScale);
        d3.select(nodes[i])
            .select('svg')
            .call(xAxis);
    });

d3.select('#x-axis-bottom').on('draw', (d, i, nodes) => {
    const xAxis = d3.axisBottom(xScale);
    d3.select(nodes[i])
        .select('svg')
        .call(xAxis);
});

d3.select('#y-axis-left')
    .on('measure', (d, i, nodes) => {
        const { width, height } = d3.event.detail;
        d3.select(nodes[i])
            .select('svg')
            .attr('viewBox', `${-width} 0 ${width} ${height}`);
    })
    .on('draw', (d, i, nodes) => {
        const yAxis = d3.axisLeft(yScale);
        d3.select(nodes[i])
            .select('svg')
            .call(yAxis);
    });

d3.select('#y-axis-right').on('draw', (d, i, nodes) => {
    const yAxis = d3.axisRight(yScale);
    d3.select(nodes[i])
        .select('svg')
        .call(yAxis);
});

d3.select('#plot-area')
    .datum([])
    .on('measure', () => {
        // Use measure event to ensure scales have their range updated before
        // any of the elements (including the axes) are drawn.
        const { width, height } = d3.event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    })
    .on('draw', (d, i, nodes) => {
        const lineSeries = fc
            .seriesSvgLine()
            .xScale(xScale)
            .yScale(yScale);
        d3.select(nodes[i])
            .select('svg')
            .datum(data)
            .call(lineSeries);
    });

const chartContainer = d3.select('#chart').on('draw', () => {
    // Use group draw event to ensure scales have their domain updated before
    // any of the elements are drawn (draw events are dispatched in document order).
    const xExtent = fc.extentLinear().accessors([d => d.x]);
    xScale.domain(xExtent(data));

    const yExtent = fc.extentLinear().accessors([d => d.y]);
    yScale.domain(yExtent(data));
});

// Now handlers are attached, request a redraw
chartContainer.node().requestRedraw();
