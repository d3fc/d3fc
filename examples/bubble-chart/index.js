d3.json('health-wealth.json').then(data => {
    // convert string properties to numbers
    data.forEach(d => {
        d.income = Number(d.income);
        d.population = Number(d.population);
        d.lifeExpectancy = Number(d.lifeExpectancy);
    });

    const regions = d3.set(data.map(d => d.region));
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(regions.values());

    const legend = d3.legendColor().scale(color);

    const size = d3
        .scaleLinear()
        .range([20, 800])
        .domain(fc.extentLinear().accessors([d => d.population])(data));

    const pointSeries = fc
        .seriesSvgPoint()
        .crossValue(d => d.income)
        .mainValue(d => d.lifeExpectancy)
        .size(d => size(d.population))
        .decorate(sel => {
            sel.enter().attr('fill', d => color(d.region));
        });

    const chart = fc
        .chartCartesian(d3.scaleLog(), d3.scaleLinear())
        .xDomain(fc.extentLinear().accessors([d => d.income])(data))
        .yDomain(fc.extentLinear().accessors([d => d.lifeExpectancy])(data))
        .chartLabel('The Wealth & Health of Nations')
        .xLabel('Income (dollars)')
        .yLabel('Life expectancy (years)')
        .xTicks(2, d3.format(',d'))
        .yOrient('left')
        .svgPlotArea(pointSeries)
        .decorate(selection => {
            // append an svg for the d3-legend
            selection
                .enter()
                .append('d3fc-svg')
                .attr('class', 'legend');

            // render the legend
            selection
                .select('.legend')
                .select('svg')
                .call(legend);
        });

    d3.select('#bubble-chart')
        // remove the loading text from the container
        .text(null)
        .datum(data)
        .call(chart);
});
