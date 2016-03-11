var width = 500, height = 250;
var container = d3.select('#waterfall')
    .append('svg')
    .attr({'width': width, 'height': height});

var data = [
  { month: 'January', profit: 4000 },
  { month: 'February', profit: 2000 },
  { month: 'March', profit: -1000 },
  { month: 'April', profit: 1500 },
  { month: 'May', profit: 100 },
  { month: 'June', profit: 500 },
  { month: 'July', profit: -100 },
  { month: 'August', profit: 800 },
  { month: 'September', profit: 1200 },
  { month: 'October', profit: 1500 },
  { month: 'November', profit: 1400 },
  { month: 'December', profit: 2000 }
];

var waterfallData = fc.series.algorithm.waterfall()
    .xValueKey('month')
    .yValue(function(d) { return d.profit; })
    .startsWithTotal(true)
    .total(function(d, i) {
        if ((i + 1) % 3 === 0) {
            return 'Q' + ((i + 1) / 3) + ' total';
        }
    })(data);

var xScale = d3.scale.ordinal()
    .domain(waterfallData.map(function(d) { return d.x; }))
    .rangeRoundBands([0, width], 0.1);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['y1']).pad(0.2).include(0)(waterfallData))
    .range([height, 0]);

var waterfall = fc.series.waterfall()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(waterfallData)
    .call(waterfall);
