(function(d3, fc) {
    'use strict';

    fc.charts.sparkline = function() {

        // creates an array with four elements, representing the high, low, open and close
        // values of the given array
        function highLowOpenClose(data) {
            var xValueAccessor = sparkline.xValue(),
                yValueAccessor = sparkline.yValue();

            var high = d3.max(data, yValueAccessor);
            var low = d3.min(data, yValueAccessor);

            function elementWithYValue(value) {
                return data.filter(function(d) {
                    return yValueAccessor(d) === value;
                })[0];
            }

            return [{
                    x: xValueAccessor(data[0]),
                    y: yValueAccessor(data[0])
                }, {
                    x: xValueAccessor(elementWithYValue(high)),
                    y: high
                }, {
                    x: xValueAccessor(elementWithYValue(low)),
                    y: low
                }, {
                    x: xValueAccessor(data[data.length - 1]),
                    y: yValueAccessor(data[data.length - 1])
                }];
        }

        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var radius = 2;
        var line = fc.series.line();

        // configure the point series to render the data from the
        // highLowOpenClose function
        var point = fc.series.point()
            .xValue(function(d) { return d.x; })
            .yValue(function(d) { return d.y; })
            .decorate(function(sel) {
                sel.attr('class', function(d, i) {
                    switch (i) {
                        case 0: return 'open';
                        case 1: return 'high';
                        case 2: return 'low';
                        case 3: return 'close';
                    }
                });
            });

        var multi = fc.series.multi()
            .series([line, point])
            .mapping(function(data, series) {
                switch (series) {
                    case point:
                        return highLowOpenClose(data);
                    default:
                        return data;
                }
            });

        var sparkline = function(selection) {

            point.radius(radius);

            selection.each(function(data) {

                var container = d3.select(this);
                var dimensions = fc.utilities.innerDimensions(this);
                var margin = radius;

                xScale.range([margin, dimensions.width - margin]);
                yScale.range([dimensions.height - margin, margin]);

                multi.xScale(xScale)
                    .yScale(yScale);

                container.call(multi);

            });
        };

        fc.utilities.rebind(sparkline, xScale, {
            xDiscontinuityProvider: 'discontinuityProvider',
            xDomain: 'domain'
        });

        fc.utilities.rebind(sparkline, yScale, {
            yDomain: 'domain'
        });

        fc.utilities.rebind(sparkline, line, 'xValue', 'yValue');

        sparkline.xScale = function() { return xScale; };
        sparkline.yScale = function() { return yScale; };
        sparkline.radius = function(x) {
            if (!arguments.length) {
                return radius;
            }
            radius = x;
            return sparkline;
        };

        return sparkline;
    };

})(d3, fc);
