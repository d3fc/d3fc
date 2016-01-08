var width = 500, height = 250;
var container = d3.select('#band')
    .append('svg')
    .attr({'width': width, 'height': height});

var xScale = d3.scale.linear()
    .domain([0, 50])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);

//START
// create a vertical banc annotation
var verticalBand = fc.annotation.band()
    .xScale(xScale)
    .yScale(yScale)
    .x0(function(d) { return d.start; })
    .x1(function(d) { return d.end; });

// data used by the vertical bands
var xBands = [
    { start: 2, end: 15 },
    { start: 25, end: 30 },
    { start: 35, end: 45 }
];

container.append('g')
    .datum(xBands)
    .call(verticalBand);

// create a horizontalband annotation
var horizontalBand = fc.annotation.band()
    .xScale(xScale)
    .yScale(yScale)
    .y0(function(d) { return d[0]; })
    .y1(function(d) { return d[1]; });

// in this case create bands based on the scale ticks
var ticks = yScale.ticks();
var yBands = d3.pairs(ticks)
      .filter(function(d, i) { return i % 2 === 0; });

container.append('g')
    .datum(yBands)
    .call(horizontalBand);
//END
