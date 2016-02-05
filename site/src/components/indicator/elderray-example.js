var width = 500, height = 250;
var container = d3.select('#elder')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .range([0, width]);

//START
// Create and apply the elder ray algorithm
var elderRayAlgorithm = fc.indicator.algorithm.elderRay()
    .period(6);
elderRayAlgorithm(data);

// the elder ray is rendered on its own scale
var yDomain = fc.util.extent()
  .fields([function(d) { return d.elderRay.bullPower;}, function(d) { return d.elderRay.bearPower; }])
  .symmetricalAbout(0)
  .pad(0.1);

var yScale = d3.scale.linear()
    .domain(yDomain(data))
    .range([height, 0]);

// Create the renderer
var elderRay = fc.indicator.renderer.elderRay()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(elderRay);
//END
