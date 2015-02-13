(function(d3, fc) {
    'use strict';

    var dataset = [
        {name: 'Fred', age: 24},
        {name: 'Bob', age: 22},
        {name: 'Frank', age: 18},
        {name: 'Jim', age: 18},
        {name: 'Brian', age: 35},
        {name: 'Jane', age: 17},
        {name: 'Katherine', age: 37},
        {name: 'Alice', age: 22},
        {name: 'Rachel', age: 27},
        {name: 'Jenny', age: 32}
    ];

    // Make a copy of the dataset
    var data = dataset.slice();

    // Setup the chart area
    var chart = d3.select('#bar-transitions'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scales
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.name; }))
        .rangePoints([0, chartLayout.getPlotAreaWidth()], 1);

    var yScale = d3.scale.linear()
        .domain([0, 40])
        .range([chartLayout.getPlotAreaHeight(), 0]);

    var colour = d3.scale.linear()
        .domain([0, 100])
        .range(['blue', 'red']);

    // Create the axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom')
        .transition()
        .duration(2500)
        .call(xAxis);

    chartLayout.getAxisContainer('left')
        .transition()
        .duration(2500)
        .call(yAxis);

    // Create the bar series
    var bar = fc.series.bar()
        .xValue(function(d) { return d.name; })
        .yValue(function(d) { return d.age; })
        .xScale(xScale)
        .yScale(yScale)
        .decorate(function(sel) {
            sel.select('rect')
                .attr('fill', function(d, i) { return colour(d.age); });
        });

    // Add the bar series to the chart
    chartLayout.getPlotArea().datum(data)
        .transition()
        .duration(2500)
        .call(bar);

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
        yScale.domain([0, d3.max(data, function(d) { return d.age; })]);

        // Update axes
        chartLayout.getAxisContainer('bottom')
            .transition()
            .duration(2500)
            .call(xAxis);
        chartLayout.getAxisContainer('left')
            .transition()
            .duration(2500)
            .call(yAxis);

        // Update bar series
        chartLayout.getPlotArea().datum(data)
            .transition()
            .duration(2500)
            .call(bar);
    }, 5000);

    // Create a random integer in the range 0-100
    function randomAge() {
        return Math.floor(Math.random() * 100);
    }

})(d3, fc);