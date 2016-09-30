var width = 500, height = 250;
var container = d3.select('#gridlines')
    .append('svg')
    .attr({'width': width, 'height': height});

// START
var xScale = d3.scale.linear()
    .domain([0, 50])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);

var gridlines = fc.annotation.gridline()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .call(gridlines);
// END
