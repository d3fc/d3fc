(function (d3, fc) {
    'use strict';

    var width = 600, height = 250;

    var svg = d3.select('#axis')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'margin: 20px; overflow: visible');

    var tick = 0;

    var c = d3.scale.category10();
    var color = function (d, i) {
        return c(i);
    };

    function render() {
        var scale = d3.scale.linear()
            .domain([0, tick % 2 === 0 ? 50 : 200])
            .range([0, width - (tick % 2 === 0 ? 50 : 0)])
            .nice();

        var axis = fc.svg.axis()
            .scale(scale)
            .decorate(function (sel) {
                sel.select('text').style('fill', color);
                sel.select('path').style('stroke', color);
            });

        svg.transition().call(axis);

        tick++;
    }

    setInterval(render, 2000);
})(d3, fc);
