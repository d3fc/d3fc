'use strict';

function bollingerBandsExample() {
    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var mainValue = function mainValue(d) {
        return d.close;
    };
    var crossValue = function crossValue(d) {
        return d.date;
    };

    var area = fc.seriesSvgArea().mainValue(function (d, i) {
        return d.upper;
    }).baseValue(function (d, i) {
        return d.lower;
    });

    var upperLine = fc.seriesSvgLine().mainValue(function (d, i) {
        return d.upper;
    });

    var averageLine = fc.seriesSvgLine().mainValue(function (d, i) {
        return d.average;
    });

    var lowerLine = fc.seriesSvgLine().mainValue(function (d, i) {
        return d.lower;
    });

    var bollingerBands = function bollingerBands(selection) {
        var multi = fc.seriesSvgMulti().xScale(xScale).yScale(yScale).series([area, upperLine, lowerLine, averageLine]).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi bollinger ' + ['area', 'upper', 'lower', 'average'][i];
            });
        });

        area.crossValue(crossValue);
        upperLine.crossValue(crossValue);
        averageLine.crossValue(crossValue);
        lowerLine.crossValue(crossValue);

        selection.call(multi);
    };

    bollingerBands.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return bollingerBands;
    };
    bollingerBands.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return bollingerBands;
    };
    bollingerBands.crossValue = function () {
        if (!arguments.length) {
            return crossValue;
        }
        crossValue = arguments.length <= 0 ? undefined : arguments[0];
        return bollingerBands;
    };
    bollingerBands.mainValue = function () {
        if (!arguments.length) {
            return mainValue;
        }
        mainValue = arguments.length <= 0 ? undefined : arguments[0];
        return bollingerBands;
    };

    return bollingerBands;
}

var width = 500;
var height = 250;

var container = d3.select('#bollinger').append('svg').attr('width', width).attr('height', height);

var dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

var data = dataGenerator(50);

var xScale = d3.scaleTime().domain(fc.extentDate().accessors([function (d) {
    return d.date;
}])(data)).range([0, width]);

var yScale = d3.scaleLinear().domain(fc.extentLinear().pad([0.4, 0.4]).accessors([function (d) {
    return d.high;
}, function (d) {
    return d.low;
}])(data)).range([height, 0]);

// START
// Create and apply the bollinger algorithm
var bollingerAlgorithm = fc.indicatorBollingerBands().value(function (d) {
    return d.close;
});
var bollingerData = bollingerAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, bollingerData[i]);
});

// Create the renderer
var bollinger = bollingerBandsExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(bollinger);