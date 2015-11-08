/* global d3:false, fc:false, example: false */
(function(d3, fc, example) {

    // Inspired by: http://bost.ocks.org/mike/nations/

    example.yearLabel = function() {
        var event = d3.dispatch('yearChange');

        var labelBox;

        var yearScale = d3.scale.linear()
              .domain([1800, 2009])
              .clamp(true);

        var overlayDataJoin = fc.util.dataJoin()
            .selector('rect.overlay')
            .element('rect')
            .attr('class', 'overlay');

        var labelDataJoin = fc.util.dataJoin()
            .selector('text')
            .element('text');

        function mousemove() { event.yearChange(yearScale.invert(d3.mouse(this)[0])); }

        function yearLabel(selection) {
            selection.each(function(data) {
                var label = labelDataJoin(selection, [data]);

                label.enter()
                    .attr('text-anchor', 'end');

                label.text(data);

                var overlay = overlayDataJoin(selection, [data]);

                overlay.enter()
                    .each(function() {
                        labelBox = label.node().getBBox();
                        yearScale.range([labelBox.x + 10, labelBox.x + labelBox.width - 10]);
                    })
                    .attr({
                        'x': labelBox.x,
                        'y': labelBox.y,
                        'width': labelBox.width,
                        'height': labelBox.height
                    })
                    .on({
                        'mouseover': function() { label.classed('active', true); },
                        'mouseout': function() { label.classed('active', false); },
                        'mousemove': mousemove,
                        'touchmove': mousemove
                    });
            });
        }

        d3.rebind(yearLabel, event, 'on');

        return yearLabel;
    };

    example.chart = function() {
        var event = d3.dispatch('yearChange');

        var radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
            colourScale = d3.scale.category10();

        function income(d) { return d.income; }
        function lifeExpectancy(d) { return d.lifeExpectancy; }
        function name(d) { return d.name; }
        function population(d) { return d.population; }

        function pointArea(d) { return Math.pow(radiusScale(population(d)), 2) * Math.PI; }
        function sort(a, b) { return population(b) - population(a); }
        function colour(d) { return colourScale(d.region); }

        var point = fc.series.point()
            .xValue(income)
            .yValue(lifeExpectancy)
            .key(name)
            .size(pointArea)
            .decorate(function(selection) {
                selection.enter()
                    .attr('fill', colour)
                    .append('title')
                    .text(name);

                // Ensure the points with the smallest population are on top
                selection.sort(sort);
            });

        var yearLabel = example.yearLabel()
            .on('yearChange', event.yearChange);

        var cartesianChart = fc.chart.cartesian(d3.scale.log(), d3.scale.linear())
            .xDomain([300, 1e5])
            .yDomain([10, 85])
            .margin({left: 30, bottom: 20})
            .yOrient('left')
            .xTicks(12, d3.format(',d'))
            .plotArea(point)
            .xLabel('income per capita, inflation-adjusted (dollars)')
            .yLabel('life expectancy (years)')
            .decorate(function(selection, data) {
                var xAxisWidth = selection.select('.x-axis')
                    .layout('width');

                selection.select('.x-axis .label')
                    .attr('transform', 'translate(' + xAxisWidth / 2 + ', -26)');

                var yAxisHeight = selection.select('.y-axis')
                    .layout('height');

                selection.select('.y-axis .label')
                    .attr('transform', 'rotate(-90) translate(' + yAxisHeight / 2 + ', 36)');

                var plotAreaContainerEnter = selection.enter()
                    .select('.plot-area-container');

                plotAreaContainerEnter.append('g')
                        .attr('class', 'year label')
                        .layout({
                            position: 'absolute',
                            right: 0,
                            bottom: 24
                        });

                plotAreaContainerEnter.layout();

                // Update the year label when updating the chart
                selection.select('.year.label')
                    .datum(data.year)
                    .call(yearLabel);
            });

        function chart(selection) {
            selection.each(function(data) {
                selection.call(cartesianChart);
            });
        }

        d3.rebind(chart, event, 'on');

        return chart;
    };

    (function() {
        // Finds (and possibly interpolates) the value for the specified year.
        function interpolateValues(values, bisect, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
                return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
        }

        // Interpolates the dataset for the given (fractional) year.
        function interpolateData(nations, bisect, year) {
            return nations.map(function(d) {
                return {
                    name: d.name,
                    region: d.region,
                    income: interpolateValues(d.income, bisect, year),
                    population: interpolateValues(d.population, bisect, year),
                    lifeExpectancy: interpolateValues(d.lifeExpectancy, bisect, year)
                };
            });
        }

        d3.json('nations.json', function(nations) {
            // A bisector since many nation's data is sparsely-defined.
            var bisect = d3.bisector(function(d) { return d[0]; });
            var data = interpolateData(nations, bisect, 1800);

            var container = d3.select('#wealth-and-health-of-nations');
            var chart = example.chart();
            chart.on('yearChange', function(year) {
                    enableInteraction();
                    displayYear(year);
                });

            container.transition()
                .duration(30000)
                .ease('linear')
                .tween('year', tweenYear)
                .each('end', enableInteraction);

            var render = fc.util.render(function() {
                    container.datum(data)
                        .call(chart)
                        .layoutSuspended(true);
                });

            // Tweens the entire chart by first tweening the year, and then the data.
            // For the interpolated data, the dots and label are redrawn.
            function tweenYear() {
                var year = d3.interpolateNumber(1800, 2009);
                return function(t) { displayYear(year(t)); };
            }

            function displayYear(year) {
                data = interpolateData(nations, bisect, year);
                data.year = Math.round(year);
                render();
            }

            var interactionEnabled = false;
            function enableInteraction() {
                if (!interactionEnabled) {
                    interactionEnabled = true;

                    // Cancel the current transition, if any.
                    container.transition()
                        .duration(0);
                }
            }
        });
    }());

}(d3, fc, {}));
