var width = 500, height = 250;
var container = d3.select('#stacked')
    .append('svg')
    .attr({'width': width, 'height': height});

//START
var data = [
   {'State':'AL','Under 5 Years':'310','5 to 13 Years':'552','14 to 17 Years':'259','18 to 24 Years':'450','25 to 44 Years':'1215','45 to 64 Years':'641'},
   {'State':'AK','Under 5 Years':'52','5 to 13 Years':'85','14 to 17 Years':'42','18 to 24 Years':'74','25 to 44 Years':'183','45 to 64 Years':'50'},
   {'State':'AZ','Under 5 Years':'515','5 to 13 Years':'828','14 to 17 Years':'362','18 to 24 Years':'601','25 to 44 Years':'1804','45 to 64 Years':'1523'},
   {'State':'AR','Under 5 Years':'202','5 to 13 Years':'343','14 to 17 Years':'157','18 to 24 Years':'264','25 to 44 Years':'754','45 to 64 Years':'727'},
   {'State':'CO','Under 5 Years':'358','5 to 13 Years':'587','14 to 17 Years':'261','18 to 24 Years':'466','25 to 44 Years':'1464','45 to 64 Years':'1290'},
   {'State':'CT','Under 5 Years':'211','5 to 13 Years':'403','14 to 17 Years':'196','18 to 24 Years':'325','25 to 44 Years':'916','45 to 64 Years':'968'},
   {'State':'DE','Under 5 Years':'59','5 to 13 Years':'99','14 to 17 Years':'47','18 to 24 Years':'84','25 to 44 Years':'230','45 to 64 Years':'230'}
];

// manipulate the data into stacked series
var spread = fc.data.spread()
    .xValueKey('State');
var stackLayout = d3.layout.stack()
    .values(function(d) { return d.values; });

var series = stackLayout(spread(data));

// create scales
var x = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.State; }))
    .rangePoints([0, width], 1);

var yExtent = fc.util.extent()
    .include(0)
    .fields(function(d) { return d.y + d.y0; });

var y = d3.scale.linear()
    .domain(yExtent(series.map(function(d) { return d.values; })))
    .range([height, 0]);

// create the stacked bar series (this could also be line or area)
var stack = fc.series.stacked.bar()
    .xScale(x)
    .yScale(y)
    .xValue(function(d) { return d.x; });

// render
container.append('g')
    .datum(series)
    .call(stack);
//END
