import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import axis from '../svg/axis';
import line from '../series/line';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {rebindAll, rebind} from '../util/rebind';
import expandMargin from '../util/expandMargin';
import {setRange} from '../util/scale';
import {noop} from '../util/fn';

export default function(xScale, yScale) {

    xScale = xScale || d3.scale.linear();
    yScale = yScale || d3.scale.linear();

    var padding = 10,
        columns = 9,
        decorate = noop,
        plotArea = line(),
        margin = {
            bottom: 30,
            right: 30
        },
        values = function(d) { return d.values; },
        key = function(d) { return d.key; };

    var xAxis = axis()
        .ticks(2);
    var yAxis = axis()
        .orient('left')
        .ticks(3);

    function classedDataJoin(clazz) {
        return dataJoinUtil()
            .selector('g.' + clazz)
            .element('g')
            .attr('class', clazz);
    }

    var dataJoin = classedDataJoin('multiple'),
        xAxisDataJoin = classedDataJoin('x-axis'),
        yAxisDataJoin = classedDataJoin('y-axis');

    var multiples = function(selection) {
        selection.each(function(data, index) {

            var container = d3.select(this);

            var expandedMargin = expandMargin(margin);
            expandedMargin.position = 'absolute';

            var svg = container.selectAll('svg')
                .data([data]);
            svg.enter()
                .append('svg')
                .layout('flex', 1)
                .append('g')
                .attr('class', 'chart multiples');

            var plotAreaContainer = svg.select('g')
                .layout(expandedMargin);

            container.layout();

            var rows = Math.ceil(data.length / columns);
            var multipleWidth = plotAreaContainer.layout('width') / columns - padding * 2;
            var multipleHeight = plotAreaContainer.layout('height') / rows - padding * 2;

            function translationForMultiple(row, column) {
                return {
                    xOffset: padding + (multipleWidth + padding) * row,
                    yOffset: padding + (multipleHeight + padding) * column
                };
            }

            setRange(xScale, [0, multipleWidth]);
            setRange(yScale, [multipleHeight, 0]);

            plotArea.xScale(xScale)
                .yScale(yScale);

            // create a container for each multiple chart
            var multipleContainer = dataJoin(plotAreaContainer, data);
            multipleContainer.attr('transform', function(d, i) {
                var translation = translationForMultiple(i % columns, Math.floor(i / columns));
                return 'translate(' + translation.xOffset + ',' + translation.yOffset + ')';
            });

            // within each, add an inner 'g' and background rect
            var inner = multipleContainer.enter()
                .append('g');
            inner.append('rect')
                .attr('class', 'background');
            inner.append('g')
                .attr('transform', 'translate(' + (multipleWidth / 2) + ', 0)')
                .append('text')
                .attr('class', 'label')
                .text(key);

            // on update, call the plotArea and size the rect element
            multipleContainer.select('g')
                .datum(values)
                .call(plotArea);
            multipleContainer.select('rect')
                .attr({width: multipleWidth, height: multipleHeight});

            decorate(multipleContainer, data, index);

            var xAxisContainer = xAxisDataJoin(plotAreaContainer, d3.range(columns));
            xAxisContainer.attr('transform', function(d, i) {
                var row = xAxis.orient() === 'bottom' ? rows : 0;
                var offset = xAxis.orient() === 'bottom' ? 0 : -padding;
                var translation = translationForMultiple(i, row);
                return 'translate(' + translation.xOffset + ',' + (translation.yOffset + offset) + ')';
            });
            xAxis.scale(xScale);
            xAxisContainer.call(xAxis);

            var yAxisContainer = yAxisDataJoin(plotAreaContainer, d3.range(rows));
            yAxisContainer.attr('transform', function(d, i) {
                var column = yAxis.orient() === 'left' ? 0 : columns;
                var offset = yAxis.orient() === 'left' ? -padding : 0;
                var translation = translationForMultiple(column, i);
                return 'translate(' + (translation.xOffset + offset) + ',' + translation.yOffset + ')';
            });
            yAxis.scale(yScale);
            yAxisContainer.call(yAxis);
        });
    };

    var scaleExclusions = [
        /range\w*/,   // the scale range is set via the component layout
        /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
    ];
    rebindAll(multiples, xScale, 'x', scaleExclusions);
    rebindAll(multiples, yScale, 'y', scaleExclusions);

    rebindAll(multiples, xAxis, 'x');
    rebindAll(multiples, yAxis, 'y');

    multiples.columns = function(x) {
        if (!arguments.length) {
            return columns;
        }
        columns = x;
        return multiples;
    };

    multiples.margin = function(x) {
        if (!arguments.length) {
            return margin;
        }
        margin = x;
        return multiples;
    };

    multiples.padding = function(x) {
        if (!arguments.length) {
            return padding;
        }
        padding = x;
        return multiples;
    };

    multiples.plotArea = function(x) {
        if (!arguments.length) {
            return plotArea;
        }
        plotArea = x;
        return multiples;
    };

    multiples.values = function(x) {
        if (!arguments.length) {
            return values;
        }
        values = x;
        return multiples;
    };

    multiples.key = function(x) {
        if (!arguments.length) {
            return key;
        }
        key = x;
        return multiples;
    };

    multiples.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return multiples;
    };

    return multiples;
}
