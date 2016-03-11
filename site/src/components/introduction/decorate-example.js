// a random number generator
var generator = fc.data.random.walk()
    .steps(11);

var valueformatter = d3.format('$f');
var dateFormatter = d3.time.format('%b');

// create the data
var data = {
    // target values for the annotations
    targets: [{
        name: 'low',
        value: 4.5
    }, {
        name: 'high',
        value: 7.2
    }],
    // randomly generated sales data
    sales: generator(1).map(function(d, i) {
        return {
            month: dateFormatter(new Date(0, i + 1, 0)),
            sales: d + i / 2
        };
    })
};

var yExtent = fc.util.extent()
    .include(0)
    .pad([0, 0.5])
    .fields(['sales']);

var chart = fc.chart.cartesian(
        d3.scale.ordinal(),
        d3.scale.linear())
    .chartLabel('2015 Cumulative Sales')
    .margin({top: 30, right: 45, bottom: 40})
    .xDomain(data.sales.map(function(d) { return d.month; }))
    .yDomain(yExtent(data.sales))
    .yTicks(5)
    .yTickFormat(valueformatter)
    .yLabel('Sales (millions)')
    .yNice();

//START
var bar = fc.series.bar()
    .xValue(function(d) { return d.month; })
    .yValue(function(d) { return d.sales; })
    .decorate(function(selection) {
        // The selection passed to decorate is the one which the component creates within its internal data join,
        // here we use the update selection to apply a style to 'path' elements created by the bar series
        selection.select('.bar > path')
            .style('fill', function(d) {
                return d.sales < data.targets[0].value ? 'inherit' : '#0c0';
            });
    });
//END

var annotation = fc.annotation.line()
    .value(function(d) { return d.value; })
    .decorate(function(selection) {
        selection.enter()
            .select('g.left-handle')
            .append('text')
            .attr({x: 5, y: -5});
        selection.select('g.left-handle text')
            .text(function(d) {
                return d.name + ' - ' + valueformatter(d.value) + 'M';
            });
    });

var multi = fc.series.multi()
    .series([bar, annotation])
    .mapping(function(series) {
        switch (series) {
        case bar:
            return data.sales;
        case annotation:
            return data.targets;
        }
    });

chart.plotArea(multi);

function render() {
    d3.selectAll('#decorate')
        .datum(data)
        .call(chart);
}
render();

window.onresize = render;
