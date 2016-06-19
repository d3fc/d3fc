var walk = fc.data.random.walk()
  .period(2)
  .steps(30)
  .mu(0.3)
  .sigma(0.2);

var data = walk(50)
  .map(function(d, i) {
      return { x: i, y: d };
  });

var xExtent = fc.util.extent()
    .fields([
        function(d) { return d.x; }
    ]);

var yExtent = fc.util.extent()
    .fields([
        function(d) { return d.y; }
    ])
    .pad(0.2);

var chart = fc.chart.cartesian(
        d3.scale.linear(),
        d3.scale.linear()
    )
    .xTicks(5)
    .yTicks(5)
   .xDomain(xExtent(data))
   .yDomain(yExtent(data))
   .yNice()
   .chartLabel('Area Line Point')
   .margin({left: 30, right: 50, bottom: 20, top: 30});

var gridlines = fc.annotation.gridline()
    .xTicks(5)
    .yTicks(5);

var area = fc.series.area()
    .interpolate('cardinal')
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

var line = fc.series.line()
    .interpolate('cardinal')
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

var point = fc.series.point()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; })
    .decorate(function(g) {
        g.enter()
            .select('path');
        g.enter()
            .append('rect')
            .attr({
                x: -30,
                y: -30,
                width: 60,
                height: 20
            });
        g.enter()
            .append('text')
            .attr({
                'text-anchor': 'middle',
                'transform': 'translate(0, -15)'
            });
        g.select('text')
            .text(function(d) {
                return d.y.toFixed(2);
            });
    });

var areaLinePointMulti = fc.series.multi()
    .series([area, line, point])
    .mapping(function(series) {
        switch (series) {
        case point:
            return this.filter(function(d) {
                return d.x % 10 === 5;
            });
        default:
            return this;
        }
    });

var plotArea = fc.series.multi()
    .series([gridlines, areaLinePointMulti]);

chart.plotArea(plotArea);

d3.select('#area-line-point')
    .datum(data)
    .call(chart);
