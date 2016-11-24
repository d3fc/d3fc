d3.csv('https://d3fc.io/examples/stacked/data.csv', function(_, data) {

  // manipulate the data into stacked series
  var stack = d3.stack().keys(Object.keys(data[0]).filter(function(k) { return k !== 'Country'; }));
  var series = stack(data);

  var color = d3.scaleOrdinal(d3.schemeCategory20)
    .domain(series.map(function(s) {
      return s.key;
    }));

  var legend = d3.legendColor()
    .shapeWidth(80)
    .orient('horizontal')
    .scale(color);

  var barSeries = fc.seriesSvgBar()
    .orient('horizontal')
    .crossValue(function(d) { return d.data.Country; })
    .mainValue(function(d) { return d[1]; })
    .baseValue(function(d) { return d[0]; });

  var multi = fc.seriesSvgMulti()
    .mapping(function(data, series, index) { return data[index]; })
    .series(series.map(function() { return barSeries; }))
    .decorate(function(selection) {
      selection.each(function(data, index, nodes) {
        d3.select(this).selectAll('g.bar').attr('fill', color(series[index].key));
      });
    });

  var xExtent = fc.extentLinear()
    .accessors([function(a) {
      return a.map(function(d) { return d[1]; });
    }])
    .pad([0, 1])
    .padUnit('domain');

  var yScale = d3.scalePoint().padding([0.5]);

  var chart = fc.chartSvgCartesian(
      d3.scaleLinear(),
      yScale)
    .xDomain(xExtent(series))
    .yDomain(data.map(function(entry) {
      return entry.Country;
    }))
    .yOrient('left')
    .xLabel('Million tonnes of oil equivalent')
    .chartLabel('2013 Energy Production')
    .plotArea(multi)
    .decorate(function(selection, data, index) {
      // append an svg for the d3-legend
      selection.enter()
        .append('svg')
        .attr('class', 'legend');

      // render the legend
      selection.select('svg.legend')
        .call(legend);
    });

  d3.select('#stacked-chart')
    .text(null) // Remove the loading text from the container
    .datum(series)
    .call(chart);

});
