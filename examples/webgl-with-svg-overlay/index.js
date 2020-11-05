d3.json('star-data.json').then(data => {
    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    x.domain(fc.extentLinear().accessors([d => d.x])(data));
    y.domain(fc.extentLinear().accessors([d => d.y])(data));

    const zoom = fc.zoom().on('zoom', () => render());

    const fillColor = fc
        .webglFillColor()
        .value(d => d.color)
        .data(data);

    const starChart = fc
        .seriesWebglPoint()
        .type(d3.symbolStar)
        .xScale(x)
        .yScale(y)
        .crossValue((d, i) => d.x)
        .mainValue(d => d.y)
        .size(d => d.size)
        .defined(() => true)
        .equals((previousData, data) => previousData.length > 0)
        .decorate(program => {
            // Set the color of the points.
            fillColor(program);

            // Enable blending of transparent colors.
            const context = program.context();
            context.enable(context.BLEND);
            context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
        });

    const informationOverlay = fc
        .seriesSvgPoint()
        .type(d3.symbolStar)
        .xScale(x)
        .yScale(y)
        .crossValue((d, i) => d.x)
        .mainValue(d => d.y)
        .defined(d => d.name !== '')
        .size(d => d.size)
        .decorate(selection => {
            selection
                .enter()
                .select('path')
                .style('fill', 'white')
                .style('stroke', 'white')
                .style('stroke-width', '3')
                .style('stroke-opacity', '0');

            selection
                .on('mouseover', (event, data) => {
                    d3.select(event.currentTarget)
                        .select('path')
                        .style('stroke-opacity', '1');
                    d3.select(event.currentTarget)
                        .append('text')
                        .attr('fill', 'white')
                        .attr('stroke', 'none')
                        .attr('x', 12)
                        .attr('y', 6)
                        .text(data.name);
                })
                .on('mouseout', (event, data) => {
                    d3.select(event.currentTarget)
                        .select('path')
                        .style('stroke-opacity', '0');
                    d3.select(event.currentTarget)
                        .select('text')
                        .remove();
                });
        });

    const chart = fc
        .chartCartesian(x, y)
        .chartLabel(`Stars`)
        .svgPlotArea(informationOverlay)
        .webglPlotArea(starChart)
        .decorate(selection => {
            selection.enter().call(zoom, x, y);
        });

    const render = () => {
        d3.select('#chart')
            .datum(data)
            .call(chart);
    };

    render();
});
