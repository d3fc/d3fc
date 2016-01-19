// create an SVG container
var width = 400, height = 200;
var svg = d3.select('#rectangles-bb')
    .append('svg')
    .attr({width: width, height: height});

// a very simple example component
function label(selection) {
    selection.append('circle')
        .attr('cx', function(d) {
            return d.anchor[0];
        })
        .attr('cy', function(d) {
            return d.anchor[1];
        })
        .attr('r', 5);
    selection.append('rect')
        .layout('flex', 1);
    selection.append('text')
        .text(function(d) { return d.data; })
        .attr({x: 20, y: 18});
    selection.layout();
}


//START
var strategy = fc.layout.strategy.boundingBox()
    .containerWidth(width)
    .containerHeight(height);
//END

// the labels data
var data = [
    { x: 100, y: 20, data: 'Hello'},
    { x: 170, y: 40, data: 'World'}, // overlaps with hello
    { x: 150, y: 65, data: 'd3fc'},  // overlaps with world
    { x: 250, y: 175, data: 'rocks'} // leaves the container
];

// create scales that span the width / height of the SVG
var xScale = d3.scale.linear()
    .range([0, width]);
var yScale = d3.scale.linear()
    .range([height, 0]);

// create the layout
var layout = fc.layout.rectangles(strategy)
    .xScale(xScale)
    .yScale(yScale)
    .size([80, 30])
    .position([function(d) { return d.x; }, function(d) { return d.y; }])
    .anchor(function(d, i, pos) { d.anchor = pos; })
    .component(label);

// bind the data and render
svg.datum(data)
    .call(layout);
