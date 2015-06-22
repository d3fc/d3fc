(function(d3, fc) {
    'use strict';

    // The multi series does some data-join gymnastics to ensure we don't -
    // * Create unnecessary intermediate DOM nodes
    // * Manipulate the data specified by the user
    // This is achieved by data joining the series array to the container but
    // overriding where the series value is stored on the node (__series__) and
    // forcing the node datum (__data__) to be the user supplied data (via mapping).

    fc.series.multi = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            series = [],
            mapping = fc.util.fn.context,
            key = fc.util.fn.index;

        var dataJoin = fc.util.dataJoin()
            .children(true)
            .selector('g.multi')
            .element('g')
            .attrs({'class': 'multi'})
            .key(function(d, i) {
                // This function is invoked twice, the first pass is to pull the key
                // value from the DOM nodes and the second pass is to pull the key
                // value from the data values.
                // As we store the series as an additional property on the node, we
                // look for that first and if we find it assume we're being called
                // during the first pass. Otherwise we assume it's the second pass
                // and pull the series from the data value.
                var series = this.__series__ || d;
                return key.call(this, series, i);
            });

        var multi = function(selection) {

            selection.each(function(data) {

                dataJoin(this, series)
                    .each(function(series, i) {

                        // We must always assign the series to the node, as the order
                        // may have changed. N.B. in such a case the output is most
                        // likely garbage (containers should not be re-used) but by
                        // doing this we at least make it debuggable garbage :)
                        this.__series__ = series;

                        (series.xScale || series.x).call(series, xScale);
                        (series.yScale || series.y).call(series, yScale);

                        d3.select(this)
                            .datum(mapping.call(data, series, i))
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
        multi.key = function(x) {
            if (!arguments.length) {
                return key;
            }
            key = x;
            return multi;
        };

        return multi;
    };
}(d3, fc));
