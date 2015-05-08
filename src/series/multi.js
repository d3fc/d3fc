(function(d3, fc) {
    'use strict';

    fc.series.multi = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            series = [],
            mapping = fc.utilities.fn.identity;

        var multi = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var g = container.selectAll('g.multi-outer')
                    .data(series);

                g.enter()
                    .append('g')
                    .attr('class', 'multi-outer')
                    .append('g')
                    .attr('class', 'multi-inner');

                g.exit()
                    .remove();

                g.select('g.multi-inner')
                    .each(function(d, i) {

                        var series = d3.select(this.parentNode)
                            .datum();

                        (series.xScale || series.x).call(series, xScale);
                        (series.yScale || series.y).call(series, yScale);

                        d3.select(this)
                            .datum(mapping(data, series, i))
                            .call(series);
                    });
            });
        };

        multi.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return multi;
        };
        multi.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return multi;
        };
        multi.series = function(x) {
            if (!arguments.length) {
                return series;
            }
            series = x;
            return multi;
        };
        multi.mapping = function(x) {
            if (!arguments.length) {
                return mapping;
            }
            mapping = x;
            return multi;
        };

        return multi;
    };
}(d3, fc));
