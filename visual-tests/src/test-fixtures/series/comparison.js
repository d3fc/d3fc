(function(d3, fc) {
    'use strict';

    var data = [
        fc.dataGenerator().startDate(new Date(2014, 1, 1))(50),
        fc.dataGenerator().startDate(new Date(2013, 12, 15))(50)
    ];

    var percentageChange = fc.indicator.algorithm.calculator.percentageChange()
        .value(function(d) { return d.close; });
    data.forEach(function(d) {
        d3.zip(d, percentageChange(d))
            .forEach(function(tuple) {
                tuple[0].percentageChange = tuple[1];
            });
    });

    var width = 600, height = 250;

    var container = d3.select('#comparison')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent(data, ['percentageChange']))
        .range([height, 0])
        .nice();

    var line = fc.series.line()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.percentageChange; });

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([line, line])
        .mapping(function(series, i) {
            return this[i];
        });

    function render() {
        container.datum(data)
            .call(multi);
    }

    var zoom = d3.behavior.zoom()
        .x(dateScale)
        .on('zoom', function zoomed() {
            function findIndex(data, item, field) {
                // Find insertion point for item in seriesData.
                var bisect = d3.bisector(
                    function(d) {
                        return d[field];
                    }).left;
                return bisect(data, item);
            }
            var comparisonData = [];
            data.forEach(function(d) {
                var leftIndex = findIndex(d, dateScale.domain()[0], 'date'),
                    rightIndex = findIndex(d, dateScale.domain()[1], 'date');
                if (leftIndex !== 0) {
                    leftIndex -= 1; // Try to base from the data point one before the LHS of the date axis.
                }
                percentageChange.baseIndex(leftIndex);
                comparisonData.push(d.slice(leftIndex, rightIndex + 1));
                d3.zip(d, percentageChange(d))
                    .forEach(function(tuple) {
                        tuple[0].percentageChange = tuple[1];
                    });
            });
            priceScale.domain(fc.util.extent(comparisonData, ['percentageChange']))
                .nice();
            render();
        })
        .scaleExtent([0.5, 3]);
    container.call(zoom);

    render();

})(d3, fc);
