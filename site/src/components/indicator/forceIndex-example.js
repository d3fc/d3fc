var width = 500, height = 250;
var container = d3.select('#force-index')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields(['date'])(data))
    .range([0, width]);


//START
// Create and apply the Force Index algorithm
var forceAlgorithm = fc.indicator.algorithm.forceIndex();
forceAlgorithm(data);

//Scaling the display using the maximum absolute value of the Index
var yDomain = fc.util.extent()
    .fields([function(d) { return d.force; }])
    .symmetricalAbout(0);

var yScale = d3.scale.linear()
    .domain(yDomain(data))
    .range([height, 0]).nice();

// Create the renderer
var force = fc.indicator.renderer.forceIndex()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(force);
//END
