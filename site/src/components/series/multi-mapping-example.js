var width = 500, height = 250;
var container = d3.select('#multi-mapping')
    .append('svg')
    .attr({'width': width, 'height': height});

var data = {
    foo: fc.data.random.financial()(25),
    bar: fc.data.random.financial()(25)
};

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')([data.foo, data.bar]))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])([data.foo, data.bar]))
    .range([height, 0]);

//START
var line = fc.series.line();
var area = fc.series.area();

var multi = fc.series.multi()
    .xScale(xScale)
    .yScale(yScale)
    .series([area, line])
    .mapping(function(series) {
        switch (series) {
        case line:
            return this.bar;
        case area:
            return this.foo;
        }
    });

container.datum(data)
  .call(multi);
//END
