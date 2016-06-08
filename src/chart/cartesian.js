import 'svg-innerhtml';
import d3 from 'd3';
import axis from '../series/axis';
import '../layout/layout';
import line from '../series/line';
import dataJoin from '../util/dataJoin';
import expandRect from '../util/expandRect';
import {noop} from '../util/fn';
import {exclude, includeMap, prefix, rebindAll} from 'd3fc-rebind';
import {isOrdinal, range, setRange} from '../util/scale';

export default function(xScale, yScale) {

    xScale = xScale || d3.scale.linear();
    yScale = yScale || d3.scale.linear();

    var margin = {
            bottom: 30,
            right: 30
        },
        yLabel = '',
        xLabel = '',
        xBaseline = null,
        yBaseline = null,
        chartLabel = '',
        plotArea = line(),
        decorate = noop;

    // Each axis-series has a cross-scale which is defined as an identity
    // scale. If no baseline function is supplied, the axis is positioned
    // using the cross-scale range extents. If a baseline function is supplied
    // it is transformed via the respective scale.
    var xAxis = axis()
        .orient('bottom')
        .baseline(function() {
            if (xBaseline !== null) {
                return yScale(xBaseline.apply(this, arguments));
            } else {
                var r = range(yScale);
                return xAxis.orient() === 'bottom' ? r[0] : r[1];
            }
        });

    var yAxis = axis()
        .orient('right')
        .baseline(function() {
            if (yBaseline !== null) {
                return xScale(yBaseline.apply(this, arguments));
            } else {
                var r = range(xScale);
                return yAxis.orient() === 'left' ? r[0] : r[1];
            }
        });

    var containerDataJoin = dataJoin()
        .selector('svg.cartesian-chart')
        .element('svg')
        .attr({'class': 'cartesian-chart', 'layout-style': 'flex: 1'});


    var cartesian = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this);

            var svg = containerDataJoin(container, [data]);
            svg.enter().call(function(selection) {
                // container
                var plotContainer = selection.append("g")
                    .classed("plot-area-container", true);
                plotContainer.append("rect")
                    .classed("background", true)
                    .layout({position: "absolute", top: 0, bottom: 0, left: 0, right: 0});

                // axes
                var axesContainer = plotContainer.append("g")
                    .classed("axes-container", true);
                axesContainer.append("g")
                    .classed("x-axis", true)
                    .layout({height: 0, width: 0});
                axesContainer.append("g")
                    .classed("y-axis", true)
                    .layout({height: 0, width: 0});

                // plot area
                var plot = plotContainer.append("svg")
                    .classed("plot-area", true)
                    .layout({position: "absolute", top: 0, bottom: 0, left: 0, right: 0});

                // label containers
                plotContainer.append("g")
                    .classed("x-axis label-container", true)
                    .append("g")
                    .layout({height: 0, width: 0})
                    .append("text")
                    .classed("label", true)
                    .attr("dy", "-0.5em");
                plotContainer.append("g")
                    .classed("y-axis label-container", true)
                    .append("g")
                    .layout({height: 0, width: 0})
                    .append("text")
                    .classed("label", true);
                plotContainer.append("g")
                    .classed("title label-container", true)
                    .append("g")
                    .layout({height: 0, width: 0})
                    .append("text")
                    .classed("label", true);
            });

            var expandedMargin = expandRect(margin);

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
            svg.select('.y-axis.label-container')
                .attr('class', 'y-axis label-container ' + yAxis.orient())
                .layout(yAxisLayout);

            var xAxisLayout = {
                position: 'absolute',
                left: expandedMargin.left,
                right: expandedMargin.right,
                alignItems: 'center'
            };
            xAxisLayout[xAxis.orient()] = 0;
            svg.select('.x-axis.label-container')
                .attr('class', 'x-axis label-container ' + xAxis.orient())
                .layout(xAxisLayout);

            // perform the flexbox / css layout
            container.layout();

            // update the label text
            svg.select('.title .label')
                .text(chartLabel);

            svg.select('.y-axis.label-container .label')
                .text(yLabel)
                .attr('transform', yAxis.orient() === 'right' ? 'rotate(90)' : 'rotate(-90)');

            svg.select('.x-axis.label-container .label')
                .text(xLabel);

            // set the axis ranges
            var plotAreaContainer = svg.select('.plot-area');
            setRange(xScale, [0, plotAreaContainer.layout('width')]);
            setRange(yScale, [plotAreaContainer.layout('height'), 0]);

            // render the axes
            xAxis.xScale(xScale)
                .yScale(d3.scale.identity());

            yAxis.yScale(yScale)
                .xScale(d3.scale.identity());

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

    var scaleExclusions = exclude(
        /range\w*/,   // the scale range is set via the component layout
        /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
    );
    rebindAll(cartesian, xScale, scaleExclusions, exclude('ticks'), prefix('x'));
    rebindAll(cartesian, yScale, scaleExclusions, exclude('ticks'), prefix('y'));

    // The scale ticks method is a stateless method that returns (roughly) the number of ticks
    // requested. This is subtley different from the axis ticks methods that simply stores the given arguments
    // for invocation of the scale method at some point in the future.
    // Here we expose the underling scale ticks method in case the user want to generate their own ticks.
    if (!isOrdinal(xScale)) {
        rebindAll(cartesian, xScale, includeMap({'ticks': 'xScaleTicks'}));
    }
    if (!isOrdinal(yScale)) {
        rebindAll(cartesian, yScale, includeMap({'ticks': 'yScaleTicks'}));
    }

    var axisExclusions = exclude(
        'baseline',         // the axis baseline is adapted so is not exposed directly
        'xScale', 'yScale'  // these are set by this components
    );
    rebindAll(cartesian, xAxis, axisExclusions, prefix('x'));
    rebindAll(cartesian, yAxis, axisExclusions, prefix('y'));

    cartesian.xBaseline = function(x) {
        if (!arguments.length) {
            return xBaseline;
        }
        xBaseline = d3.functor(x);
        return cartesian;
    };
    cartesian.yBaseline = function(x) {
        if (!arguments.length) {
            return yBaseline;
        }
        yBaseline = d3.functor(x);
        return cartesian;
    };
    cartesian.chartLabel = function(x) {
        if (!arguments.length) {
            return chartLabel;
        }
        chartLabel = x;
        return cartesian;
    };
    cartesian.plotArea = function(x) {
        if (!arguments.length) {
            return plotArea;
        }
        plotArea = x;
        return cartesian;
    };
    cartesian.xLabel = function(x) {
        if (!arguments.length) {
            return xLabel;
        }
        xLabel = x;
        return cartesian;
    };
    cartesian.margin = function(x) {
        if (!arguments.length) {
            return margin;
        }
        margin = x;
        return cartesian;
    };
    cartesian.yLabel = function(x) {
        if (!arguments.length) {
            return yLabel;
        }
        yLabel = x;
        return cartesian;
    };
    cartesian.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return cartesian;
    };

    return cartesian;
}
