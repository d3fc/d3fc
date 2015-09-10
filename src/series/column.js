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
        x1Value = function(d, i) { return d.close; },
        yValue = function(d, i) { return d.date; },
        x0Value = d3.functor(0),
        columnWidth = fractionalBarWidth(0.75);

    var dataJoin = _dataJoin()
        .selector('g.column')
        .element('g')
        .attr('class', 'column');

    var y = function(d, i) { return yScale(yValue(d, i)); },
        x1 = function(d, i) { return xScale(x1Value(d, i)); },
        x0 = function(d, i) { return xScale(x0Value(d, i)); };

    var pathGenerator = svgBar()
        .horizontalAlign('right');

    var containerTranslation = function(d, i) {
        return 'translate(' + x0(d, i) + ', ' + y(d, i) + ')';
    };

    var column = function(selection) {
        selection.each(function(data, index) {

            var filteredData = data.filter(function(d, i) {
                return x0Value(d, i) !== undefined &&
                    x1Value(d, i) !== undefined &&
                    yValue(d, i) !== undefined;
            });

            var g = dataJoin(this, filteredData);

            var height = columnWidth(filteredData.map(y));

            pathGenerator.x(0)
                .y(0)
                .height(height)
                .width(0);

            // within the enter selection the pathGenerator creates a zero
            // width column. As a result, when used with a transition the column grows
            // from y0 to y1
            g.enter()
                .attr('transform', containerTranslation)
                .append('path')
                .attr('d', function(d) { return pathGenerator([d]); });

            pathGenerator.width(function(d, i) { return x1(d, i) - x0(d, i); });

            g.attr('transform', containerTranslation)
                .select('path')
                .attr('d', function(d, i) { return pathGenerator([d]); });

            decorate(g, filteredData, index);
        });
    };

    column.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return column;
    };
    column.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return column;
    };
    column.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return column;
    };
    column.yValue = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = x;
        return column;
    };
    column.x0Value = function(x) {
        if (!arguments.length) {
            return x0Value;
        }
        x0Value = d3.functor(x);
        return column;
    };
    column.xValue = column.x1Value = function(x) {
        if (!arguments.length) {
            return x1Value;
        }
        x1Value = x;
        return column;
    };
    column.columnWidth = function(x) {
        if (!arguments.length) {
            return columnWidth;
        }
        columnWidth = d3.functor(x);
        return column;
    };

    d3.rebind(column, dataJoin, 'key');
    rebind(column, pathGenerator, {'align': 'verticalAlign'});

    return column;
}
