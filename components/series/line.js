(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        var xValue = fc.utilities.valueAccessor('date'),
            yValue = fc.utilities.valueAccessor('close'),
            xScale = fc.scale.dateTime(),
            yScale = fc.scale.linear(),
            underFill = true,
            css = 'line-series';

        var line = function(selection) {

            var area;

            if (underFill) {
                area = d3.svg.area()
                    .x(function(d) { return xScale(xValue(d)); })
                    .y0(yScale(0));
            }

            var line = d3.svg.line();
            line.x(function(d) { return xScale(xValue(d)); });

            selection.each(function(data) {


                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                var container = d3.select(this)
                    .selectAll('.' + css)
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed(css, true);

                if (underFill) {
                    area.y1(function(d) { return yScale(yValue(d)); });

                    var areapath = container
                        .selectAll('.area')
                        .data([data]);

                    // enter
                    areapath.enter()
                        .append('path');

                    // update
                    areapath.attr('d', area)
                        .classed('area', true);

                    // exit
                    areapath.exit()
                        .remove();
                }

                line.y(function(d) { return yScale(yValue(d)); });
                var linepath = container
                    .selectAll('.line')
                    .data([data]);

                // enter
                linepath.enter()
                    .append('path');

                // update
                linepath.attr('d', line)
                    .classed('line', true);

                // exit
                linepath.exit()
                    .remove();
            });
        };

        line.xValue = function(value) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = value;
            return line;
        };

        line.yValue = function(value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return line;
        };

        line.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return line;
        };

        line.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return line;
        };

        line.underFill = function(value) {
            if (!arguments.length) {
                return underFill;
            }
            underFill = value;
            return line;
        };

        return line;
    };
}(d3, fc));