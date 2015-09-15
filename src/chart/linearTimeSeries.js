import d3 from 'd3';
import axis from '../svg/axis';
import dateTime from '../scale/dateTime';
import '../layout/layout'; // import side-effects
import line from '../series/line';
import {rebind, rebindAll} from '../util/rebind';

export default function() {

    var xAxisHeight = 20;
    var yAxisWidth = 0;
    var plotArea = line();
    var xScale = dateTime();
    var yScale = d3.scale.linear();
    var xAxis = axis()
        .scale(xScale)
        .orient('bottom');
    var yAxis = axis()
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

    rebind(linearTimeSeries, xScale, {
        xDiscontinuityProvider: 'discontinuityProvider',
        xDomain: 'domain',
        xNice: 'nice'
    });

    rebind(linearTimeSeries, yScale, {
        yDomain: 'domain',
        yNice: 'nice'
    });

    // Exclude scale when rebinding the axis properties because this component
    // is responsible for providing the required scale.
    rebindAll(linearTimeSeries, xAxis, 'x', 'scale');
    rebindAll(linearTimeSeries, yAxis, 'y', 'scale');

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
}
