(function(d3, fc) {
    'use strict';

    var tooltip = function() {

        var tooltip = function(selection) {

            var container = selection.enter()
                .append('g')
                .attr('class', 'info');

            container.append('rect')
                .attr({
                    width: 130,
                    height: 76,
                    fill: 'white'
                });

            container.append('text');

            container = selection.select('g.info')
                .attr('transform', function(d) {
                    var dx = Number(d.x);
                    var x = dx < 150 ? dx + 10 : dx - 150 + 10;
                    return 'translate(' + x + ',' + 10 + ')';
                });

            var tspan = container.select('text')
                .selectAll('tspan')
                .data(tooltip.items.value);

            tspan.enter()
                .append('tspan')
                .attr('x', 4)
                .attr('dy', 12);

            tspan.text(function(d) {
                return d(container.datum().datum);
            });
        };

        function format(type, value) {
            return tooltip.formatters.value[type](value);
        }

        tooltip.items = fc.utilities.property([
            function(d) { return format('date', d.date); },
            function(d) { return 'Open: ' + format('price', d.open); },
            function(d) { return 'High: ' + format('price', d.high); },
            function(d) { return 'Low: ' + format('price', d.low); },
            function(d) { return 'Close: ' + format('price', d.close); },
            function(d) { return 'Volume: ' + format('volume', d.volume); }
        ]);
        tooltip.formatters = fc.utilities.property({
            date: d3.time.format('%A, %b %e, %Y'),
            price: d3.format('.2f'),
            volume: d3.format('0,5p')
        });

        return tooltip;
    };

    var dataGenerator = fc.utilities.dataGenerator()
        .startDate(new Date(2014, 1, 1));

    var container = d3.select('#low-barrel')
        .datum(dataGenerator(250));

    var mainContainer = container.select('.main-row>td.chart')
        .append('svg')
        .style({
            width: '100%',
            height: '100%'
        });

    var volumeContainer = container.select('.volume-row>td.chart')
        .append('svg')
        .style({
            width: '100%',
            height: '100%'
        });

    var navigatorContainer = container.select('.navigator-row>td.chart')
        .append('svg')
        .style({
            width: '100%',
            height: '100%'
        });

    function mainChart(data) {
        var gridlines = fc.scale.gridlines()
            .yTicks(3);

        var candlestick = fc.series.candlestick();

        var crosshairs = fc.tools.crosshairs()
            .decorate(tooltip())
            .snap(fc.utilities.seriesPointSnap(candlestick, data));
        // .on('tracking.link', render);

        var multi = fc.series.multi()
            .series([gridlines, candlestick, crosshairs]);

        var chart = fc.charts.linearTimeSeries()
            .yDomain(fc.utilities.extent(data, 'high', 'low'))
            .yTicks(3)
            .plotArea(multi);

        return chart;
    }

    function volumeChart(data) {
        var gridlines = fc.scale.gridlines()
            .yTicks(2);

        var bar = fc.series.bar()
            .yValue(function(d) { return d.volume; });

        var multi = fc.series.multi()
            .series([gridlines, bar]);

        var chart = fc.charts.linearTimeSeries()
            .yDomain(fc.utilities.extent(data, 'volume'))
            .yTicks(2)
            .plotArea(multi);

        return chart;
    }

    function navigatorChart(data) {
        var gridlines = fc.scale.gridlines()
            .xTicks(3)
            .yTicks(0);

        var line = fc.series.line();
        var area = fc.series.area();
        var multi = fc.series.multi()
            .series([gridlines, line, area]);

        var chart = fc.charts.linearTimeSeries()
            .xDomain(fc.utilities.extent(data, 'date'))
            .yDomain(fc.utilities.extent(data, 'close'))
            .xTicks(3)
            .yTicks(0)
            .plotArea(multi);

        return chart;
    }

    function render(dateDomain) {
        // Calculate visible data to use when calculating scale domains
        var data = container.datum();
        var bisector = d3.bisector(function(d) { return d.date; });
        var visibleData = data.slice(
            bisector.left(data, dateDomain[0]),
            bisector.right(data, dateDomain[1])
        );

        var main = mainChart(visibleData)
            .xDomain(dateDomain);
        mainContainer.call(main);

        var vol = volumeChart(visibleData)
            .xDomain(dateDomain);
        volumeContainer.call(vol);

        var nav = navigatorChart(data);
        navigatorContainer.call(nav);
    }

    var maxDate = fc.utilities.extent(container.datum(), 'date')[1];
    var dateScale = d3.time.scale()
        .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate])
        .nice();
    render(dateScale.domain());

})(d3, fc);
