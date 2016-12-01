// create some test data
var generator = fc.randomGeometricBrownianMotion()
    .steps(1000);
var data = generator(10);

var yExtent = fc.extentLinear()
  .pad([0.1, 0.1]);

// create the scales
var x = d3.scaleLinear()
  .domain([0, data.length]);
var y = d3.scaleLinear()
  .domain(yExtent(data));

// a secondary x-scale, which is always set to the full domain
// extent, for the purposes of computing the zoom
var x2 = x.copy();

// create the various series
var area = fc.seriesSvgArea()
  .crossValue(function(d, i) { return i; })
  .mainValue(function(d) { return d; })
  .decorate(function(selection) {
    selection.enter()
      .style('fill', 'lightgreen')
      .style('fill-opacity', 0.5);
  });

var gridlines = fc.annotationSvgGridline();

var multi = fc.seriesSvgMulti()
  .series([gridlines, area]);

// create a d3-zoom that handles the mouse / touch interactions
var zoom = d3.zoom()
  .on('zoom', function() {
    // use the rescaleX utility function to compute the new scale
    var rescaled = d3.event.transform.rescaleX(x2);
    // update the x scale used by the chart to use the udpated domain
    x.domain(rescaled.domain());
    render();
  });

// the chart!
var chart = fc.chartSvgCartesian(x, y)
  .chartLabel('d3-zoom integration example')
  .plotArea(multi)
  .decorate((sel) => {
    // add the zoom interaction on the enter selection
    sel.enter()
      .select('.plot-area')
      .on('measure.range', () => {
        x2.range([0, d3.event.detail.width]);
      })
      .call(zoom)
      // initialise the zoom at x10
      .call(zoom.transform, d3.zoomIdentity.scale(10));
  });

function render() {
  // update the y-domain based on the visible range
  var visibleRange = data.slice(
    Math.max(0, x.domain()[0]),
    Math.min(x.domain()[1], data.length)
  );
  y.domain(yExtent(visibleRange));

  // render the chart!
  d3.select('#zoom-chart')
    .datum(data)
    .call(chart);
}

render();
