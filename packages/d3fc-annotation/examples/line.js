var width = 500;
var height = 250;

var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width - 30]);

var yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height - 20]);

var horizontalLine = fc.annotationLine()
  .label(function(d) { return d.toFixed(2); })
  .xScale(xScale)
  .yScale(yScale);

var verticalLine = fc.annotationLine()
  .label(function(d) { return d.toFixed(2); })
  .orient('vertical')
  .xScale(xScale)
  .yScale(yScale);

var data = [0.1, 0.2, 0.4, 0.8];
var t0 = Date.now();

function wavify(d, i, a) {
    var t = Date.now() - t0;
    return d * Math.abs(Math.sin((i + 1) * t / 1e4 + i * Math.PI / a.length)) + 0.1;
}

function render() {
    var svg = d3.select('svg')
      .datum(data.map(wavify));
    svg.select('.horizontal')
      .call(horizontalLine);
    svg.select('.vertical')
      .call(verticalLine);
    requestAnimationFrame(render);
}

render();
