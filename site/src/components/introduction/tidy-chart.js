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

var yExtent = fc.util.extent()
    .include(0)
    .pad([0, 0.5])
    .fields('sales');

//START
var chart = fc.chart.cartesian(
        d3.scale.ordinal(),
        d3.scale.linear())
    .chartLabel('2015 Cummulative Sales')
    .margin({top: 30, right: 45, bottom: 40})
    .xDomain(data.map(function(d) { return d.month; }))
    .yDomain(yExtent(data))
    .yTicks(5)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();
//END

var series = fc.series.bar()
    .xValue(function(d) { return d.month; })
    .yValue(function(d) { return d.sales; });

chart.plotArea(series);

d3.select('#tidied-chart')
    .datum(data)
    .call(chart);
