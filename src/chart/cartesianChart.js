import d3 from 'd3';
import axis from '../series/axis';
import '../layout/layout'; // import side-effects
import line from '../series/line';
import dataJoin from '../util/dataJoin';
import expandMargin from '../util/expandMargin';
import {noop} from '../util/fn';
import {rebindAll} from '../util/rebind';
import {isOrdinal} from '../util/scale';

export default function(xScale, yScale) {

    xScale = xScale || d3.scale.linear();
    yScale = yScale || d3.scale.linear();

    var margin = {
            bottom: 30,
            right: 30
        },
        yLabel = '',
        xLabel = '',
        chartLabel = '',
        plotArea = line(),
        decorate = noop;

    // The axes have a baseline that is defined in the coordinate system of the
    // opposing axis. If the opposing axis is linear, the baseline is expressed
    // in the opposing axis domain coordinate system. If it is ordinal, the baseline
    // is expressed in the range coordinate system.
    function baselineExtent(scale) {
        return isOrdinal(scale) ? scale.rangeExtent() : scale.domain();
    }

    var xAxis = axis()
        .orient('bottom')
        .baseline(function() {
            var r = baselineExtent(yScale);
            return xAxis.orient() === 'bottom' ? r[0] : r[1];
        });

    var yAxis = axis()
        .orient('right')
        .baseline(function() {
            var r = baselineExtent(xScale);
            return yAxis.orient() === 'left' ? r[0] : r[1];
        });

    var containerDataJoin = dataJoin()
        .selector('svg.cartesian-chart')
        .element('svg')
        .attr({'class': 'cartesian-chart', 'layout-css': 'flex: 1'});

    // Ordinal and linear scales have different methods for setting the range. This
    // function detects the scale type and sets the range accordingly.
    function setScaleRange(scale, range) {
        if (isOrdinal(scale)) {
            scale.rangePoints(range, 1);
        } else {
            scale.range(range);
        }
    }

    var cartesianChart = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this);

            var svg = containerDataJoin(container, [data]);
            svg.enter().html(
                '<g class="title"> \
                    <g layout-css="height: 0; width: 0"> \
                        <text class="label"/> \
                    </g> \
                </g> \
                <g class="y-axis"> \
                    <g layout-css="height: 0; width: 0"> \
                        <text class="label"/> \
                    </g> \
                </g> \
                <g class="x-axis"> \
                    <g layout-css="height: 0; width: 0"> \
                        <text class="label"/> \
                    </g> \
                </g> \
                <g class="plot-area-container"> \
                    <rect class="background" \
                        layout-css="position: absolute; top: 0; bottom: 0; left: 0; right: 0"/> \
                    <svg class="axes-container" \
                        layout-css="position: absolute; top: 0; bottom: 0; left: 0; right: 0"> \
                        <g class="x-axis" layout-css="height: 0; width: 0"/> \
                        <g class="y-axis" layout-css="height: 0; width: 0"/> \
                    </svg> \
                    <svg class="plot-area" \
                        layout-css="position: absolute; top: 0; bottom: 0; left: 0; right: 0"/> \
                </g>');

            var expandedMargin = expandMargin(margin);

            svg.select('.plot-area-container')
                .layout({
                    position: 'absolute',
                    top: expandedMargin.top,
                    left: expandedMargin.left,
                    bottom: expandedMargin.bottom,
                    right: expandedMargin.right
                });

            svg.select('.title')
                .layout({
                    position: 'absolute',
                    top: 0,
                    alignItems: 'center',
                    left: expandedMargin.left,
                    right: expandedMargin.right
                });

            var yAxisLayout = {
                position: 'absolute',
                top: expandedMargin.top,
                bottom: expandedMargin.bottom,
                alignItems: 'center',
                flexDirection: 'row'
            };
            yAxisLayout[yAxis.orient()] = 0;
            svg.select('.y-axis')
                .attr('class', 'y-axis ' + yAxis.orient())
                .layout(yAxisLayout);

            var xAxisLayout = {
                position: 'absolute',
                left: expandedMargin.left,
                right: expandedMargin.right,
                alignItems: 'center'
            };
            xAxisLayout[xAxis.orient()] = 0;
            svg.select('.x-axis')
                .attr('class', 'x-axis ' + xAxis.orient())
                .layout(xAxisLayout);

            // perform the flexbox / css layout
            container.layout();

            // update the label text
            svg.select('.title .label')
                .text(chartLabel);

            svg.select('.y-axis .label')
                .text(yLabel)
                .attr('transform', yAxis.orient() === 'right' ? 'rotate(90)' : 'rotate(-90)');

            svg.select('.x-axis .label')
                .text(xLabel);

            // set the axis ranges
            var plotAreaContainer = svg.select('.plot-area');
            setScaleRange(xScale, [0, plotAreaContainer.layout('width')]);
            setScaleRange(yScale, [plotAreaContainer.layout('height'), 0]);

            // render the axes
            xAxis.xScale(xScale)
                .yScale(isOrdinal(yScale) ? d3.scale.identity() : yScale);

            yAxis.yScale(yScale)
                .xScale(isOrdinal(xScale) ? d3.scale.identity() : xScale);

            svg.select('.axes-container .x-axis')
                .call(xAxis);

            svg.select('.axes-container .y-axis')
                .call(yAxis);

            // render the plot area
            plotArea.xScale(xScale)
                .yScale(yScale);
            plotAreaContainer.call(plotArea);

            decorate(svg, data, index);
        });
    };

    var scaleExclusions = [
        /range\w*/,   // the scale range is set via the component layout
        /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
    ];
    rebindAll(cartesianChart, xScale, 'x', scaleExclusions);
    rebindAll(cartesianChart, yScale, 'y', scaleExclusions);

    rebindAll(cartesianChart, xAxis, 'x');
    rebindAll(cartesianChart, yAxis, 'y');

    cartesianChart.chartLabel = function(x) {
        if (!arguments.length) {
            return chartLabel;
        }
        chartLabel = x;
        return cartesianChart;
    };
    cartesianChart.plotArea = function(x) {
        if (!arguments.length) {
            return plotArea;
        }
        plotArea = x;
        return cartesianChart;
    };
    cartesianChart.xLabel = function(x) {
        if (!arguments.length) {
            return xLabel;
        }
        xLabel = x;
        return cartesianChart;
    };
    cartesianChart.margin = function(x) {
        if (!arguments.length) {
            return margin;
        }
        margin = x;
        return cartesianChart;
    };
    cartesianChart.yLabel = function(x) {
        if (!arguments.length) {
            return yLabel;
        }
        yLabel = x;
        return cartesianChart;
    };
    cartesianChart.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return cartesianChart;
    };

    return cartesianChart;
}