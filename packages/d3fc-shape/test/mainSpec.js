const d3Path = require('d3-path').path;
const d3fcShape = require('../build/d3fc-shape');
const fs = require('fs');
const options = require('./data/options');

const testData = JSON.parse(fs.readFileSync('test/data/data.json'));

function checkResults(module, type) {
    const data = testData[type].data;

    data.forEach(function(d, i) {
        d.date = (type === 'ohlc' ? i : new Date(d.date));
    });

    const results = testData[type].results;
    const keys = options[type].keys;
    const combinations = options[type].combinations;

    combinations.forEach((values, i) => {
        const pathGen = module(d3Path());
        values.forEach((val, i) => val ? pathGen[keys[i]](val) : null);

        expect(pathGen(data).toString()).toBe(results[i]);
    });

}

describe('Test all path generators return correct values', function() {

    it('Bar with d3-path returns correct paths', function() {
        checkResults(d3fcShape.bar, 'bar');
    });
    it('BoxPlot with d3-path returns correct paths', function() {
        checkResults(d3fcShape.boxPlot, 'boxPlot');
    });
    it('Candlestick with d3-path returns correct paths', function() {
        checkResults(d3fcShape.candlestick, 'candlestick');
    });
    it('ErrorBar with d3-path returns correct paths', function() {
        checkResults(d3fcShape.errorBar, 'errorBar');
    });
    it('OHLC with d3-path returns correct paths', function() {
        checkResults(d3fcShape.ohlc, 'ohlc');
    });
});
