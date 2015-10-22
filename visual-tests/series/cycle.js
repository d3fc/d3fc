(function(d3, fc) {
    'use strict';

    // Data taken from http://data.giss.nasa.gov/gistemp/graphs_v3/Fig.C.txt
    // Monthly Mean Surface Temperature Anomaly (C)
    d3.csv('cycle-nasa-temp-data.csv')
        .row(function(d) {
            Object.keys(d)
                .forEach(function(k) {
                    d[k] = Number(d[k]);
                });
            return d;
        })
        .get(function(error, rows) {
            if (error) {
                return console.error('Failed to load data');
            }
            render(rows);
        });

    var width = 600, height = 250;

    var container = d3.select('#cycle')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    function render(data) {

        var monthScale = d3.scale.ordinal()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            .rangePoints([0, width], 1);

        var yearScale = d3.scale.linear()
            .domain(fc.util.extent(data, 'Year'))
            .nice();

        var tempScale = d3.scale.linear()
            .domain(fc.util.extent(data, ['Station']))
            .range([height, 0])
            .nice();

        var colorScale = d3.scale.category20();

        var subAxis = fc.series.axis()
            .tickSize(0)
            .ticks(0)
            .baseline(function(d) {
                return d3.mean(d, function(d) { return d.Station; });
            });

        var line = fc.series.line()
            .xValue(function(d) { return d.Year; })
            .yValue(function(d) { return d.Station; });

        var point = fc.series.point()
            .radius(2)
            .xValue(function(d) { return d.Year; })
            .yValue(function(d) { return d.Station; });

        var subMulti = fc.series.multi()
            .series([subAxis, line, point]);

        var cycle = fc.series.cycle()
            .barWidth(fc.util.fractionalBarWidth(0.9))
            .yScale(tempScale)
            .xValue(function(d) { return d.Month; })
            .subScale(yearScale)
            .subSeries(subMulti)
            .decorate(function(g) {
                g.enter()
                    .each(function(d, i) {
                        d3.select(this)
                            .selectAll('.multi')
                            .style('stroke', function() {
                                return colorScale(i);
                            });
                    });
            });

        var meanValues = d3.nest()
            .key(function(d) { return d.Month; })
            .rollup(function(d) {
                return d3.mean(d, function(d) { return d.Station; });
            })
            .entries(data);

        var trendLine = fc.series.line()
            .xValue(function(d) { return d.key; })
            .yValue(function(d) { return d.values; })
            .interpolate('cardinal')
            .decorate(function(path) {
                path.attr('class', 'trendline');
            });

        var multi = fc.series.multi()
            .series([trendLine, cycle])
            .xScale(monthScale)
            .yScale(tempScale)
            .mapping(function(series) {
                switch (series) {
                case cycle:
                    return this;
                case trendLine:
                    return meanValues;
                }
            });

        container.datum(data)
            .call(multi);
    }

})(d3, fc);
