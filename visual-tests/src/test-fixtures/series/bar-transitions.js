(function(d3, fc) {
    'use strict';

    var dataset = [
        {name: 'Fred', age: 24},
        {name: 'Bob', age: 22},
        {name: 'Frank', age: 18},
        {name: 'Jim', age: 18},
        {name: 'Brian', age: -35},
        {name: 'Jane', age: 17},
        {name: 'Katherine', age: 37},
        {name: 'Alice', age: -22},
        {name: 'Rachel', age: -27},
        {name: 'Jenny', age: 32}
    ];

    // Make a copy of the dataset
    var data = dataset.slice();

    // Setup the chart area
    var width = 600, height = 250, axisHeight = 25;

    var chart = d3.select('#bar-transitions')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var axisContainer = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height - axisHeight) + ')');

    // Create scales
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.name; }))
        .rangePoints([0, width], 1);

    var yScale = d3.scale.linear()
        .domain([-40, 40])
        .range([height - axisHeight, 0]);

    var colour = d3.scale.linear()
        .domain([-50, 50])
        .range(['blue', 'red']);

    // Create the axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    // Add the axes to the chart
    axisContainer
        .transition().duration(2500)
        .call(xAxis);

    // Create the bar series
    var bar = fc.series.bar()
        .xValue(function(d) { return d.name; })
        .yValue(function(d) { return d.age; })
        .xScale(xScale)
        .yScale(yScale)
        .decorate(function(sel) {
            sel.attr('fill', function(d, i) { return colour(d.age); });
        });

    // Add the bar series to the chart
    var seriesContainer = chart.append('g')
        .datum(data);

    seriesContainer.call(bar);

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

        // Update scale domains
        xScale.domain(data.map(function(d) { return d.name; }));
        yScale.domain([
            d3.min(data, function(d) { return d.age; }),
            d3.max(data, function(d) { return d.age; })
        ]);

        // Update axes
        axisContainer
            .transition().duration(2500)
            .call(xAxis);

        // Update bar series
        seriesContainer.datum(data)
            .transition().duration(2500)
            .call(bar);
    }, 5000);

    // Create a random integer in the range -50 - 50
    function randomAge() {
        return Math.floor(Math.random() * 100) - 50;
    }

})(d3, fc);