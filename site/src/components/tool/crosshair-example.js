var width = 500, height = 250;
var container = d3.select('#crosshair')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0]);

//START
// create a line series and a crosshair
var line = fc.series.line();
var crosshair = fc.tool.crosshair();

// create an array which will hold the crosshair datapoint
var crosshairData = [];

// use a multi-series to render both the line and crosshair
var multi = fc.series.multi()
  .series([line, crosshair])
  .xScale(xScale)
  .yScale(yScale)
  .mapping(function(series) {
      switch (series) {
      case line:
          return data;
      case crosshair:
          return crosshairData;
      }
  });

container.append('g')
    .datum(data)
    .call(multi);
//END
