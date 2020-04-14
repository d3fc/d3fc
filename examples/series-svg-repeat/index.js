d3.text('repeat-data.csv').then(text => {
    const data = d3.csvParseRows(text, d => d.map(s => Number(s)));

    const container = document.querySelector('d3fc-svg');

    const xScale = d3.scaleLinear().domain([0, data.length - 1]);

    const yScale = d3.scaleLinear().domain([0, 60]);

    const line = fc
        .seriesSvgLine()
        .crossValue((_, i) => i)
        .mainValue(d => d);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const series = fc
        .seriesSvgRepeat()
        .xScale(xScale)
        .yScale(yScale)
        .series(line)
        .decorate(sel => {
            sel.attr('stroke', (_, i) => color(i));
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
            xScale.range([0, width]);
            yScale.range([height, 0]);
        });

    container.requestRedraw();
});
