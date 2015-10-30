import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import svgBar from '../svg/bar';
import xyBase from './xyBase';

// The bar series renders a vertical (column) or horizontal (bar) series. In order
// to provide a common implementation there are a number of functions that specialise
// the rendering logic based on the 'orient' property.
export default function() {

    var decorate = noop,
        barWidth = fractionalBarWidth(0.75),
        orient = 'vertical',
        pathGenerator = svgBar();

    function isVertical() {
        return orient === 'vertical';
    }

    var base = xyBase()
      .xValue(function(d, i) { return isVertical() ? d.date : d.close; })
      .yValue(function(d, i) { return isVertical() ? d.close : d.date; });

    var dataJoin = dataJoinUtil()
        .selector('g.bar')
        .element('g');

    function containerTranslation(d, i) {
        if (isVertical()) {
            return 'translate(' + base.x1(d, i) + ', ' + base.y0(d, i) + ')';
        } else {
            return 'translate(' + base.x0(d, i) + ', ' + base.y1(d, i) + ')';
        }
    }

    function barHeight(d, i) {
        if (isVertical()) {
            return base.y1(d, i) - base.y0(d, i);
        } else {
            return base.x1(d, i) - base.x0(d, i);
        }
    }

    function valueAxisDimension(pathGenerator) {
        if (isVertical()) {
            return pathGenerator.height;
        } else {
            return pathGenerator.width;
        }
    }

    function crossAxisDimension(pathGenerator) {
        if (isVertical()) {
            return pathGenerator.width;
        } else {
            return pathGenerator.height;
        }
    }

    function crossAxisValueFunction() {
        return isVertical() ? base.x : base.y;
    }

    var bar = function(selection) {
        selection.each(function(data, index) {

            if (!isVertical() && orient !== 'horizontal') {
                throw new Error('The bar series does not support an orientation of ' + orient);
            }

            dataJoin.attr('class', 'bar ' + orient);

            var filteredData = data.filter(base.defined);

            pathGenerator.x(0)
                .y(0)
                .width(0)
                .height(0);

            if (isVertical()) {
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

    d3.rebind(bar, base, 'xScale', 'xValue', 'x1Value', 'x0Value', 'yScale', 'yValue', 'y1Value', 'y0Value');
    d3.rebind(bar, dataJoin, 'key');

    return bar;
}
