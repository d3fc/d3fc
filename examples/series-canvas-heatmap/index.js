d3.csv('heatmap-data.csv', type).then(data => {
    const container = document.querySelector('d3fc-canvas');

    // Here we use band scales to demonstrate that the autoBandwidth component
    // is able to obtain the bandwidth from the scale
    const xScale = d3.scaleBand().domain(d3.range(0, 23));

    const yScale = d3.scaleBand().domain(d3.range(1, 8));

    const series = fc
        .autoBandwidth(fc.seriesCanvasHeatmap())
        .xValue(d => d.hour)
        .yValue(d => d.day)
        .colorValue(d => d.count)
        .xScale(xScale)
        .yScale(yScale)
        // The band scales require different alignments
        .xAlign('right')
        .yAlign('top')
        .widthFraction(1.0);

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
});

function type(d) {
    d.count = Number(d.count);
    d.day = Number(d.day);
    d.hour = Number(d.hour);
    return d;
}
