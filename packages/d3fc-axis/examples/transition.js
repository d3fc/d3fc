var alphabet = 'abcdefghijkl'.split('');

var scale = d3.scaleLinear()
  .range([0, 800]);

var ordinalScale = d3.scaleBand()
  .range([0, 800]);

var d3Axis = d3.axisBottom(scale);
var fcAxis = fc.axisBottom(scale);

var d3OrdinalAxis = d3.axisBottom(ordinalScale);
var fcOrdinalAxis = d3.axisBottom(ordinalScale);

function transition(selection) {
    return selection.transition()
      .duration(1000)
      .ease(d3.easeLinear);
}

function render() {
    scale.domain([0, Math.random() * 200]);
    ordinalScale.domain(alphabet.filter(function() { return Math.random() < 0.8; }));

    transition(d3.select('#d3-axis')).call(d3Axis);
    transition(d3.select('#d3-axis-ordinal')).call(d3OrdinalAxis);
    transition(d3.select('#fc-axis')).call(fcAxis);
    transition(d3.select('#fc-axis-ordinal')).call(fcOrdinalAxis);
}

render();
setInterval(render, 1100);
