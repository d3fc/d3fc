d3.json('https://d3fc.io/examples/bubble/data.json', function(error, data) {
    // convert string properties to numbers
    data.forEach(function(d) {
        d.income = Number(d.income);
        d.population = Number(d.population);
        d.lifeExpectancy = Number(d.lifeExpectancy);
    });

    var regions = d3.set(data.map(function(d) { return d.region; }));
    var color = d3.scale.category10()
        .domain(regions.values());

    var legend = d3.legend.color()
        .scale(color);

    var size = d3.scale.linear()
        .range([20, 800])
        .domain(fc.util.extent().fields(['population'])(data));

    var pointSeries = fc.series.point()
        .xValue(function(d) { return d.income; })
        .yValue(function(d) { return d.lifeExpectancy; })
        .size(function(d) { return size(d.population); })
        .decorate(function(sel) {
            sel.enter()
                .attr('fill', function(d) { return color(d.region); });
        });

    var chart = fc.chart.cartesian(
                  d3.scale.log(),
                  d3.scale.linear())
        .xDomain(fc.util.extent().fields(['income'])(data))
        .yDomain(fc.util.extent().pad(0.2).fields(['lifeExpectancy'])(data))
        .xLabel('Income (dollars)')
        .yLabel('Life expectancy (years)')
        .xTicks(2, d3.format(',d'))
        .chartLabel('The Wealth & Health of Nations')
        .yOrient('left')
        .margin({left: 40, bottom: 40, top: 30})
        .plotArea(pointSeries)
        .decorate(function(selection) {
            selection.enter()
                .append('g')
                .classed('legend-container', true)
                .layout({
                    position: 'absolute',
                    right: 10,
                    bottom: 50,
                    width: 165,
                    height: 100
                });

            // compute layout from the parent SVG
            selection.enter().layout();

            // render the legend
            selection.select('g.legend-container').call(legend);
        });

    d3.select('#bubble-chart')
        .datum(data)
        .call(chart);
});
