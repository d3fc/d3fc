import barUtil from './bar';
import {rebindAll} from 'd3fc-rebind';

export default function() {

    function isVertical() {
        return bar.orient() === 'vertical';
    }

    var bar = barUtil();

    var waterfall = function(selection) {
        bar
            .xValue(function(d, i) { return isVertical() ? d.x : d.y1; })
            .yValue(function(d, i) { return isVertical() ? d.y1 : d.x; })
            .x0Value(function(d, i) { return isVertical() ? 0 : d.y0; })
            .y0Value(function(d, i) { return isVertical() ? d.y0 : 0; })
            .decorate(function(g, d1, i) {
                g.enter()
                    .attr('class', 'waterfall ' + bar.orient())
                    .classed('up', function(d) { return d.direction === 'up'; })
                    .classed('down', function(d) { return d.direction === 'down'; });
            });

        bar(selection);
    };

    rebindAll(waterfall, bar);

    return waterfall;
}
