var width = 500;

var xScale = d3.scaleLinear()
  .range([0, width - 100]);

var line = fc.annotationBand()
  .xScale(xScale)
  .fromValue(function(d, i) { return d - (i + 1) * 10; })
  .toValue(function(d) { return d; });

var data = [20, 40, 80, 160];

function wavify(d, i, a) {
    return d * Math.abs(Math.sin((i + 1) * Date.now() / 1e4 + i * Math.PI / a.length)) + 40;
}

function render() {
    d3.select('svg')
        .datum(data.map(wavify))
        .call(line);
    requestAnimationFrame(render);
}

render();
