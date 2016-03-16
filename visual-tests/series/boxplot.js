(function(d3, fc) {
    'use strict';

    var data = d3.range(0, 10)
        .map(function(d) {
            var median = 10 + Math.random(),
                upperQuartile = median + Math.random(),
                lowerQuartile = median - Math.random(),
                high = upperQuartile + Math.random(),
                low = lowerQuartile - Math.random();
            return {
                median: median,
                upperQuartile: upperQuartile,
                lowerQuartile: lowerQuartile,
                high: high,
                low: low,
                value: d
            };
        });

    var xScale = d3.scale.linear()
      .domain([0, 9]);

    var yScale = d3.scale.linear()
      .domain(fc.util.extent().pad(0.2).fields(['low', 'high'])(data));

    var boxPlot = fc.series.boxPlot()
        .cap(0.5)
        .value(function(d) { return d.value; })
        .median(function(d) { return d.median; })
        .lowerQuartile(function(d) { return d.lowerQuartile; })
        .upperQuartile(function(d) { return d.upperQuartile; })
        .low(function(d) { return d.low; })
        .high(function(d) { return d.high; });

    function render() {

        var chart = fc.chart.cartesian(xScale, yScale)
              .plotArea(boxPlot);

        d3.select('#boxplot')
          .on('click', function() {
              var tempScale = xScale;
              xScale = yScale;
              yScale = tempScale;
              boxPlot.orient(boxPlot.orient() === 'vertical' ? 'horizontal' : 'vertical');
              render();
          })
          .datum(data)
          .call(chart);
    }
    render();
})(d3, fc);
