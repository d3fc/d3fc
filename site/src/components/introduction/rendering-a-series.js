// a random number generator
var generator = fc.data.random.walk()
    .steps(11);

// some formaters
var valueformatter = d3.format('$f');
var dateFormatter = d3.time.format('%b');

// randomly generated sales data
var data = generator(5).map(function(d, i) {
    return {
        month: dateFormatter(new Date(0, i + 1, 0)),
        sales: d + i / 2
    };
});

//START
// create an svg
var width = 500, height = 250;
var container = d3.select('#rendered-series')
    .append('svg')
    .attr({'width': width, 'height': height});

// create the scales
var xScale = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.month; }))
    .rangePoints([0, width], 1);

var yScale = d3.scale.linear()
    .domain([0, 20])
    .range([height, 0]);

// create a series
var series = fc.series.bar()
    .xValue(function(d) { return d.month; })
    .yValue(function(d) { return d.sales; })
    .xScale(xScale)
    .yScale(yScale);

// render
container
    .datum(data)
    .call(series);
//END
