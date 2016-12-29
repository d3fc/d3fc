'use strict';

var rsiExample = function rsiExample() {
    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var upperValue = 70;
    var lowerValue = 30;
    var multiSeries = fc.seriesSvgMulti();

    var annotations = fc.annotationSvgLine();
    var rsiLine = fc.seriesSvgLine().crossValue(function (d) {
        return d.date;
    }).mainValue(function (d) {
        return d.rsi;
    });

    var rsi = function rsi(selection) {
        multiSeries.xScale(xScale).yScale(yScale).series([annotations, rsiLine]).mapping(function (data, index, series) {
            return series[index] === annotations ? [upperValue, 50, lowerValue] : data;
        }).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi rsi ' + ['annotations', 'indicator'][i];
            });
        });

        selection.call(multiSeries);
    };

    rsi.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return rsi;
    };
    rsi.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return rsi;
    };
    rsi.upperValue = function () {
        if (!arguments.length) {
            return upperValue;
        }
        upperValue = arguments.length <= 0 ? undefined : arguments[0];
        return rsi;
    };
    rsi.lowerValue = function () {
        if (!arguments.length) {
            return lowerValue;
        }
        lowerValue = arguments.length <= 0 ? undefined : arguments[0];
        return rsi;
    };

    fc.rebind(rsi, rsiLine, 'mainValue', 'crossValue');

    return rsi;
};

var width = 500;
var height = 250;

var container = d3.select('#rsi').append('svg').attr('width', width).attr('height', height);

var dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

var data = dataGenerator(50);

var xScale = d3.scaleTime().domain(fc.extentDate().accessors([function (d) {
    return d.date;
}])(data)).range([0, width - 50]);

// START
// the RSI is output on a percentage scale, so requires a domain from 0 - 100
var yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

// Create and apply the RSI algorithm
var rsiAlgorithm = fc.indicatorRelativeStrengthIndex().value(function (d) {
    return d.close;
});
var rsiData = rsiAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, { rsi: rsiData[i] });
});

// Create the renderer
var rsi = rsiExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(rsi);