// see: http://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6

// create some test data
var random = d3.randomNormal(0, 0.2);
var sqrt3 = Math.sqrt(3);
var points0 = d3.range(300).map(function() { return [random() + sqrt3, random() + 1, 0]; });
var points1 = d3.range(300).map(function() { return [random() - sqrt3, random() + 1, 1]; });
var points2 = d3.range(300).map(function() { return [random(), random() - 1, 2]; });
var data = d3.merge([points0, points1, points2]);

var yExtent = fc.extentLinear()
    .accessors([function(d) { return d[1]; }])
    .pad([0.1, 0.1]);

var xExtent = fc.extentLinear()
    .accessors([function(d) { return d[0]; }])
    .pad([0.1, 0.1]);

var x = d3.scaleLinear()
    .domain(xExtent(data));
var y = d3.scaleLinear()
    .domain(yExtent(data));
var color = d3.scaleOrdinal(d3.schemeCategory10);

var pointSeries = fc.seriesSvgPoint()
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .size(15)
    .decorate(function(selection) {
        selection.enter()
          .style('fill', function(d) { return color(d[2]); });
    });

var idleTimeout;
var idleDelay = 350;

function idled() {
    idleTimeout = null;
}

var brush = fc.brush()
    .on('end', function(evt) {
        if (!evt.selection) {
            if (!idleTimeout) {
                // detect double clicks
                idleTimeout = setTimeout(idled, idleDelay);
            } else {
                x.domain(xExtent(data));
                y.domain(yExtent(data));
                render();
            }
        } else {
            x.domain(evt.xDomain);
            y.domain(evt.yDomain);
            render();
        }
    });

var multi = fc.seriesSvgMulti()
    .series([pointSeries, brush])
    .mapping((data, index, series) => {
        switch (series[index]) {
        case pointSeries:
            return data;
        case brush:
            // the brush is transient, so always has null data
            return null;
        }
    });

var mainChart = fc.chartCartesian(x, y)
  .svgPlotArea(multi);

function render() {
    d3.select('#main-chart')
        .datum(data)
        .transition()
        .call(mainChart);
}

render();
