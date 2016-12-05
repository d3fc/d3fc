// create some test data
var data = d3.range(10000).map(function(d) {
  return {
    x: Math.random(),
    y: Math.random()
  };
});

var x = d3.scaleLinear();
var y = d3.scaleLinear();

// secondary scales for the purposes of computing the zoom
var x2 = d3.scaleLinear();
var y2 = d3.scaleLinear();

var area = fc.seriesCanvasPoint()
  .crossValue(function(d) { return d.x; })
  .mainValue(function(d) { return d.y; })
  .size(4);

// create a d3-zoom that handles the mouse / touch interactions
var zoom = d3.zoom()
  .on('zoom', function() {
    // update the scale used by the chart to use the udpated domain
    x.domain(d3.event.transform.rescaleX(x2).domain());
    y.domain(d3.event.transform.rescaleY(y2).domain());
    render();
  });

// the chart!
var chart = fc.chartCanvasCartesian(x, y)
  .chartLabel('Canvas Zoom 10,000 Points')
  .plotArea(area)
  .decorate((sel) => {
    // add the zoom interaction on the enter selection
    // NOTE: there is a much better zoom integration being developed
    // for d3fc!!!
    sel.enter()
      .select('.plot-area')
      .on('measure.range', () => {
        x2.range([0, d3.event.detail.width]);
        y2.range([d3.event.detail.height, 0]);
      })
      .call(zoom);
  });

function render() {
  d3.select('#zoom-chart')
    .datum(data)
    .call(chart);
}

render();
