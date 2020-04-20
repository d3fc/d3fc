d3.json('star-data.json').then(data => {
    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    x.domain(fc.extentLinear().accessors([d => d.x])(data));
    y.domain(fc.extentLinear().accessors([d => d.y])(data));

    const x2 = x.copy();
    const y2 = y.copy();

    // create a d3-zoom that handles the mouse / touch interactions
    const zoom = d3.zoom().on('zoom', () => {
        // update the scale used by the chart to use the udpated domain
        x.domain(d3.event.transform.rescaleX(x2).domain());
        y.domain(d3.event.transform.rescaleY(y2).domain());

        requestAnimationFrame(render);
    });

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
            context.blendFuncSeparate(
                context.SRC_ALPHA,
                context.ONE_MINUS_SRC_ALPHA,
                context.ONE,
                context.ONE_MINUS_SRC_ALPHA
            );
        });

    const informationOverlay = fc
        .seriesSvgPoint()
        .type(d3.symbolCircle)
        .xScale(x)
        .yScale(y)
        .crossValue((d, i) => d.x)
        .mainValue(d => d.y)
        .defined(d => d.name !== '')
        .size(d => d.size * 8)
        .decorate(selection => {
            selection
                .enter()
                .style('fill', 'transparent')
                .attr('stroke', 'yellow')
                .attr('stroke-opacity', 0.8);

            selection
                .on('mouseover', (data, i, sel) => {
                    d3.select(sel[i])
                        .attr('stroke-width', 3)
                        .append('text')
                        .attr('font-family', 'sans-serif')
                        .attr('font-size', '14px')
                        .attr('stroke', 'white')
                        .attr('stroke-opacity', 1)
                        .attr('stroke-width', 1)
                        .attr('x', 12)
                        .attr('y', 6)
                        .text(data.name);
                })
                .on('mouseout', (data, i, sel) => {
                    d3.selectAll('text').remove();
                    selection.attr('stroke-width', 1);
                });
        });

    const chart = fc
        .chartCartesian(x, y)
        .chartLabel(`Stars`)
        .webglPlotArea(starChart)
        .decorate(selection => {
            // add the zoom interaction on the enter selection
            selection.selectAll('.plot-area').on('measure.range', () => {
                x2.range([0, d3.event.detail.width]);
                y2.range([d3.event.detail.height, 0]);
            });
            selection.enter().call(zoom);
        });

    let includeOverlay = true;

    const container = document.querySelector('d3fc-canvas');

    const render = () => {
        chart.svgPlotArea(includeOverlay ? informationOverlay : null);

        d3.select(container)
            .datum(data)
            .call(chart);
    };

    d3.select('#showLabels').on('change', () => {
        includeOverlay = d3.event.target.checked;
        render();
    });

    render();
});
