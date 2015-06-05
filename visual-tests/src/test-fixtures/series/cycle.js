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

        var meanValues = d3.nest()
            .key(function(d) { return d.Month; })
            .entries(data)
            .map(function(d) {
                var mean = d3.mean(d.values, function(d) { return d.Station; });
                // Cheekily stick the mean value onto each data point while we're on
                d.values.forEach(function(d) { d.Mean = mean; });
                return {
                    Month: d.key,
                    Mean: mean
                };
            });

        var monthScale = d3.scale.linear()
            .domain([0, 13])
            .range([0, width]);

        var yearScale = d3.scale.linear()
            .domain(fc.utilities.extent(data, 'Year'))
            .nice();

        var tempScale = d3.scale.linear()
            .domain(fc.utilities.extent(data, ['Station']))
            .range([height, 0])
            .nice();

        var colorScale = d3.scale.category20();

        var meanLine = fc.series.line()
            .xValue(function(d) { return d.Year; })
            .yValue(function(d) { return d.Mean; })
            .decorate(function(path) {
                path.attr('class', 'axis');
            });

        var line = fc.series.line()
            .xValue(function(d) { return d.Year; })
            .yValue(function(d) { return d.Station; });

        var point = fc.series.point()
            .radius(2)
            .xValue(function(d) { return d.Year; })
            .yValue(function(d) { return d.Station; });

        var subMulti = fc.series.multi()
            .series([meanLine, line, point]);

        var cycle = fc.series.cycle()
            .barWidth(fc.utilities.fractionalBarWidth(0.9))
            .yScale(tempScale)
            .xValue(function(d) { return d.Month; })
            .subScale(yearScale)
            .subSeries(subMulti)
            .decorate(function(g) {
                g.enter()
                    .attr('stroke', function(d, i) {
                        return colorScale(i);
                    });
            });

        var trendLine = fc.series.line()
            .yValue(function(d) { return d.Mean; })
            .xValue(function(d) { return d.Month; })
            .interpolate('cardinal')
            .decorate(function(path) {
                path.attr('class', 'trendline');
            });

        var multi = fc.series.multi()
            .series([trendLine, cycle])
            .xScale(monthScale)
            .yScale(tempScale)
            .mapping(function(data, series) {
                switch (series) {
                    case cycle:
                        return data;
                    case trendLine:
                        return meanValues;
                }
            });

        container.append('g')
            .datum(data)
            .call(multi);
    }

})(d3, fc);
