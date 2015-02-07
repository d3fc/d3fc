(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackedBar = function(selection) {
            var container;

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
                var xVal = obj[stackedBar.xValueKey.value];
                for (var propertyName in obj) {
                    if (obj.hasOwnProperty(propertyName) && propertyName !== stackedBar.xValueKey.value) {
                        var previous = yTotal;
                        yTotal += Number(obj[propertyName]);
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
                container = d3.select(this);

                var keyFunction = function(d) {
                    return d[stackedBar.xValueKey.value];
                };
                var g = fc.utilities.simpleDataJoin(container, 'stacked-bar', data, keyFunction);


                // create a join for each bar
                var bar = g.selectAll('rect')
                    .data(function(d) { return objectDatapointToArray(d); })
                    .enter()
                    .append('rect');

                // compute the bar width from the x values
                var xValues = data.map(function(d) {
                    return stackedBar.xScale.value(d[stackedBar.xValueKey.value]);
                });
                var width = stackedBar.barWidth.value(xValues);

                // update
                bar.attr('x', function(d) {
                        return stackedBar.xScale.value(d.xValue) - width / 2; }
                    )
                    .attr('y', function(d) {
                        return stackedBar.yScale.value(d.currentValue); }
                    )
                    .attr('width', width)
                    .attr('height', function(d) {
                        return stackedBar.yScale.value(d.previousValue) - stackedBar.yScale.value(d.currentValue);
                    });

                stackedBar.decorate.value(bar);

            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        stackedBar.xValueKey = fc.utilities.property('name');

        return stackedBar;
    };
}(d3, fc));
