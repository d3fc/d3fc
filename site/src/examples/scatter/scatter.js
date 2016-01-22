d3.tsv('https://d3fc.io/examples/scatter/data.tsv', function(error, data) {
    // convert string properties to numbers
    data.forEach(function(d) {
        d.sepalLength = Number(d.sepalLength);
        d.sepalWidth = Number(d.sepalWidth);
    });

    var species = d3.set(data.map(function(d) { return d.species; }));
    var color = d3.scale.category10()
        .domain(species.values());

    var legend = d3.legend.color().scale(color);

    var pointSeries = fc.series.point()
        .xValue(function(d) { return d.sepalWidth; })
        .yValue(function(d) { return d.sepalLength; })
        .decorate(function(sel) {
            sel.enter()
                .attr('fill', function(d) { return color(d.species); });
        });

    var chart = fc.chart.cartesian(
                  d3.scale.linear(),
                  d3.scale.linear())
        .yDomain(fc.util.extent().pad(0.2).fields('sepalLength')(data))
        .xDomain(fc.util.extent().pad(0.2).fields('sepalWidth')(data))
        .xLabel('Sepal Width (cm)')
        .yLabel('Sepal Length (cm)')
        .yOrient('left')
        .margin({left: 50, bottom: 50})
        .plotArea(pointSeries)
        .decorate(function(selection) {
            selection.enter()
                .append('g')
                .layout({
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    width: 80,
                    height: 50
                })
                .call(legend);

            // compute layout from the parent SVG
            selection.enter().layout();
        });

    d3.select('#scatter-chart')
        .datum(data)
        .call(chart);
});
