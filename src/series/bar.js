import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import svgBar from '../svg/bar';
import {rebind} from '../util/rebind';

export default function() {

    var decorate = noop,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        y1Value = function(d, i) { return d.close; },
        xValue = function(d, i) { return d.date; },
        y0Value = d3.functor(0),
        barWidth = fractionalBarWidth(0.75);

    var dataJoin = _dataJoin()
        .selector('g.bar')
        .element('g')
        .attr('class', 'bar');

    var x = function(d, i) { return xScale(xValue(d, i)); },
        y1 = function(d, i) { return yScale(y1Value(d, i)); },
        y0 = function(d, i) { return yScale(y0Value(d, i)); };

    var containerTranslation = function(d, i) {
        return 'translate(' + x(d, i) + ', ' + y0(d, i) + ')';
    };

    var pathGenerator = svgBar()
        .verticalAlign('top');

    var bar = function(selection) {
        selection.each(function(data, index) {

            var filteredData = data.filter(function(d, i) {
                return y0Value(d, i) !== undefined &&
                    y1Value(d, i) !== undefined &&
                    xValue(d, i) !== undefined;
            });

            var g = dataJoin(this, filteredData);

            var width = barWidth(filteredData.map(x));

            pathGenerator.x(0)
                .y(0)
                .width(width)
                .height(0);

            // within the enter selection the pathGenerator creates a zero
            // height bar. As a result, when used with a transition the bar grows
            // from y0 to y1
            g.enter()
                .attr('transform', containerTranslation)
                .append('path')
                .attr('d', function(d) { return pathGenerator([d]); });

            pathGenerator.height(function(d, i) { return y1(d, i) - y0(d, i); });

            g.attr('transform', containerTranslation)
                .select('path')
                .attr('d', function(d) { return pathGenerator([d]); });

            decorate(g, filteredData, index);
        });
    };

    bar.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return bar;
    };
    bar.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return bar;
    };
    bar.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return bar;
    };
    bar.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return bar;
    };
    bar.y0Value = function(x) {
        if (!arguments.length) {
            return y0Value;
        }
        y0Value = d3.functor(x);
        return bar;
    };
    bar.yValue = bar.y1Value = function(x) {
        if (!arguments.length) {
            return y1Value;
        }
        y1Value = x;
        return bar;
    };
    bar.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return bar;
    };

    d3.rebind(bar, dataJoin, 'key');
    rebind(bar, pathGenerator, {'align': 'horizontalAlign'});

    return bar;
}
