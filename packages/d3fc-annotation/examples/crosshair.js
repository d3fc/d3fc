var width = 500;
var height = 250;

var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width - 30]);

var yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height - 20]);

var crosshair = fc.annotationCrosshair()
  .xScale(xScale)
  .yScale(yScale);

var data = [{ x: 350, y: 60 }, { x: 100, y: 120 }, { x: 200, y: 180 }, { x: 20, y: 30 }];

function render() {
    d3.select('svg')
      .datum(data)
      .call(crosshair);
    requestAnimationFrame(render);
}

render();
