'use strict';

// Elder Ray Component
var elderRayExample = function elderRayExample() {
    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var crossValue = function crossValue(d) {
        return d.date;
    };
    var barWidth = fc.seriesFractionalBarWidth(0.75);
    var bullBar = fc.seriesSvgBar();
    var bearBar = fc.seriesSvgBar();
    var bullBarTop = fc.seriesSvgBar();
    var bearBarTop = fc.seriesSvgBar();
    var multi = fc.seriesSvgMulti();

    var elderRay = function elderRay(selection) {
        function isTop(input, comparison) {
            // The values share parity and the input is smaller than the comparison
            return input * comparison > 0 && Math.abs(input) < Math.abs(comparison);
        }

        bullBar.crossValue(crossValue).mainValue(function (d, i) {
            return isTop(d.bullPower, d.bearPower) ? undefined : d.bullPower;
        }).barWidth(barWidth);

        bearBar.crossValue(crossValue).mainValue(function (d, i) {
            return isTop(d.bearPower, d.bullPower) ? undefined : d.bearPower;
        }).barWidth(barWidth);

        bullBarTop.crossValue(crossValue).mainValue(function (d, i) {
            return isTop(d.bullPower, d.bearPower) ? d.bullPower : undefined;
        }).barWidth(barWidth);

        bearBarTop.crossValue(crossValue).mainValue(function (d, i) {
            return isTop(d.bearPower, d.bullPower) ? d.bearPower : undefined;
        }).barWidth(barWidth);

        multi.xScale(xScale).yScale(yScale).series([bullBar, bearBar, bullBarTop, bearBarTop]).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi ' + ['bull', 'bear', 'bull top', 'bear top'][i];
            });
        });

        selection.call(multi);
    };

    elderRay.barWidth = function () {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = arguments.length <= 0 ? undefined : arguments[0];
        return elderRay;
    };
    elderRay.crossValue = function () {
        if (!arguments.length) {
            return crossValue;
        }
        crossValue = arguments.length <= 0 ? undefined : arguments[0];
        return elderRay;
    };
    elderRay.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return elderRay;
    };
    elderRay.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return elderRay;
    };

    return elderRay;
};

var width = 500;
var height = 250;

var container = d3.select('#elder').append('svg').attr('width', width).attr('height', height);

var dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

var data = dataGenerator(50);

var xScale = d3.scaleTime().domain(fc.extentDate().accessors([function (d) {
    return d.date;
}])(data)).range([0, width]);

// START
// Create and apply the elder ray algorithm
var elderRayAlgorithm = fc.indicatorElderRay().period(6);
var elderRayData = elderRayAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, elderRayData[i]);
});

// the elder ray is rendered on its own scale
var yDomain = fc.extentLinear().accessors([function (d) {
    return d.bullPower;
}, function (d) {
    return d.bearPower;
}]).symmetricalAbout(0).pad([0.1, 0.1]);

var yScale = d3.scaleLinear().domain(yDomain(mergedData)).range([height, 0]);

// Create the renderer
var elderRay = elderRayExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(elderRay);