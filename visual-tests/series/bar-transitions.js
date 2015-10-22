(function(d3, fc) {
    'use strict';

    var dataset = [
        {name: 'Fred', age: 24},
        {name: 'Bob', age: 22},
        {name: 'Frank', age: 18},
        {name: 'Jim', age: 18},
        {name: 'Brian', age: -35},
        {name: 'Jane', age: 17}
    ];

    // Make a copy of the dataset
    var data = dataset.slice();

    function clampRange(range) {
        if (range[0] > 0) {
            return [0, range[1]];
        } else if (range[1] < 0) {
            return [range[0], 0];
        } else {
            return range;
        }
    }

    function renderChart() {
        // Create scales
        var colour = d3.scale.linear()
            .domain([-50, 50])
            .range(['blue', 'red']);

        var chart = fc.chart.cartesian(
                d3.scale.ordinal(), d3.scale.linear())
            .xBaseline(0)
            .xDomain(data.map(function(d) { return d.name; }))
            .yDomain(clampRange(fc.util.extent()(data, 'age')));

        // Create the bar series
        var bar = fc.series.bar()
            .yValue(function(d) { return d.age; })
            .xValue(function(d) { return d.name; })
            .key(function(d) { return d.name; })
            .decorate(function(sel) {
                sel.select('path')
                    .style('fill', function(d, i) { return colour(d.age); });
            });

        chart.plotArea(bar);

        d3.select('#bar-transitions')
            .datum(data)
            .transition()
            .duration(1000)
            .call(chart);
    }

    renderChart();

    // Update the chart every 5 seconds (animation lasts 2.5 seconds)
    // Y values are randomised
    // X values are added, removed, and their order shuffled
    setInterval(function() {
        // Start with a copy of the inital dataset
        data = dataset.slice();

        // Shuffle the data
        d3.shuffle(data);

        // Randomise the ages
        data.forEach(function(person) {
            person.age = randomAge();
        });

        // Remove a random number of entries
        data.splice(0, Math.floor(Math.random() * (data.length - 1)));

        renderChart();
    }, 2000);

    // Create a random integer in the range -50 - 50
    function randomAge() {
        return Math.floor(Math.random() * 100) - 50;
    }

})(d3, fc);
