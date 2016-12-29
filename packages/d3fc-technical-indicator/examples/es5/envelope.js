'use strict';

var envelopeExample = function envelopeExample() {

    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var mainValue = function mainValue(d) {
        return d.close;
    };
    var crossValue = function crossValue(d) {
        return d.date;
    };

    var area = fc.seriesSvgArea().mainValue(function (d) {
        return d.upper;
    }).baseValue(function (d) {
        return d.lower;
    });

    var upperLine = fc.seriesSvgLine().mainValue(function (d) {
        return d.upper;
    });

    var lowerLine = fc.seriesSvgLine().mainValue(function (d) {
        return d.lower;
    });

    var envelope = function envelope(selection) {
        var multi = fc.seriesSvgMulti().xScale(xScale).yScale(yScale).series([area, upperLine, lowerLine]).decorate(function (g, data, index) {
            g.enter().attr('class', function (d, i) {
                return 'multi envelope ' + ['area', 'upper', 'lower'][i];
            });
        });

        area.crossValue(crossValue);
        upperLine.crossValue(crossValue);
        lowerLine.crossValue(crossValue);

        selection.call(multi);
    };

    envelope.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return envelope;
    };
    envelope.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return envelope;
    };
    envelope.crossValue = function () {
        if (!arguments.length) {
            return crossValue;
        }
        crossValue = arguments.length <= 0 ? undefined : arguments[0];
        return envelope;
    };
    envelope.mainValue = function () {
        if (!arguments.length) {
            return mainValue;
        }
        mainValue = arguments.length <= 0 ? undefined : arguments[0];
        return envelope;
    };

    return envelope;
};

var width = 500;
var height = 250;

var container = d3.select('#envelope').append('svg').attr('width', width).attr('height', height);

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
// Create and apply the envelope algorithm
var envelopeAlgorithm = fc.indicatorEnvelope().factor(0.01).value(function (d) {
    return d.close;
});

var envelopeData = envelopeAlgorithm(data);
var mergedData = data.map(function (d, i) {
    return Object.assign({}, d, envelopeData[i]);
});

// Create the renderer
var envelope = envelopeExample().xScale(xScale).yScale(yScale);

// Add it to the container
container.append('g').datum(mergedData).call(envelope);