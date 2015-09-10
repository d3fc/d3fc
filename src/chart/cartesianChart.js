(function(d3, fc) {
    'use strict';

    fc.chart.cartesianChart = function(xScale, yScale) {

        xScale = xScale || d3.scale.linear();
        yScale = yScale || d3.scale.linear();

        var plotAreaMargin = {
                top: 20,
                bottom: 30,
                left: 0,
                right: 40
            },
            yAxisLabel = 'y-axis',
            xAxisLabel = 'x-axis',
            chartLabel = 'Chart',
            plotArea = fc.series.line(),
            decorate = fc.util.fn.noop;

        var xAxis = fc.series.axis()
            .orient('bottom')
            .baseline(function() {
                var domain = yScale.domain();
                return xAxis.orient() === 'bottom' ? domain[0] : domain[1];
            });

        var yAxis = fc.series.axis()
            .orient('right')
            .baseline(function() {
                var domain = xScale.domain();
                return yAxis.orient() === 'right' ? domain[1] : domain[0];
            });

        var axesSeries = fc.series.multi()
            .series([xAxis, yAxis]);

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
                        <g layout-css="height: 0; width: 0"> \
                            <text class="label"/> \
                        </g> \
                    </g> \
                    <g class="y-axis"> \
                        <g layout-css="height: 0; width: 0"> \
                            <text class="label" transform="rotate(-90)"/> \
                        </g> \
                    </g> \
                    <g class="x-axis"> \
                        <g layout-css="height: 0; width: 0"> \
                            <text class="label"/> \
                        </g> \
                    </g> \
                    <g class="plot-area-container"> \
                        <svg class="axes-container" \
                            layout-css="position: absolute; top: 0; bottom: 0; left: 0; right: 0"/> \
                        <svg class="plot-area" \
                            layout-css="position: absolute; top: 0; bottom: 0; left: 0; right: 0"/> \
                    </g>');

                var margin = fc.util.expandMargin(plotAreaMargin);

                svg.select('.plot-area-container')
                    .layout({
                        position: 'absolute',
                        top: margin.top,
                        left: margin.left,
                        bottom: margin.bottom,
                        right: margin.right
                    });

                svg.select('.title')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        alignItems: 'center',
                        left: margin.left,
                        right: margin.right
                    });

                var yAxisLayout = {
                    position: 'absolute',
                    top: margin.top,
                    bottom: margin.bottom,
                    alignItems: 'center',
                    flexDirection: 'row'
                };
                if (yAxis.orient() === 'right') {
                    yAxisLayout.right = 0;
                } else {
                    yAxisLayout.left = 0;
                }
                svg.select('.y-axis')
                    .layout(yAxisLayout);

                var xAxisLayout = {
                    position: 'absolute',
                    left: margin.left,
                    right: margin.right,
                    alignItems: 'center'
                };
                if (xAxis.orient() === 'bottom') {
                    xAxisLayout.bottom = 0;
                } else {
                    xAxisLayout.top = 0;
                }
                svg.select('.x-axis')
                    .layout(xAxisLayout);

                // perform the flexbox / css layout
                container.layout();

                // update the label text
                svg.select('.title .label')
                    .text(chartLabel);

                svg.select('.y-axis .label')
                    .text(yAxisLabel);

                svg.select('.x-axis .label')
                    .text(xAxisLabel);

                // set the axis ranges
                var plotAreaContainer = svg.select('.plot-area');
                xScale.range([0, plotAreaContainer.layout('width')]);
                yScale.range([plotAreaContainer.layout('height'), 0]);

                // render the axes
                var axesContainer = svg.select('.axes-container');
                axesSeries.xScale(xScale)
                    .yScale(yScale);
                axesContainer.call(axesSeries);

                // render the plot area
                plotArea.xScale(xScale)
                    .yScale(yScale);
                plotAreaContainer.call(plotArea);

                decorate(svg, data, index);
            });
        };

        var scaleExclusions = [
            'range', 'rangeRound', // the scale range is set via the component layout
            'tickFormat'           // use axis.tickFormat instead
        ];
        fc.util.rebindAll(cartesianChart, xScale, 'x', scaleExclusions);
        fc.util.rebindAll(cartesianChart, yScale, 'y', scaleExclusions);

        fc.util.rebindAll(cartesianChart, xAxis, 'x');
        fc.util.rebindAll(cartesianChart, yAxis, 'y');

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
        cartesianChart.xAxisLabel = function(x) {
            if (!arguments.length) {
                return xAxisLabel;
            }
            xAxisLabel = x;
            return cartesianChart;
        };
        cartesianChart.plotAreaMargin = function(x) {
            if (!arguments.length) {
                return plotAreaMargin;
            }
            plotAreaMargin = x;
            return cartesianChart;
        };
        cartesianChart.yAxisLabel = function(x) {
            if (!arguments.length) {
                return yAxisLabel;
            }
            yAxisLabel = x;
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
