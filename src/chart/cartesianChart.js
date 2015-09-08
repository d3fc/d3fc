(function(d3, fc) {
    'use strict';

    fc.chart.cartesianChart = function(xScale, yScale) {

        xScale = xScale || d3.scale.linear();
        yScale = yScale || d3.scale.linear();

        var xAxisHeight = 20,
            yAxisWidth = 40,
            yAxisLabelWidth = 20,
            xAxisLabelHeight = 20,
            titleHeight = 20,
            yAxisLabel = 'y-axis',
            xAxisLabel = 'x-axis',
            title = 'Chart Title',
            plotArea = fc.series.line(),
            decorate = fc.util.fn.noop;

        var xAxis = fc.svg.axis()
            .scale(xScale)
            .orient('bottom');

        var yAxis = fc.svg.axis()
            .scale(yScale)
            .orient('right');

        var containerDataJoin = fc.util.dataJoin()
            .selector('svg.cartesian-chart')
            .element('svg')
            .attr({'class': 'cartesian-chart', 'layout-css': 'flex: 1'});

        var cartesianChart = function(selection) {

            selection.each(function(data, index) {

                var container = d3.select(this);

                var svg = containerDataJoin(container, [data]);
                svg.enter().html(
                    '<g class="title"> \
                        <text class="label" layout-css="height: 0; width: 0"/> \
                    </g> \
                    <g layout-css="flex: 1; flexDirection: row"> \
                        <g class="y-axis left"> \
                            <g class="label-container"> \
                                <g layout-css="height: 0; width: 0"> \
                                    <text class="label" transform="rotate(-90)"/> \
                                </g> \
                            </g> \
                            <g class="padding"/> \
                            <g class="axis" layout-css="width: 0"/> \
                        </g> \
                        <svg class="plot-area" layout-css="flex: 1"/> \
                        <g class="y-axis right"> \
                            <g class="axis" layout-css="width: 0"/> \
                            <g class="padding"/> \
                            <g class="label-container"> \
                                <g layout-css="height: 0; width: 0"> \
                                    <text class="label" transform="rotate(-90)"/> \
                                </g> \
                            </g> \
                        </g> \
                    </g> \
                    <g class="x-axis"> \
                        <g class="axis"/> \
                        <g class="label-container"> \
                            <text class="label" layout-css="height: 0; width: 0"/> \
                        </g> \
                    </g>');

                // configure the y axis containers based on y-axis orientation
                var opposingOrientation = yAxis.orient() === 'left' ? 'right' : 'left';

                var totalYAxisWidth = yAxisWidth + yAxisLabelWidth;
                svg.select('.y-axis.' + yAxis.orient())
                    .layout({'width': totalYAxisWidth, 'flexDirection': 'row'});

                svg.select('.y-axis.' + yAxis.orient() + ' .label-container')
                    .layout({'width': yAxisLabelWidth, 'alignItems': 'center', 'justifyContent': 'center'});

                svg.select('.y-axis.' + yAxis.orient() + ' .padding')
                    .layout('width', yAxisWidth);

                // hide the opposing axis by making it zero width
                svg.select('.y-axis.' + opposingOrientation)
                    .layout('width', 0);

                // position the x axis and x label
                var marginLeft = yAxis.orient() === 'left' ? totalYAxisWidth : 0;
                var marginRight = yAxis.orient() === 'left' ? 0 : totalYAxisWidth;
                svg.select('.x-axis')
                    .layout({'height': xAxisHeight + xAxisLabelHeight, 'flexDirection': 'column',
                        'marginLeft': marginLeft, 'marginRight': marginRight});

                svg.select('.x-axis .label-container')
                    .layout({'height': xAxisLabelHeight, 'alignItems': 'center', 'justifyContent': 'center'});

                svg.select('.x-axis .axis')
                    .layout('height', xAxisHeight);

                // position the title
                svg.select('.title')
                    .layout({'height': titleHeight, 'alignItems': 'center', 'justifyContent': 'center',
                        'marginLeft': marginLeft, 'marginRight': marginRight});

                // perform the flexbox / css layout
                container.layout();

                // update the label text
                svg.select('.title .label')
                    .text(title);

                svg.select('.x-axis .label')
                    .text(xAxisLabel);

                svg.select('.y-axis.' + yAxis.orient() + ' .label')
                    .text(yAxisLabel);

                svg.select('.y-axis.' + opposingOrientation  + ' .label')
                    .text('');

                var plotAreaContainer = svg.select('.plot-area');

                // configure the scales and render the axes
                var xAxisContainer = container.select('.x-axis .axis');
                xScale.range([0, plotAreaContainer.layout('width')]);
                xAxisContainer.call(xAxis);

                var yAxisContainer = svg.select('.y-axis.' + yAxis.orient() + ' .axis');
                yScale.range([plotAreaContainer.layout('height'), 0]);
                yAxisContainer.call(yAxis);

                // remove the y axis from the opposing orientation
                svg.select('.y-axis.' + opposingOrientation + ' .axis')
                    .selectAll('*').remove();

                // render the plot area
                plotArea.xScale(xScale)
                    .yScale(yScale);
                plotAreaContainer.call(plotArea);

                decorate(svg, data, index);
            });
        };

        var scaleReboundProperties = ['nice', 'domain'];

        fc.util.rebindProperties(cartesianChart, xScale, scaleReboundProperties, 'x');
        fc.util.rebindProperties(cartesianChart, yScale, scaleReboundProperties, 'y');

        var axisReboundProperties = ['ticks', 'tickValues', 'tickSize', 'innerTickSize',
            'outerTickSize', 'tickPadding', 'tickFormat', 'orient', 'decorate'];

        fc.util.rebindProperties(cartesianChart, xAxis, axisReboundProperties, 'x');
        fc.util.rebindProperties(cartesianChart, yAxis, axisReboundProperties, 'y');

        cartesianChart.titleHeight = function(x) {
            if (!arguments.length) {
                return titleHeight;
            }
            titleHeight = x;
            return cartesianChart;
        };
        cartesianChart.title = function(x) {
            if (!arguments.length) {
                return title;
            }
            title = x;
            return cartesianChart;
        };
        cartesianChart.plotArea = function(x) {
            if (!arguments.length) {
                return plotArea;
            }
            plotArea = x;
            return cartesianChart;
        };
        cartesianChart.xAxisLabel = function(x) {
            if (!arguments.length) {
                return xAxisLabel;
            }
            xAxisLabel = x;
            return cartesianChart;
        };
        cartesianChart.yAxisLabel = function(x) {
            if (!arguments.length) {
                return yAxisLabel;
            }
            yAxisLabel = x;
            return cartesianChart;
        };
        cartesianChart.xAxisHeight = function(x) {
            if (!arguments.length) {
                return xAxisHeight;
            }
            xAxisHeight = x;
            return cartesianChart;
        };
        cartesianChart.yAxisWidth = function(x) {
            if (!arguments.length) {
                return yAxisWidth;
            }
            yAxisWidth = x;
            return cartesianChart;
        };
        cartesianChart.yAxisLabelWidth = function(x) {
            if (!arguments.length) {
                return yAxisLabelWidth;
            }
            yAxisLabelWidth = x;
            return cartesianChart;
        };
        cartesianChart.xAxisLabelHeight = function(x) {
            if (!arguments.length) {
                return xAxisLabelHeight;
            }
            xAxisLabelHeight = x;
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
    };

})(d3, fc);
