(function(d3, fc) {
    'use strict';

    fc.charts.linearTimeSeries = function() {

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

                var mainContainer = container.selectAll('svg')
                    .data([data]);
                mainContainer.enter()
                    .append('svg')
                    .attr('overflow', 'hidden')
                    .layout('flex', 1);

                var background = mainContainer.selectAll('rect.background')
                    .data([data]);
                background.enter()
                    .append('rect')
                    .attr('class', 'background')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var gridlinesContainer = mainContainer.selectAll('g.gridlines')
                    .data([data]);
                gridlinesContainer.enter()
                    .append('g')
                    .attr('class', 'gridlines');

                var yAxisContainer = mainContainer.selectAll('g.y-axis')
                    .data([data]);
                yAxisContainer.enter()
                    .append('g')
                    .attr('class', 'axis y-axis')
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0
                    });

                var seriesContainer = mainContainer.selectAll('g.series')
                    .data([data]);
                seriesContainer.enter()
                    .append('g')
                    .attr('class', 'series')
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
                    .layout('height', 20);

                container.layout();

                xScale.range([0, xAxisContainer.layout('width')]);

                yScale.range([yAxisContainer.layout('height'), 0]);

                xAxisContainer.call(xAxis);

                yAxisContainer.call(yAxis);

                var gridlines = linearTimeSeries.gridlines.value;
                gridlines.xScale(xScale)
                    .yScale(yScale);
                gridlinesContainer.call(gridlines);

                var series = linearTimeSeries.series.value;
                series.xScale(xScale)
                    .yScale(yScale);
                seriesContainer.call(series);

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

        linearTimeSeries.gridlines = fc.utilities.property(fc.scale.gridlines());
        linearTimeSeries.series = fc.utilities.property(fc.series.line());

        return linearTimeSeries;
    };

})(d3, fc);