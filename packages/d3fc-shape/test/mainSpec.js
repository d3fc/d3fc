import path from 'path';
import bar from '../src/bar';
import candlestick from '../src/candlestick';
import ohlc from '../src/ohlc';
import errorBar from '../src/errorBar';
import boxPlot from '../src/boxPlot';

import fs from 'fs';
import options from './data/options';

const testData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json')));

function checkResults(module, type) {
    const data = testData[type].data;

    data.forEach(function(d, i) {
        d.date = (type === 'ohlc' ? i : new Date(d.date));
    });

    const results = testData[type].results;
    const keys = options[type].keys;
    const combinations = options[type].combinations;

    combinations.forEach((values, i) => {
        const pathGen = module();
        values.forEach((val, i) => val ? pathGen[keys[i]](val) : null);

        expect(pathGen(data).toString()).toBe(results[i]);
    });

}

describe('Test all path generators return correct values', function() {

    it('Bar with d3-path returns correct paths', function() {
        checkResults(bar, 'bar');
    });
    it('BoxPlot with d3-path returns correct paths', function() {
        checkResults(boxPlot, 'boxPlot');
    });
    it('Candlestick with d3-path returns correct paths', function() {
        checkResults(candlestick, 'candlestick');
    });
    it('ErrorBar with d3-path returns correct paths', function() {
        checkResults(errorBar, 'errorBar');
    });
    it('OHLC with d3-path returns correct paths', function() {
        checkResults(ohlc, 'ohlc');
    });
});
