const d3Path = require('d3-path').path;
const d3fcPath = require('../build/d3fc-path');
const fs = require('fs');


const testData = JSON.parse(fs.readFileSync('test/data/data.json'));

function checkResults(func, type) {
  testData[type].data.forEach(function(d) {
    d.date = new Date(d.date);
  });

  const path = func(testData[type].data);
  expect(path).toBe(testData[type].result);
}

describe('Test all path generators return correct values', function() {

    it('Bar with d3-path returns correct path', function() {
        const bar = d3fcPath.bar(d3Path).height(50);
        checkResults(bar, 'bar');
    });
    it('BoxPlot with d3-path returns correct path', function() {
        const boxPlot = d3fcPath.boxPlot(d3Path);
        checkResults(boxPlot, 'boxPlot');
    });
    it('Candlestick with d3-path returns correct path', function() {
        const candlestick = d3fcPath.candlestick(d3Path);
        checkResults(candlestick, 'candlestick');
    });
    it('ErrorBar with d3-path returns correct path', function() {
        const errorBar = d3fcPath.errorBar(d3Path);
        checkResults(errorBar, 'errorBar');
    });
    it('OHLC with d3-path returns correct path', function() {
        const ohlc = d3fcPath.ohlc(d3Path);
        checkResults(ohlc, 'ohlc');
    });
});
