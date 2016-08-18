var width = 500;

var xScale = d3.scaleLinear()
  .range([0, width - 100]);

var yScale = d3.scaleLinear()
  .range([0, 200]);

var crosshair = fc.annotationCrosshair()
  .xScale(xScale)
  .yScale(yScale);

var data = [{ x: 300, y: 60 }, { x: 100, y: 100 }, { x: 200, y: 180 }, { x: 20, y: 30 }];

function render() {
    d3.select('svg')
      .datum(data)
      .call(crosshair);
    requestAnimationFrame(render);
}

render();
