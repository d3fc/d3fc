---
layout: default
title: Horizon Chart
tag:
    - playground
example-script: horizon.js
example-javascript: |
    /* global d3,fc */
    var quandl = fc.data.feed.quandl()
    //    .apiKey(<Enter your key>) // Enter your key here
        .start(new Date('2015-06-01'))
        .database('YAHOO')
        .dataset('DATA');

    function createSeries(sign, minValue, maxValue, domainMax) {
        return fc.series.area()
            .yValue(function(d) {
                var value = (d.pctReturn * sign) - minValue;
                return value < 0 ? undefined : value;
            })
            .decorate(function(sel) {
                sel.enter()
                    .style('fill', d3.hsl(
                        sign === -1 ? 0 : 240,
                        1 - maxValue / domainMax,
                        1 - maxValue / domainMax
                    ));
            });
    }

    quandl(function(error, data) {
        // Create returns
        data.forEach(function(d, i, arr) {
            d.pctReturn = (d['adjusted Close'] / arr[0]['adjusted Close'] - 1) * 100;
        });

        var step = 10;

        // Get Domain
        var domain = fc.util.extent(data, 'pctReturn');
        domain[0] = Math.min(0, Math.floor(domain[0] / step) * step);
        domain[1] = Math.max(0, Math.ceil(domain[1] / step) * step);
        var maxStep = Math.max(-domain[0], domain[1]);

        var chart = fc.chart.linearTimeSeries()
            .xDomain(fc.util.extent(data, 'date'))
            .yDomain([0, step]);

        var multi = fc.series.multi();
        var series = multi.series();
        series.push(fc.annotation.gridline());

        // Done as two passes as need to control order of both positive and negative series
        for (var range = 0; range < maxStep; range += step) {
            if (range < domain[1]) {
                series.push(createSeries(1, range, range + step, maxStep));
            }
            if (range < -domain[0]) {
                series.push(createSeries(-1, range, range + step, maxStep));
            }
        }

        chart.plotArea(multi);

        d3.select('#chart')
            .datum(data)
            .call(chart);
    });

---
    <svg id="chart" width="100%" height="300"></svg>
