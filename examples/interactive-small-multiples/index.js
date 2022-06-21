d3.tsv('data.tsv', r => ({
    ...r,
    n: Number(r.n),
    year: Number(r.year)
})).then(data => {
    const nested = d3
        .groups(data, k => k.category)
        .map(([key, values]) => ({ key, values }));

    nested.forEach(g => (g.trackball = []));

    const yExtent = fc
        .extentLinear()
        .accessors([d => d.n])
        .pad([0, 0.2])
        .include([0]);

    const xExtent = fc.extentLinear().accessors([d => d.year]);

    const area = fc
        .seriesSvgArea()
        .crossValue(d => d.year)
        .mainValue(d => d.n);

    const line = fc
        .seriesSvgLine()
        .crossValue(d => d.year)
        .mainValue(d => d.n);

    const point = fc
        .seriesSvgPoint()
        .crossValue(d => d.year)
        .mainValue(d => d.value)
        .size(25)
        .decorate(selection => {
            selection.enter().append('text');
            selection.select('text').text(d => d.value);
        });

    const annotation = fc
        .annotationSvgLine()
        .orient('vertical')
        .value(d => d.year)
        .decorate(selection => {
            selection
                .enter()
                .select('.bottom-handle')
                .append('text');
            selection.select('.bottom-handle text').text(d => d.year);
        });

    const multi = fc
        .seriesSvgMulti()
        .series([area, line, annotation, point])
        .mapping((data, index, series) => {
            switch (series[index]) {
                case point:
                case annotation:
                    return data.trackball;
                default:
                    return data.values;
            }
        });

    const xScale = d3.scaleLinear();

    // a pointer component that is added to the plot-area, re-rendering
    // each time the event fires.
    const pointer = fc.pointer().on('point', event => {
        // determine the year
        if (event.length) {
            const year = Math.round(xScale.invert(event[0].x));
            // add the point to each series
            nested.forEach(group => {
                const value = group.values.find(v => v.year === year);
                group.trackball = [
                    {
                        year: year,
                        value: value.n
                    }
                ];
            });
        } else {
            nested.forEach(g => (g.trackball = []));
        }
        render();
    });

    const chart = fc
        .chartCartesian(xScale, d3.scaleLinear())
        .yDomain(yExtent(data))
        .xDomain(xExtent(data))
        .xLabel(d => d.key)
        .yTicks(3)
        .xTicks(2)
        .xTickFormat(d3.format('0'))
        .yOrient('left')
        .svgPlotArea(multi)
        .decorate(sel => {
            sel.enter()
                .select('#chart .plot-area')
                .call(pointer);
        });

    function render() {
        const join = fc.dataJoin('div', 'multiple');
        join(d3.select('#chart'), nested)
            .call(chart)
            .classed('tooltip', d => d.trackball.length);
    }

    render();
});
