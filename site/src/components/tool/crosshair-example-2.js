var width = 500, height = 250;
var container = d3.select('#crosshair-2')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields(['date'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0]);

//START
var numberFormat = d3.format('.2f');

var line = fc.series.line()
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.close; });

var crosshair = fc.tool.crosshair()
  .xLabel(function(d) { return numberFormat(d.x); })
  .yLabel(function(d) { return numberFormat(d.y); })
  .on('trackingstart', render)
  .on('trackingmove', render)
  .on('trackingend', render);

var tooltip = fc.chart.tooltip()
    .items([
        ['X:', function(d) { return numberFormat(d.x); }],
        ['Y:', function(d) { return numberFormat(d.y); }]
    ]);

var tooltipLayout = fc.layout.label()
    .position([10, 10])
    .size([50, 30])
    .component(tooltip);

// create an array which will hold the crosshair datapoint
var crosshairData = [];

// use a multi-series to render both the line, crosshair and tooltip
var multi = fc.series.multi()
  .series([line, crosshair, tooltipLayout])
  .xScale(xScale)
  .yScale(yScale)
  .mapping(function(series) {
      switch (series) {
      case line:
          return data;
      case crosshair:
      case tooltipLayout:
          return crosshairData;
      }
  });

function render() {
    container
      .datum(data)
      .call(multi);
}
render();
//END
