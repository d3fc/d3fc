(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            barWidth = 20.0,
            yValueKeys = [],
            visitor = function(selection, data) { },
            xValueKey = 'date';

        var stackedBar = function(selection) {
            var series, container;

            // takes an object with values associated with each property, and
            // converts it into an array of values. Each value has the xValue associated
            // with it.
            //
            // For example, this object:
            //
            // obj = { county: 'North Tyneside', labour: 23, conservative: 55 }
            //
            // becomes this ...
            //
            // [
            //   { xValue: 'North Tyneside', name: 'labour', previousValue: 0, currentValue: 23},
            //   { xValue: 'North Tyneside', name: 'conservative', previousValue: 23, currentValue: 78},
            // ]
            function objectDatapointToArray(obj) {
                var values = [];
                var yTotal = 0;
                var xVal = obj[xValueKey];
                for (var propertyName in obj) {
                    if (obj.hasOwnProperty(propertyName) && propertyName !== xValueKey) { // be quiet JSHint!
                        var previous = yTotal;
                        yTotal += +obj[propertyName];
                        values.push({
                            'name': propertyName,
                            'previousValue': previous,
                            'currentValue': yTotal,
                            'xValue': xVal
                        });
                    }
                }
                return values;
            }

            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                container = d3.select(this)
                    .selectAll('.stacked-bar-series')
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed('stacked-bar-series', true);

                // create a data-join for each item in the array
                series = container
                    .selectAll('g')
                    .data(data);

                // enter
                series.enter()
                    .append('g');

                // exit
                series.exit()
                    .remove();

                // create a join for each bar
                var bar = series.selectAll('rect')
                    .data(function(d) { return objectDatapointToArray(d); })
                    .enter()
                    .append('rect');

                // update
                bar.attr('x', function(d) {
                        return xScale(d.xValue) + xScale.rangeBand() / 2 - barWidth / 2; }
                    )
                    .attr('y', function(d) {
                        return yScale(d.currentValue); }
                    )
                    .attr('width', barWidth)
                    .attr('height', function(d) {
                        return yScale(d.previousValue) - yScale(d.currentValue);
                    });

                bar.each(function(d, i) {
                    var selection = d3.select(this);
                    visitor(selection, d);
                });

            });
        };

        stackedBar.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return stackedBar;
        };

        stackedBar.visitor = function(value) {
            if (!arguments.length) {
                return visitor;
            }
            visitor = value;
            return stackedBar;
        };

        stackedBar.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return stackedBar;
        };


        stackedBar.yValueKeys = function(value) {
            if (!arguments.length) {
                return yValueKeys;
            }
            yValueKeys = value;
            return stackedBar;
        };

        stackedBar.xValueKey = function(value) {
            if (!arguments.length) {
                return xValueKey;
            }
            xValueKey = value;
            return stackedBar;
        };

        return stackedBar;
    };
}(d3, fc));
