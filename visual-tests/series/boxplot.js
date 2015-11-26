(function(d3, fc) {
    'use strict';

    var data = d3.range(0, 10)
      .map(function(d) {
          var y = 10 + Math.random(),
              boxHigh = y + Math.random(),
              boxLow = y - Math.random(),
              whiskerHigh = boxHigh + Math.random(),
              whiskerLow = boxLow - Math.random();
          return {
              x: d,
              y: y,
              boxHigh: boxHigh,
              boxLow: boxLow,
              whiskerHigh: whiskerHigh,
              whiskerLow: whiskerLow
          };
      });

    var width = 600, height = 250;

    var boxPlot = fc.series.boxPlot()
        .xValue(function(d) { return d.x; })
        .yValue(function(d) { return d.y; })
        .boxLow(function(d) { return d.boxLow; })
        .boxHigh(function(d) { return d.boxHigh; })
        .whiskerLow(function(d) { return d.whiskerLow; })
        .whiskerHigh(function(d) { return d.whiskerHigh; });

    var chart = fc.chart.cartesian(
              d3.scale.linear(),
              d3.scale.linear())
          .xDomain([-1, 11])
          .yDomain(fc.util.extent().pad(0.2).fields(['whiskerLow', 'whiskerHigh'])(data))
          .plotArea(boxPlot);

    d3.select('#boxplot').datum(data).call(chart);
})(d3, fc);
