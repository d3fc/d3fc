d3.text('../__data-files__/repeat-data.csv').then(text => {
    const data = d3.csvParseRows(text, d => d.map(s => Number(s)));

    const container = document.querySelector('d3fc-canvas');

    const xScale = d3.scaleLinear().domain([0, data.length - 1]);

    const yScale = d3.scaleLinear().domain([0, 60]);

    const line = fc
        .seriesCanvasLine()
        .crossValue((_, i) => i)
        .mainValue(d => d);

    const ctx = d3
        .select(container)
        .select('canvas')
        .node()
        .getContext('2d');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const series = fc
        .seriesCanvasRepeat()
        .xScale(xScale)
        .yScale(yScale)
        .context(ctx)
        .series(line)
        .decorate((context, _, index) => {
            context.strokeStyle = color(index);
        });

    d3.select(container)
        .on('draw', () => {
            series(data);
        })
        .on('measure', () => {
            const { width, height } = event.detail;
            xScale.range([0, width]);
            yScale.range([height, 0]);
        });

    container.requestRedraw();
});
