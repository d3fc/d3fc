(function(d3, fc) {
    'use strict';

    function renderPointChart(data) {
        var width = 700, height = 250;

        var container = d3.select('#grouped')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // see #574 - wiping out the chart each time to clear the plot-area
        container.html('');

        data = data.slice(-10);

        var spread = fc.data.spread()
            .xValueKey('State');

        var series = spread(data);

        var extent = fc.util.extent().include(0);
        var yDomain = extent.fields([
            function(s) { return s.values.map(function(d) { return d.y; }); }
        ])(series);
        var xDomain = series[0].values.map(function(d) { return d.x; });

        var chart = fc.chart.cartesian(
                d3.scale.ordinal(),
                d3.scale.linear())
            .xDomain(xDomain)
            .yDomain(yDomain)
            .margin({top: 25, right: 25, bottom: 25, left: 25});

        var seriesToGroup = fc.series.point();

        var groupedSeries = fc.series.grouped(seriesToGroup);

        chart.plotArea(groupedSeries);

        container.datum(series)
            .call(chart);
    }

    function renderCandleStick(data) {
        var width = 700, height = 250;

        var container = d3.select('#grouped')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // see #574 - wiping out the chart each time to clear the plot-area
        container.html('');

        // Create scale for x axis
        var dateScale = fc.scale.dateTime()
            .domain(fc.util.extent().fields(['date']).pad([0.1, 0.1])(data))
            .range([0, width])
            .nice();

        var highest = data[0].aapl.high;
        var lowest = data[0].aapl.low;

        // Get the extent of all the data
        data.forEach(function(datum) {
            if (datum.aapl.high > highest) {
                highest = datum.aapl.high;
            }
            if (datum.msft.high > highest) {
                highest = datum.msft.high;
            }
            if (datum.aapl.low < lowest) {
                lowest = datum.aapl.low;
            }
            if (datum.msft.low < lowest) {
                lowest = datum.msft.low;
            }
        });

        // Create scale for y axis
        var priceScale = d3.scale.linear()
            .domain([lowest, highest])
            .range([height, 0])
            .nice();

        var spread = fc.data.spread()
            .xValueKey('date')
            .yValue(function(d, key) { return d[key]; });

        var series = spread(data);

        var chart = fc.chart.cartesian(
                dateScale,
                priceScale)
            .margin({top: 25, right: 25, bottom: 25, left: 25});

        var seriesToGroup = fc.series.candlestick();

        var groupedSeries = fc.series.grouped(seriesToGroup)
            .xValue(function(d) { return d.x; })
            .yOpenValue(function(d) { return d.y.open; })
            .yHighValue(function(d) { return d.y.high; })
            .yLowValue(function(d) { return d.y.low; })
            .yCloseValue(function(d) { return d.y.close; });

        chart.plotArea(groupedSeries);

        container.datum(series)
            .call(chart);
    }

    function renderSeries(series) {
        d3.select('#grouped').selectAll('svg').remove();

        if (series === 'point') {
            d3.csv('stackedBarData.csv', function(error, stateData) {
                renderPointChart(stateData);
            });
        } else {
            d3.csv('stackedStockData.csv')
                .row(function(d) {
                    var data = {
                        date: new Date(d.Date),
                        aapl: { close: parseFloat(d.AAPLClose), high: parseFloat(d.AAPLHigh), low: parseFloat(d.AAPLLow), open: parseFloat(d.AAPLOpen) },
                        msft: { close: parseFloat(d.MSFTClose), high: parseFloat(d.MSFTHigh), low: parseFloat(d.MSFTLow), open: parseFloat(d.MSFTOpen) }
                    };
                    return data;
                })
                .get(function(error, data) { renderCandleStick(data); });
        }
    }

    renderSeries('point');

    document.getElementById('point')
        .addEventListener('change', function() {
            renderSeries('point');
        });

    document.getElementById('candlestick')
        .addEventListener('change', function() {
            renderSeries('candlestick');
        });

})(d3, fc);
