(function(d3, fc) {
    'use strict';

    fc.charts.linearTimeSeries = function() {

        var xAxisHeight = 20;
        var plotArea = fc.series.line();
        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        var linearTimeSeries = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var background = container.selectAll('rect.background')
                    .data([data]);
                background.enter()
                    .append('rect')
                    .attr('class', 'background')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: xAxisHeight,
                        left: 0
                    });

                var plotAreaContainer = container.selectAll('svg.plot-area')
                    .data([data]);
                plotAreaContainer.enter()
                    .append('svg')
                    .attr({
                        'class': 'plot-area',
                        'overflow': 'hidden'
                    })
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var xAxisContainer = container.selectAll('g.x-axis')
                    .data([data]);
                xAxisContainer.enter()
                    .append('g')
                    .attr('class', 'axis x-axis')
                    .layout({
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        right: 0,
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
                        bottom: xAxisHeight
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

        fc.utilities.rebind(linearTimeSeries, xScale, {
            xDiscontinuityProvider: 'discontinuityProvider',
            xDomain: 'domain',
            xNice: 'nice'
        });

        fc.utilities.rebind(linearTimeSeries, yScale, {
            yDomain: 'domain',
            yNice: 'nice'
        });

        fc.utilities.rebind(linearTimeSeries, xAxis, {
            xTicks: 'ticks'
        });

        fc.utilities.rebind(linearTimeSeries, yAxis, {
            yTicks: 'ticks'
        });

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

        return linearTimeSeries;
    };

})(d3, fc);
