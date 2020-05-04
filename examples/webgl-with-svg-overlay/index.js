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

        render();
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
                .on('mouseover', (data, i, sel) => {
                    d3.select(sel[i])
                        .select('path')
                        .style('stroke-opacity', '1');
                    d3.select(sel[i])
                        .append('text')
                        .attr('fill', 'white')
                        .attr('stroke', 'none')
                        .attr('x', 12)
                        .attr('y', 6)
                        .text(data.name);
                })
                .on('mouseout', (data, i, sel) => {
                    d3.select(sel[i])
                        .select('path')
                        .style('stroke-opacity', '0');
                    d3.select(sel[i])
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
            // add the zoom interaction on the enter selection
            selection.select('.svg-plot-area').on('measure.range', () => {
                x2.range([0, d3.event.detail.width]);
                y2.range([d3.event.detail.height, 0]);
            });
            selection.enter().call(zoom);
        });

    const render = () => {
        d3.select('#chart')
            .datum(data)
            .call(chart);
    };

    render();
});
