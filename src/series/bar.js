import d3 from 'd3';
import barBase from './barBase';

// The bar series renders a vertical (column) or horizontal (bar) series. In order
// to provide a common implementation there are a number of functions that specialise
// the rendering logic based on the 'orient' property.
export default function() {

    var base = barBase()
        .className('bar')
        .containerTranslation(containerTranslation)
        .barHeight(barHeight);

    function containerTranslation(d, data, i) {
        if (base.orient() === 'vertical') {
            return 'translate(' + base.x1(d, i) + ', ' + base.y0(d, i) + ')';
        } else {
            return 'translate(' + base.x0(d, i) + ', ' + base.y1(d, i) + ')';
        }
    }

    function barHeight(d, data, i) {
        if (base.orient() === 'vertical') {
            return base.y1(d, i) - base.y0(d, i);
        } else {
            return base.x1(d, i) - base.x0(d, i);
        }
    }

    var bar = function(selection) {
        base(selection);
    };

    d3.rebind(bar, base, 'xScale', 'xValue', 'x1Value', 'x0Value', 'yScale', 'yValue', 'y1Value', 'y0Value', 'decorate', 'barWidth', 'orient', 'key');

    return bar;
}
