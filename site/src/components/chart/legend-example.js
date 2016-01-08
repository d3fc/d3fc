// create a scale
var color = d3.scale.category10()
  .domain(['Cat', 'Dog', 'Fish']);

// construct a legend for this scale
var legend = d3.legend.color()
  .scale(color);

// create a container
var legendContainer = fc.tool.container()
    .padding(5)
    .component(legend);

// create an SVG container
var width = 60, height = 60;
var svg = d3.select('#legend')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// render
svg.call(legendContainer);
