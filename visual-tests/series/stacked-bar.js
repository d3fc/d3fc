(function(d3, fc) {
    'use strict';

    var container = d3.select('#stacked-bar');

    function getSelectedOption(id) {
        var e = document.getElementById(id);
        return e.options[e.selectedIndex].value;
    }

    function sortData(data) {
        function total(row) {
            return d3.sum(Object.keys(row).filter(function(key) { return key !== 'State'; })
                .map(function(key) { return Number(row[key]); }));
        }
        data.sort(function(a, b) {
            return total(b) - total(a);
        });
    }

    function renderChart(data, offset, order, seriesType) {

        // see #574 - wiping out the chart each time to clear the plot-area
        container.html('');

        data = data.slice(-20);
        sortData(data);

        var spread = fc.data.spread()
            .xValueKey('State');
        var stack = d3.layout.stack()
            .values(function(d) { return d.values; })
            .offset(offset)
            .order(order);

        var series = stack(spread(data));
        series.seriesType = seriesType;
        series.crosshair = [];

        var extent = fc.util.extent().include(0);
        var yDomain = extent.fields([function(d) { return d.y + d.y0; }])(series.map(function(d) { return d.values; }));
        var xDomain = series[0].values.map(function(d) { return d.x; });

        var tooltip = fc.chart.tooltip()
            .split(70)
            .items(series.map(function(s) {
                // NOTE: I expect this code to become a helper
                return [
                    s.key,
                    function(c) {
                        return d3.format('0,000')(c.datum[s.key]);
                    }
                ];
            }));

        var tooltipContainer = fc.tool.container()
            .padding(10)
            .component(tooltip);

        var tooltipLayout = fc.layout.label(fc.layout.strategy.boundingBox())
            .position(function(d) { return [d.x, 50]; })
            .size([200, 100])
            .component(tooltipContainer);

        var xScale = d3.scale.ordinal();
        var chart = fc.chart.cartesian(
                xScale,
                d3.scale.linear())
            .xDomain(xDomain)
            .yDomain(yDomain)
            .margin({right: 50, bottom: 50});

        var stackedBar = fc.series.stacked[seriesType]()
            .xValue(function(d) { return d.x; });

        var crosshair = fc.tool.crosshair();

        var multi = fc.series.multi()
            //.key(function(d) { return d.seriesType; })
            .series([stackedBar, tooltipLayout, crosshair])
            .mapping(function(s) {
                switch (s) {
                case stackedBar:
                    return this;
                case crosshair:
                case tooltipLayout:
                    return this.crosshair;
                }
            });

        chart.plotArea(multi);

        var snap = function(point) {
            // NOTE: This code will eventually become another 'snap' helper
            var xValue = stackedBar.xValue();
            var nearest = series[0].values.map(function(d, i) {
                var diff = Math.abs(point.x - xScale(xValue(d)));
                return [diff, d, i];
            })
            .reduce(function(accumulator, value) {
                return accumulator[0] > value[0] ? value : accumulator;
            }, [Number.MAX_VALUE, null]);

            var datum = {};
            series.forEach(function(d) {
                datum[d.key] = d.values[nearest[2]].y;
            });

            return {
                datum: datum,
                x: stackedBar.xScale()(xValue(nearest[1])),
                y: point.y
            };
        };

        var pointer = fc.behaviour.pointer()
            .on('point', function(points) {
                series.crosshair = points.map(snap);
                render();
            });

        function render() {
            container.datum(series)
                .call(chart)
                .call(pointer);
        }
        render();
    }

    d3.csv('stackedBarData.csv', function(error, data) {
        function render() {
            renderChart(data,
                getSelectedOption('offset'),
                getSelectedOption('order'),
                getSelectedOption('series'));
        }
        d3.selectAll('select').on('change', render);
        render();
    });

})(d3, fc);
