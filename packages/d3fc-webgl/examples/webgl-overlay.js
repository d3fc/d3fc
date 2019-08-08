d3.json('star-data.json', data => {
    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    x.domain(fc.extentLinear().accessors([d => d.x])(data));
    y.domain(fc.extentLinear().accessors([d => d.y])(data));

    const x2 = x.copy();
    const y2 = y.copy();

    // create colour attribute buffer
    const colors = new Float32Array(data.length * 4);
    let i = 0;
    data.forEach(d => {
        colors[i++] = d.color[0];
        colors[i++] = d.color[1];
        colors[i++] = d.color[2];
        colors[i++] = d.color[3];
    });
    const colorBuilder = fc.attributeBuilder(colors);

    const getWebglSeries = () =>
        fc
            .seriesWebglPoint()
            .size(d => d.size)
            .decorate(program => {
                program
                    .vertexShader()
                    .appendHeader(fc.vertexShaderSnippets.multiColor.header)
                    .appendBody(fc.vertexShaderSnippets.multiColor.body);

                program
                    .fragmentShader()
                    .appendHeader(fc.fragmentShaderSnippets.multiColor.header)
                    .appendBody(fc.fragmentShaderSnippets.multiColor.body);

                program.buffers().attribute('aColor', colorBuilder);

                const context = program.context();
                context.enable(context.BLEND);
                context.blendFuncSeparate(
                    context.SRC_ALPHA,
                    context.ONE_MINUS_SRC_ALPHA,
                    context.ONE,
                    context.ONE_MINUS_SRC_ALPHA
                );
            });

    const getSvgSeries = () =>
        fc
            .seriesSvgPoint()
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

    // create a d3-zoom that handles the mouse / touch interactions
    const zoom = d3.zoom().on('zoom', () => {
        // update the scale used by the chart to use the udpated domain
        x.domain(d3.event.transform.rescaleX(x2).domain());
        y.domain(d3.event.transform.rescaleY(y2).domain());

        requestAnimationFrame(render);
    });

    const decorate = sel => {
        // add the zoom interaction on the enter selection
        sel.selectAll('.plot-area').on('measure.range', () => {
            x2.range([0, d3.event.detail.width]);
            y2.range([d3.event.detail.height, 0]);
        });
        sel.enter().call(zoom);
    };

    const getChart = (includeOverlay = true) => {
        const chart = fc
            .chartCartesian(x, y)
            .chartLabel(`Stars`)
            .decorate(decorate)
            .webglPlotArea(getWebglSeries());

        if (includeOverlay) {
            chart.svgPlotArea(getSvgSeries());
        }
        return chart;
    };

    let chart = getChart();

    function render() {
        d3.select('#chart')
            .datum(data)
            .call(chart);
    }

    d3.select('#showLabels').on('change', () => {
        chart = getChart(d3.event.target.checked);
        requestAnimationFrame(render);
    });

    requestAnimationFrame(render);
});
