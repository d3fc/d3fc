var width = 500, height = 250;
var container = d3.select('#boxplot')
    .append('svg')
    .attr({'width': width, 'height': height});

// START
// Generating the boxPlot information for the data
var dataGenerator = fc.data.random.walk()
  .steps(10);
var data = dataGenerator()
    .map(function(datum, index) {
      var result = {
        value: index
      };
      result.median = 10 + Math.random();
      result.upperQuartile = result.median + Math.random();
      result.lowerQuartile = result.median - Math.random();
      result.high = result.upperQuartile + Math.random();
      result.low = result.lowerQuartile - Math.random();
      return result;
    });

var xScale = d3.scale.linear()
    .domain(fc.util.extent().pad(0.1).fields(['value'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0]);

var boxPlot = fc.series.boxPlot()
    .xScale(xScale)
    .yScale(yScale)
    .value(function(d) { return d.value; })
    .median(function(d) { return d.median; })
    .upperQuartile(function(d) { return d.upperQuartile; })
    .lowerQuartile(function(d) { return d.lowerQuartile; })
    .high(function(d) { return d.high; })
    .low(function(d) { return d.low; });

container.append('g')
    .datum(data)
    .call(boxPlot);
// END
