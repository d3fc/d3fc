(function(d3, fc) {
    'use strict';

    fc.series.multi = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            series = [],
            mapping = fc.utilities.fn.identity;

        var dataJoin = fc.utilities.dataJoin()
            .children(true)
            .selector('g.multi')
            .element('g')
            .attrs({'class': 'multi'})
            .key(function(d) { return d.__series__; });

        var multi = function(selection) {

            selection.each(function(data) {

                // Prototypically inherit the mapped data for a series and augment the object
                // with a series property. This allows us to data-bind without requiring a nested
                // element (i.e. an outer element bound to the series and an inner element bound
                // to the data containing the series).

                var seriesData = series.map(function(series, i) {
                    return Object.create(mapping(data, series, i), {
                        __series__: {
                            value: series
                        }
                    });
                });

                dataJoin(this, seriesData)
                    .each(function(d, i) {

                        var series = d.__series__;

                        (series.xScale || series.x).call(series, xScale);
                        (series.yScale || series.y).call(series, yScale);

                        d3.select(this)
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
