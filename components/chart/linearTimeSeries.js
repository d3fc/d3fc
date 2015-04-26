(function(d3, fc) {
    'use strict';

    fc.charts.linearTimeSeries = function() {

        var xScale = d3.time.scale();
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

                var mainContainer = fc.utilities.simpleDataJoin(container,
                        'linear-time-series', [data]);
                mainContainer.enter()
                    .layout('flex', 1);

                var plotAreaContainer = mainContainer.selectOrAppend('svg', 'plot-area');
                plotAreaContainer.enter()
                    .attr('overflow', 'hidden')
                    .layout('flex', 1);

                mainContainer.selectOrAppend('rect', 'background')
                    .enter()
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var gridlinesContainer = plotAreaContainer.selectOrAppend('g', 'gridlines');

                var yAxisContainer = plotAreaContainer.selectOrAppend('g', 'y-axis');
                yAxisContainer.enter()
                    .classed('axis', true)
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0
                    });

                var seriesContainer = plotAreaContainer.selectOrAppend('g', 'series');
                seriesContainer.enter()
                    .layout({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    });

                var xAxisContainer = mainContainer.selectOrAppend('g', 'x-axis');
                xAxisContainer.enter()
                    .classed('axis', true)
                    .layout('height', 20);

                linearTimeSeries.decorate.value(mainContainer);
                linearTimeSeries.layout.value(container);

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

        linearTimeSeries.decorate = fc.utilities.property(fc.utilities.fn.noop);
        linearTimeSeries.layout = fc.utilities.property(fc.utilities.layout());
        linearTimeSeries.gridlines = fc.utilities.property(fc.scale.gridlines());
        linearTimeSeries.series = fc.utilities.property(fc.series.line());

        return linearTimeSeries;
    };

})(d3, fc);