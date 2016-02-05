var width = 500, height = 250;
var container = d3.select('#stochastic')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .range([0, width]);

//START
// Create and apply the stochastic oscillator algorithm
var stochasticAlgorithm = fc.indicator.algorithm.stochasticOscillator()
    .kWindowSize(14);
stochasticAlgorithm(data);

// the stochastic oscillator is rendered on its own scale
var yScale = d3.scale.linear()
    .domain([0, 100])
    .range([height - 5, 5]);

// Create the renderer
var stochastic = fc.indicator.renderer.stochasticOscillator()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(stochastic);
//END
