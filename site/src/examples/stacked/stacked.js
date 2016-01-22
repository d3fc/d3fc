d3.csv('https://d3fc.io/examples/stacked/data.csv', function(error, data) {
    // manipulate the data into stacked series
    var spread = fc.data.spread()
        .xValueKey('Country');
    var stackLayout = d3.layout.stack()
        .values(function(d) { return d.values; });

    var series = stackLayout(spread(data));

    var color = d3.scale.category20()
      .domain(series.map(function(s) { return s.key; }));

    var yExtent = fc.util.extent()
        .include(0)
        .fields(function(d) { return d.y + d.y0; });

    var legend = d3.legend.color()
      .orient('horizontal')
      .shapeWidth(70)
      .scale(color);

    var stack = fc.series.stacked.bar()
        .orient('horizontal')
        .yValue(function(d) { return d.x; })
        .xValue(function(d) { return d.y0 + d.y; })
        .x0Value(function(d) { return d.y0; })
        .decorate(function(sel, _, index) {
            sel.enter().attr('fill', color(series[index].key));
        });

    var chart = fc.chart.cartesian(
                      d3.scale.linear(),
                      d3.scale.ordinal())
            .xDomain(yExtent(series.map(function(d) { return d.values; })))
            .yDomain(data.map(function(d) { return d.Country; }))
            .xLabel('(million tonnes of oil equivalent)')
            .xNice()
            .chartLabel('2013 Energy Production')
            .yOrient('left')
            .yTickSize(0)
            .margin({left: 100, bottom: 40, right: 10, top: 30})
            .plotArea(stack)
            .decorate(function(selection) {
                // add a container for the legend
                selection.enter()
                    .append('g')
                    .classed('legend-container', true)
                    .layout({
                        position: 'absolute',
                        right: 10,
                        top: 40,
                        width: 358,
                        height: 36
                    });

                // compute layout from the parent SVG
                selection.enter().layout();

                // render the legend
                selection.select('g.legend-container')
                  .style('display', function() {
                      // magic number because the legend accessors return
                      // the legend itself instead of the values (susielu/d3-legend#23)
                      var availableWidth = selection.select('.plot-area').layout('width');
                      return availableWidth > (75 + 5) * data.length ? '' : 'none';
                  })
                  .call(legend);
            });

    // render
    d3.select('#stacked-chart')
        .datum(series)
        .call(chart);
});
