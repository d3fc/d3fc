const d3Path = require('d3-path').path;
const d3fcPath = require('../../build/d3fc-path');
const fc = require('d3fc');
const fs = require('fs');

// CREATE DATA
const ohlcDataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
const ohlcData = ohlcDataGenerator(10);

const walkDataGenerator = fc.data.random.walk();
const barData = walkDataGenerator(10).map(function(datum, index) {
  return {
    x: index,
    y: datum
  };
});
const boxPlotData = walkDataGenerator()
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
const errorBarData = walkDataGenerator(20).map(function(datum, index) {
  return {
      x: index,
      y: datum,
      low: datum - Math.random(),
      high: datum + Math.random()
  };
});


// GET EXPECTED RESULTS - then save to results file

const results = {
  bar: {
    data: barData,
    result: d3fcPath.bar(d3Path).height(50)(barData)
  },
  boxPlot: {
    data: boxPlotData,
    result: d3fcPath.boxPlot(d3Path)(boxPlotData)
  },
  candlestick: {
    data: ohlcData,
    result: d3fcPath.candlestick(d3Path)(ohlcData)
  },
  errorBar: {
    data: errorBarData,
    result: d3fcPath.errorBar(d3Path)(errorBarData)
  },
  ohlc: {
    data: ohlcData,
    result: d3fcPath.ohlc(d3Path)(ohlcData)
  }
};

fs.writeFileSync('test/data/data.json', JSON.stringify(results, null, 2));
