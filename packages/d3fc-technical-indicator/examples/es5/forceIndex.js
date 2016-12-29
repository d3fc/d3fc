'use strict';

var forceIndexExample = function forceIndexExample() {
    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var multiSeries = fc.seriesSvgMulti();

    var annotations = fc.annotationSvgLine();

    var forceLine = fc.seriesSvgLine().crossValue(function (d) {
        return d.date;
    }).mainValue(function (d) {
        return d.force;
    });

    var force = function force(selection) {
        multiSeries.xScale(xScale).yScale(yScale).series([annotations, forceLine]).mapping(function (data, index, series) {
            return series[index] === annotations ? [0] : data;
        }).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi ' + ['annotations', 'indicator'][i];
            });
        });

        selection.call(multiSeries);
    };

    force.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        annotations.xScale(arguments.length <= 0 ? undefined : arguments[0]);
        return force;
    };
    force.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        annotations.yScale(arguments.length <= 0 ? undefined : arguments[0]);
        return force;
    };

    fc.rebind(force, forceLine, 'mainValue', 'crossValue');

    return force;
};

var width = 500;
var height = 250;

var container = d3.select('#force-index').append('svg').attr('width', width).attr('height', height);

var dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

var data = dataGenerator(50);

var xScale = d3.scaleTime().domain(fc.extentDate().accessors([function (d) {
    return d.date;
}])(data)).range([0, width - 50]);

// START
// Create and apply the Force Index algorithm
var forceAlgorithm = fc.indicatorForceIndex();
var forceData = forceAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, { force: forceData[i] });
});

// Scaling the display using the maximum absolute value of the Index
var yDomain = fc.extentLinear().accessors([function (d) {
    return d.force;
}]).symmetricalAbout(0);

var yScale = d3.scaleLinear().domain(yDomain(mergedData)).range([height, 0]).nice();

// Create the renderer
var force = forceIndexExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(force);