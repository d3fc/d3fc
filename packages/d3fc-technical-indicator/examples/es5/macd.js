'use strict';

var macdExample = function macdExample() {
    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var crossValue = function crossValue(d) {
        return d.date;
    };
    var macdLine = fc.seriesSvgLine();
    var signalLine = fc.seriesSvgLine();
    var divergenceBar = fc.seriesSvgBar();
    var multiSeries = fc.seriesSvgMulti();

    var macd = function macd(selection) {
        macdLine.crossValue(crossValue).mainValue(function (d) {
            return d.macd;
        });

        signalLine.crossValue(crossValue).mainValue(function (d) {
            return d.signal;
        });

        divergenceBar.crossValue(crossValue).mainValue(function (d) {
            return d.divergence;
        });

        multiSeries.xScale(xScale).yScale(yScale).series([divergenceBar, macdLine, signalLine]).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi ' + ['macd-divergence', 'macd', 'macd-signal'][i];
            });
        });

        selection.call(multiSeries);
    };

    macd.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return macd;
    };
    macd.crossValue = function () {
        if (!arguments.length) {
            return crossValue;
        }
        crossValue = arguments.length <= 0 ? undefined : arguments[0];
        return macd;
    };
    macd.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return macd;
    };

    fc.rebind(macd, divergenceBar, 'barWidth');

    return macd;
};

var width = 500;
var height = 250;

var container = d3.select('#macd').append('svg').attr('width', width).attr('height', height);

var dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

var data = dataGenerator(50);

var xScale = d3.scaleTime().domain(fc.extentDate().accessors([function (d) {
    return d.date;
}])(data)).range([0, width]);

// START
// Create and apply the macd algorithm
var macdAlgorithm = fc.indicatorMacd().fastPeriod(4).slowPeriod(10).signalPeriod(5).value(function (d) {
    return d.close;
});
var macdData = macdAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, macdData[i]);
});

// the MACD is rendered on its own scale, centered around zero
var yDomain = fc.extentLinear().accessors([function (d) {
    return d.macd;
}]).symmetricalAbout(0);

var yScale = d3.scaleLinear().domain(yDomain(mergedData)).range([height, 0]);

// Create the renderer
var macd = macdExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(macd);