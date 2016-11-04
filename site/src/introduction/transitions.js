// generate some random data
var data = d3.range(40).map(Math.random);

// render a bar series via the cartesian chart component
var barSeries = fc.series.bar()
    .key(fc.util.fn.identity)
    .xValue(fc.util.fn.index)
    .yValue(fc.util.fn.identity);

var chart = fc.chart.cartesian(
              d3.scale.linear(),
              d3.scale.linear())
    .xDomain([-1, data.length])
    .margin({top: 10, bottom: 10, right: 30})
    .plotArea(barSeries);

var index = 0;
function render() {
  if (index === data.length) {
    return; // we're all done!
  }

    // perform a single iteration of the bubble sort
  var temp;
  for (var j = index; j > 0; j--) {
    if (data[j] < data[j - 1]) {
      temp = data[j];
      data[j] = data[j - 1];
      data[j - 1] = temp;
    }
  }
  index++;

    // re-render the chart
  d3.select('#transitions-chart')
        .datum(data)
        .transition()
        .duration(500)
        .call(chart);
}

setInterval(render, 1000);
render();
