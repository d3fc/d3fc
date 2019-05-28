var data = [
  // 4
  {x: 1, y: 6, type: 4},
  {x: 1, y: 9, type: 4},
  {x: 2, y: 6, type: 4},
  {x: 3, y: 9, type: 4},
  {x: 3, y: 6, type: 4},
  {x: 3, y: 3, type: 4},
  // 0
  {x: 5, y: 3, type: 0},
  {x: 5, y: 6, type: 0},
  {x: 5, y: 9, type: 0},
  {x: 6, y: 3, type: 0},
  {x: 6, y: 9, type: 0},
  {x: 7, y: 3, type: 0},
  {x: 7, y: 6, type: 0},
  {x: 7, y: 9, type: 0},
  // 4
  {x: 9, y: 6, type: 4},
  {x: 9, y: 9, type: 4},
  {x: 10, y: 6, type: 4},
  {x: 11, y: 9, type: 4},
  {x: 11, y: 6, type: 4},
  {x: 11, y: 3, type: 4}
];

var regions = d3.set(data.map(function(d) { return d.type; }));
var color = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(regions.values());

var legend = d3.legendColor().scale(color);

var pointSeries = fc.seriesSvgPoint()
    .crossValue(function(d) { return d.x; })
    .mainValue(function(d) { return d.y; })
    .size(function() { return $('#chart-404').width() <= 768 ? 500 : 2500; })
    .decorate(function(sel) {
      sel.enter()
          .attr('fill', function(d) { return color(d.type); });
    });

var chart = fc.chartCartesian(
              d3.scaleLinear(),
              d3.scaleLinear()
            )
    .xDomain([0, 13])
    .yDomain([0, 13])
    .yOrient('left')
    .svgPlotArea(pointSeries);

d3.select('#chart-404')
    .datum(data)
    .call(chart);
