(function(d3, fc) {
    'use strict';

    fc.chart.linearTimeSeries = function() {

        var xAxisHeight = 20;
        var yAxisWidth = 0;
        var plotArea = fc.series.line();
        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var xAxis = fc.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yAxis = fc.svg.axis()
            .scale(yScale)
            .orient('left');

        var linearTimeSeries = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var plotAreaLayout = {
                    position: 'absolute',
                    top: 0,
                    right: yAxisWidth,
                    bottom: xAxisHeight,
                    left: 0
                };

                var background = container.selectAll('rect.background')
                    .data([data]);
                background.enter()
                    .append('rect')
                    .attr('class', 'background')
                    .layout(plotAreaLayout);

                var plotAreaContainer = container.selectAll('svg.plot-area')
                    .data([data]);
                plotAreaContainer.enter()
                    .append('svg')
                    .attr({
                        'class': 'plot-area'
                    })
                    .layout(plotAreaLayout);

                var xAxisContainer = container.selectAll('g.x-axis')
                    .data([data]);
                xAxisContainer.enter()
                    .append('g')
                    .attr('class', 'axis x-axis')
                    .layout({
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        right: yAxisWidth,
                        height: xAxisHeight
                    });

                var yAxisContainer = container.selectAll('g.y-axis')
                    .data([data]);
                yAxisContainer.enter()
                    .append('g')
                    .attr('class', 'axis y-axis')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: xAxisHeight,
                        width: yAxisWidth
                    });

                container.layout();

                xScale.range([0, xAxisContainer.layout('width')]);

                yScale.range([yAxisContainer.layout('height'), 0]);

                xAxisContainer.call(xAxis);

                yAxisContainer.call(yAxis);

                plotArea.xScale(xScale)
                    .yScale(yScale);
                plotAreaContainer.call(plotArea);

            });
        };

        fc.util.rebind(linearTimeSeries, xScale, {
            xDiscontinuityProvider: 'discontinuityProvider',
            xDomain: 'domain',
            xNice: 'nice'
        });

        fc.util.rebind(linearTimeSeries, yScale, {
            yDomain: 'domain',
            yNice: 'nice'
        });

        var axisReboundProperties = ['ticks', 'tickValues', 'tickSize', 'innerTickSize',
            'outerTickSize', 'tickPadding', 'tickFormat', 'orient', 'decorate'];

        fc.util.rebindProperties(linearTimeSeries, xAxis, axisReboundProperties, 'x');
        fc.util.rebindProperties(linearTimeSeries, yAxis, axisReboundProperties, 'y');

        linearTimeSeries.xScale = function() { return xScale; };
        linearTimeSeries.yScale = function() { return yScale; };
        linearTimeSeries.plotArea = function(x) {
            if (!arguments.length) {
                return plotArea;
            }
            plotArea = x;
            return linearTimeSeries;
        };
        linearTimeSeries.xAxisHeight = function(x) {
            if (!arguments.length) {
                return xAxisHeight;
            }
            xAxisHeight = x;
            return linearTimeSeries;
        };
        linearTimeSeries.yAxisWidth = function(x) {
            if (!arguments.length) {
                return yAxisWidth;
            }
            yAxisWidth = x;
            return linearTimeSeries;
        };

        return linearTimeSeries;
    };

})(d3, fc);
