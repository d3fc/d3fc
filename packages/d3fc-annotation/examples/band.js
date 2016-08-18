var width = 500;
var height = 250;

var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width - 30]);

var yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height - 20]);

var horizontalBand = fc.annotationBand()
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d, i) { return d - (i + 1) * 0.025; })
  .toValue(function(d) { return d; });

var verticalBand = fc.annotationBand()
  .orient('vertical')
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d, i) { return d - (i + 1) * 0.025; })
  .toValue(function(d) { return d; });

var data = [0.1, 0.2, 0.4, 0.8];
var t0 = Date.now();

function wavify(d, i, a) {
    var t = Date.now() - t0;
    var value = d * Math.abs(Math.sin((i + 1) * t / 1e4 + i * Math.PI / a.length)) + 0.1;
    return value.toFixed(3);
}

function render() {
    var svg = d3.select('svg')
      .datum(data.map(wavify));
    svg.select('.horizontal')
      .call(horizontalBand);
    svg.select('.vertical')
      .call(verticalBand);
    requestAnimationFrame(render);
}

render();
