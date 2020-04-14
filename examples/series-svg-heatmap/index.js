d3.csv('heatmap-data.csv', type).then(data => {
    const container = document.querySelector('d3fc-svg');

    const xScale = d3.scaleLinear().domain([-0.5, 23.5]);

    const yScale = d3.scaleLinear().domain([0.5, 7.5]);

    const series = fc
        .autoBandwidth(fc.seriesSvgHeatmap())
        .xValue(d => d.hour)
        .yValue(d => d.day)
        .colorValue(d => d.count)
        .colorInterpolate(d3.interpolateWarm)
        .xScale(xScale)
        .yScale(yScale)
        .widthFraction(1.0);

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
});

function type(d) {
    d.count = Number(d.count);
    d.day = Number(d.day);
    d.hour = Number(d.hour);
    return d;
}
