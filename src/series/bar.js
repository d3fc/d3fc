import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import svgBar from '../svg/bar';
//import {rebind} from '../util/rebind';

export default function() {

    // bar => x, y0, y1 (=y)
    // column => y => x0, x1 (=x)

    var decorate = noop,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xValue = function(d, i) { return orient === 'vertical' ? d.date : d.close; },
        yValue = function(d, i) { return orient === 'vertical' ? d.close : d.date; },
        y0Value = d3.functor(0),
        x0Value = d3.functor(0),
        barWidth = fractionalBarWidth(0.75),
        orient = 'vertical';

    var x = function(d, i) { return xScale(xValue(d, i)); },
        y = function(d, i) { return yScale(yValue(d, i)); },
        y0 = function(d, i) { return yScale(y0Value(d, i)); },
        x0 = function(d, i) { return xScale(x0Value(d, i)); };

    var bar = function(selection) {
        selection.each(function(data, index) {

            var dataJoin, pathGenerator, containerTranslation, filteredData, g;

            if (orient === 'vertical') {

                dataJoin = _dataJoin()
                    .selector('g.bar')
                    .element('g')
                    .attr('class', 'bar');

                pathGenerator = svgBar()
                    .verticalAlign('top');

                containerTranslation = function(d, i) {
                    return 'translate(' + x(d, i) + ', ' + y0(d, i) + ')';
                };

                filteredData = data.filter(function(d, i) {
                    return y0Value(d, i) !== undefined &&
                        yValue(d, i) !== undefined &&
                        xValue(d, i) !== undefined;
                });

                g = dataJoin(this, filteredData);

                var width = barWidth(filteredData.map(x));

                pathGenerator.x(0)
                    .y(0)
                    .width(width)
                    .height(0);

                // within the enter selection the pathGenerator creates a zero
                // height bar. As a result, when used with a transition the bar grows
                // from y0 to y1 (y)
                g.enter()
                    .attr('transform', containerTranslation)
                    .append('path')
                    .attr('d', function(d) { return pathGenerator([d]); });

                pathGenerator.height(function(d, i) { return y(d, i) - y0(d, i); });

                g.attr('transform', containerTranslation)
                    .select('path')
                    .attr('d', function(d) { return pathGenerator([d]); });

                decorate(g, filteredData, index);

            } else {

                dataJoin = _dataJoin()
                    .selector('g.column')
                    .element('g')
                    .attr('class', 'column');

                containerTranslation = function(d, i) {
                    return 'translate(' + x0(d, i) + ', ' + y(d, i) + ')';
                };

                pathGenerator = svgBar()
                    .horizontalAlign('right');

                filteredData = data.filter(function(d, i) {
                    return x0Value(d, i) !== undefined &&
                        xValue(d, i) !== undefined &&
                        yValue(d, i) !== undefined;
                });

                g = dataJoin(this, filteredData);

                var height = barWidth(filteredData.map(y));

                pathGenerator.x(0)
                    .y(0)
                    .height(height)
                    .width(0);

                // within the enter selection the pathGenerator creates a zero
                // width column. As a result, when used with a transition the column grows
                // from x0 to x1 (x)
                g.enter()
                    .attr('transform', containerTranslation)
                    .append('path')
                    .attr('d', function(d) { return pathGenerator([d]); });

                pathGenerator.width(function(d, i) { return x(d, i) - x0(d, i); });

                g.attr('transform', containerTranslation)
                    .select('path')
                    .attr('d', function(d, i) { return pathGenerator([d]); });

                decorate(g, filteredData, index);
            }
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
    bar.y0Value = function(x) {
        if (!arguments.length) {
            return y0Value;
        }
        y0Value = d3.functor(x);
        return bar;
    };
    bar.x0Value = function(x) {
        if (!arguments.length) {
            return x0Value;
        }
        x0Value = x;
        return bar;
    };
    bar.yValue = bar.y1Value = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = x;
        return bar;
    };
    bar.xValue = bar.x1Value = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return bar;
    };
    bar.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return bar;
    };
    bar.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return bar;
    };

    //d3.rebind(bar, dataJoin, 'key');
    //rebind(bar, pathGenerator, {'align': 'horizontalAlign'});

    return bar;
}
