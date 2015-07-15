(function(d3, fc) {
    'use strict';

    fc.series.group = function() {

        var decorate = fc.util.fn.noop,
            xScale = d3.scale.linear(),
            yScale = d3.scale.linear(),
            xValue = function(d, i) { return d.x; },
            groupValue = function(d, i) { return d.group;},
            subScale = d3.scale.ordinal(),
            subSeries = fc.series.bar(),
            groupSize = fc.util.fractionalBarWidth(0.25);

        var dataJoin = fc.util.dataJoin()
            .selector('g.group')
            .element('g')
            .attrs({'class': 'group'});

        var group = function(selection) {

            selection.each(function(data, index) {

                var dataByX = d3.nest()
                    .key(xValue)
                    .map(data);

                var xValues = Object.keys(dataByX);

                var width = groupSize(xValues.map(xScale)),
                    halfWidth = width / 2;

                var dataByGroup = d3.nest()
                    .key(groupValue)
                    .map(data);

                var groupedValues = Object.keys(dataByGroup);

                subScale.domain(groupedValues);

                var g = dataJoin(this, groupedValues);

                g.each(function(d, i) {

                    subScale.rangePoints([-halfWidth, halfWidth]);

                    var g = d3.select(this);

                    g.attr('transform', 'translate(' + subScale(d) + ', 0)');

                    subSeries.xScale(xScale)
                        .yScale(yScale);

                    d3.select(this)
                        .datum(dataByGroup[d])
                        .call(subSeries);

                });

                decorate(g, groupedValues, index);
            });
        };

        group.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return group;
        };
        group.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return group;
        };
        group.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return group;
        };
        group.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return group;
        };
        group.groupValue = function(x) {
            if (!arguments.length) {
                return groupValue;
            }
            groupValue = x;
            return group;
        };
        group.subSeries = function(x) {
            if (!arguments.length) {
                return subSeries;
            }
            subSeries = x;
            return group;
        };
        group.groupSize = function(x) {
            if (!arguments.length) {
                return groupSize;
            }
            groupSize = d3.functor(x);
            return group;
        };

        return group;

    };
}(d3, fc));
