(function(d3, fc) {
    'use strict';

    // a very simple example component
    function decorator(selection) {
        selection.append('text')
            .text(function(d, index) { return d.data; })
            .attr({'y': 18, 'x': 20});
    }

    var data = [
        { x: 100, y: 100, data: 'hi'},
        { x: 50, y: 100, data: 'hello'},
        { x: 20, y: 75, data: 'W0Ot'},
        { x: 250, y: 200, data: 'Welcome'}
    ];

    var width = 600, height = 250;
    var itemWidth = 100, itemHeight = 30;
    var anchors = [];

    // Add some more data
    for (var i = 0; i < 20; i++) {
        data.push({
            x: i * 30,
            y: (i * i * i) % height,
            data: i
        });
    }

    var calloutAnchors = [];
    for (var j = 0; j < data.length; j++) {
        calloutAnchors.push([-20, 10]);
    }

    var svg = d3.select('#tooltip')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var xScale = d3.scale.linear()
        .range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    function useStrategy(strategyToUse) {
        var smart = fc.layout.callout(strategyToUse)
            .xScale(xScale)
            .yScale(yScale)
            .size([itemWidth, itemHeight])
            .origin(function(d, index) {
                return calloutAnchors[index];
            })
            .decorate(decorator);

        svg.selectAll('g').remove();

        svg.datum(data)
            .call(smart);
    }

    var greedyStrategy = fc.layout.strategy.greedy()
        .containerWidth(width)
        .containerHeight(height);

    var boundingBox = fc.layout.strategy.boundingBox()
        .containerWidth(width)
        .containerHeight(height);

    var local = fc.layout.strategy.local()
        .containerWidth(width)
        .containerHeight(height)
        .iterations(10);

    var annealing = fc.layout.strategy.annealing()
        .containerWidth(width)
        .containerHeight(height);

    useStrategy(null);

    document.getElementById('noop')
        .addEventListener('change', function() {
            useStrategy(null);
        });

    document.getElementById('bounding-box')
        .addEventListener('change', function() {
            useStrategy(boundingBox);
        });

    document.getElementById('greedy')
        .addEventListener('change', function() {
            useStrategy(greedyStrategy);
        });

    document.getElementById('local')
        .addEventListener('change', function() {
            useStrategy(local);
        });

    document.getElementById('annealing')
        .addEventListener('change', function() {
            useStrategy(annealing);
        });

})(d3, fc);
