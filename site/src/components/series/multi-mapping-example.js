var width = 500, height = 250;
var container = d3.select('#multi-mapping')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.walk();
function generateData() {
    return dataGenerator(20).map(function(datum, index) {
        return {
            x: index,
            y: datum
        };
    });
}

var data = {
    foo: generateData(),
    bar: generateData()
};

var xScale = d3.scale.linear()
    .domain(fc.util.extent().fields('x')([data.foo, data.bar]))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields('y')([data.foo, data.bar]))
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
