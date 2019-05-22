d3.json('https://d3fc.io/examples/bubble/data.json').then(function(data) {
  // convert string properties to numbers
  data.forEach(function(d) {
    d.income = Number(d.income);
    d.population = Number(d.population);
    d.lifeExpectancy = Number(d.lifeExpectancy);
  });

  var regions = d3.set(data.map(function(d) { return d.region; }));
  var color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(regions.values());

  var legend = d3.legendColor()
    .scale(color);

  var size = d3.scaleLinear().range([20, 800])
    .domain(fc.extentLinear()
    .accessors([function(d) { return d.population; }])(data));

  var pointSeries = fc.seriesSvgPoint()
      .crossValue(function(d) { return d.income; })
      .mainValue(function(d) { return d.lifeExpectancy; })
      .size(function(d) { return size(d.population); })
      .decorate(function(sel) {
        sel.enter()
            .attr('fill', function(d) { return color(d.region); });
      });

  var chart = fc.chartCartesian(
                d3.scaleLog(),
                d3.scaleLinear()
              )
      .xDomain(fc.extentLinear()
        .accessors([function(d) { return d.income; }])(data))
      .yDomain(fc.extentLinear()
        .accessors([function(d) { return d.lifeExpectancy; }])(data))
      .chartLabel('The Wealth & Health of Nations')
      .xLabel('Income (dollars)')
      .yLabel('Life expectancy (years)')
      .xTicks(2, d3.format(',d'))
      .yOrient('left')
      .svgPlotArea(pointSeries)
      .decorate(function(selection) {
        // append an svg for the d3-legend
        selection.enter()
          .append('svg')
          .attr('class', 'legend');

        // render the legend
        selection.select('.legend')
          .call(legend);
      });

  d3.select('#bubble-chart')
      // remove the loading text from the container
      .text(null)
      .datum(data)
      .call(chart);
});
