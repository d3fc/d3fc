import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import svgBar from '../svg/bar';

// The bar series renders a vertical (column) or horizontal (bar) series. In order
// to provide a common implementation there are a number of functions that specialise
// the rendering logic based on the 'orient' property.
export default function() {

    var decorate = noop,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xValue = function(d, i) { return orient === 'vertical' ? d.date : d.close; },
        yValue = function(d, i) { return orient === 'vertical' ? d.close : d.date; },
        y0Value = d3.functor(0),
        x0Value = d3.functor(0),
        barWidth = fractionalBarWidth(0.75),
        orient = 'vertical',
        pathGenerator = svgBar();

    var dataJoin = _dataJoin()
        .selector('g.bar')
        .element('g');

    var x = function(d, i) { return xScale(xValue(d, i)); },
        y = function(d, i) { return yScale(yValue(d, i)); },
        y0 = function(d, i) { return yScale(y0Value(d, i)); },
        x0 = function(d, i) { return xScale(x0Value(d, i)); };

    function containerTranslation(d, i) {
        if (orient === 'vertical') {
            return 'translate(' + x(d, i) + ', ' + y0(d, i) + ')';
        } else {
            return 'translate(' + x0(d, i) + ', ' + y(d, i) + ')';
        }
    }

    function barHeight(d, i) {
        if (orient === 'vertical') {
            return y(d, i) - y0(d, i);
        } else {
            return x(d, i) - x0(d, i);
        }
    }

    function isDatapointValid(d, i) {
        if (orient === 'vertical') {
            return y0Value(d, i) !== undefined &&
                yValue(d, i) !== undefined &&
                xValue(d, i) !== undefined;
        } else {
            return x0Value(d, i) !== undefined &&
                xValue(d, i) !== undefined &&
                yValue(d, i) !== undefined;
        }
    }

    function valueAxisDimension(pathGenerator) {
        if (orient === 'vertical') {
            return pathGenerator.height;
        } else {
            return pathGenerator.width;
        }
    }

    function crossAxisDimension(pathGenerator) {
        if (orient === 'vertical') {
            return pathGenerator.width;
        } else {
            return pathGenerator.height;
        }
    }

    function crossAxisValueFunction() {
        return orient === 'vertical' ? x : y;
    }

    var bar = function(selection) {
        selection.each(function(data, index) {

            if (orient !== 'vertical' && orient !== 'horizontal') {
                throw new Error('The bar series does not support an orientation of ' + orient);
            }

            dataJoin.attr('class', 'bar ' + orient);

            var filteredData = data.filter(isDatapointValid);

            pathGenerator.x(0)
                .y(0)
                .width(0)
                .height(0);

            if (orient === 'vertical') {
                pathGenerator.verticalAlign('top');
            } else {
                pathGenerator.horizontalAlign('right');
            }

            // set the width of the bars
            var width = barWidth(filteredData.map(crossAxisValueFunction()));
            crossAxisDimension(pathGenerator)(width);

            var g = dataJoin(this, filteredData);

            // within the enter selection the pathGenerator creates a zero
            // height bar. As a result, when used with a transition the bar grows
            // from y0 to y1 (y)
            g.enter()
                .attr('transform', containerTranslation)
                .append('path')
                .attr('d', function(d) { return pathGenerator([d]); });

            // set the bar to its correct height
            valueAxisDimension(pathGenerator)(barHeight);

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
        x0Value = d3.functor(x);
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

    d3.rebind(bar, dataJoin, 'key');

    return bar;
}
