'use strict';

var stochasticExample = function stochasticExample() {
    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var highValue = 70;
    var lowValue = 30;
    var multi = fc.seriesSvgMulti();

    var annotations = fc.annotationSvgLine();
    var dLine = fc.seriesSvgLine().crossValue(function (d) {
        return d.date;
    }).mainValue(function (d) {
        return d.stochastic.d;
    });

    var kLine = fc.seriesSvgLine().crossValue(function (d) {
        return d.date;
    }).mainValue(function (d) {
        return d.stochastic.k;
    });

    var stochastic = function stochastic(selection) {
        multi.xScale(xScale).yScale(yScale).series([annotations, dLine, kLine]).mapping(function (data, index, series) {
            return series[index] === annotations ? [highValue, lowValue] : data;
        }).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi stochastic ' + ['annotations', 'stochastic-d', 'stochastic-k'][i];
            });
        });

        selection.call(multi);
    };

    stochastic.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return stochastic;
    };
    stochastic.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return stochastic;
    };
    stochastic.highValue = function () {
        if (!arguments.length) {
            return highValue;
        }
        highValue = arguments.length <= 0 ? undefined : arguments[0];
        return stochastic;
    };
    stochastic.lowValue = function () {
        if (!arguments.length) {
            return lowValue;
        }
        lowValue = arguments.length <= 0 ? undefined : arguments[0];
        return stochastic;
    };

    return stochastic;
};

var width = 500;
var height = 250;
var container = d3.select('#stochastic').append('svg').attr('width', width).attr('height', height);

var dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = d3.scaleTime().domain(fc.extentDate().accessors([function (d) {
    return d.date;
}])(data)).range([0, width]);

// START
// Create and apply the stochastic oscillator algorithm
var stochasticAlgorithm = fc.indicatorStochasticOscillator().kPeriod(14);
var stochasticData = stochasticAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, { stochastic: stochasticData[i] });
});

// the stochastic oscillator is rendered on its own scale
var yScale = d3.scaleLinear().domain([0, 100]).range([height - 5, 5]);

// Create the renderer
var stochastic = stochasticExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(stochastic);