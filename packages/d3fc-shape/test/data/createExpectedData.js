const d3Path = require('d3-path').path;
const d3fcShape = require('../../build/d3fc-shape');
const randomData = require('d3fc-random-data');
const fs = require('fs');
const options = require('./options');

// CREATE DATA
const ohlcDataGenerator = randomData.randomFinancial()
    .startDate(new Date(2014, 1, 1));

// Convert date into just an index
const ohlcData = ohlcDataGenerator(10).map((d, i) => {
    d.date = i;
    return d;
});

const walkDataGenerator = randomData.randomGeometricBrownianMotion();
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

function getResults(module, data, options) {
    const keys = options.keys;
    const combinations = options.combinations;

    return combinations.map((values) => {
        const pathGen = module(d3Path());
        values.forEach((val, i) => val ? pathGen[keys[i]](val) : null);

        return pathGen(data).toString();
    });
}

// GET EXPECTED RESULTS - then save to results file

const results = {
    bar: {
        data: barData,
        results: getResults(d3fcShape.bar, barData, options.bar)
    },
    boxPlot: {
        data: boxPlotData,
        results: getResults(d3fcShape.boxPlot, boxPlotData, options.boxPlot)
    },
    candlestick: {
        data: ohlcData,
        results: getResults(d3fcShape.candlestick, ohlcData, options.candlestick)
    },
    errorBar: {
        data: errorBarData,
        results: getResults(d3fcShape.errorBar, errorBarData, options.errorBar)
    },
    ohlc: {
        data: ohlcData,
        results: getResults(d3fcShape.ohlc, ohlcData, options.ohlc)
    }
};

fs.writeFileSync('test/data/data.json', JSON.stringify(results, null, 2));
