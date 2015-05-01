(function(d3, fc) {
    'use strict';

    // Assigning to fc is nasty but there's not a lot of choice I don't think...
    fc.tooltip = function() {

        var tooltip = function(selection) {

            var container = selection.enter()
                .append('g')
                .attr('class', 'info');

            container.append('rect')
                .attr({
                    width: 130,
                    height: 76,
                    fill: 'white'
                });

            container.append('text');

            container = selection.select('g.info')
                .attr('transform', function(d) {
                    var dx = Number(d.x);
                    var x = dx < 150 ? dx + 10 : dx - 150 + 10;
                    return 'translate(' + x + ',' + 10 + ')';
                });

            var tspan = container.select('text')
                .selectAll('tspan')
                .data(tooltip.items.value);

            tspan.enter()
                .append('tspan')
                .attr('x', 4)
                .attr('dy', 12);

            tspan.text(function(d) {
                return d(container.datum().datum);
            });
        };

        function format(type, value) {
            return tooltip.formatters.value[type](value);
        }

        tooltip.items = fc.utilities.property([
            function(d) { return format('date', d.date); },
            function(d) { return 'Open: ' + format('price', d.open); },
            function(d) { return 'High: ' + format('price', d.high); },
            function(d) { return 'Low: ' + format('price', d.low); },
            function(d) { return 'Close: ' + format('price', d.close); },
            function(d) { return 'Volume: ' + format('volume', d.volume); }
        ]);
        tooltip.formatters = fc.utilities.property({
            date: d3.time.format('%A, %b %e, %Y'),
            price: d3.format('.2f'),
            volume: d3.format('0,5p')
        });

        return tooltip;
    };

})(d3, fc);
