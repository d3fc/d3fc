import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import fractionalBarWidth from '../util/fractionalBarWidth';
import {noop} from '../util/fn';
import svgBar from '../svg/bar';
import xyBase from './xyBase';

// The base series for rendering vertical (column) or horizontal (bar) series. In order
// to provide a common implementation there are a number of functions that specialise
// the rendering logic based on the 'orient' property.
export default function() {

    var decorate = noop,
        barWidth = fractionalBarWidth(0.75),
        barHeight = fractionalBarWidth(0.75),
        orient = 'vertical',
        pathGenerator = svgBar(),
        containerTranslation = noop,
        className = function(d) { return ''; };

    var baseBase = xyBase()
      .xValue(function(d, i) { return orient === 'vertical' ? d.date : d.close; })
      .yValue(function(d, i) { return orient === 'vertical' ? d.close : d.date; });

    var dataJoin = dataJoinUtil()
        .selector('g.bar')
        .element('g');

    function valueAxisDimension(generator) {
        if (orient === 'vertical') {
            return generator.height;
        } else {
            return generator.width;
        }
    }

    function crossAxisDimension(generator) {
        if (orient === 'vertical') {
            return generator.width;
        } else {
            return generator.height;
        }
    }

    function crossAxisValueFunction() {
        return orient === 'vertical' ? baseBase.x : baseBase.y;
    }

    var base = function(selection) {
        selection.each(function(data, index) {

            if (orient !== 'vertical' && orient !== 'horizontal') {
                throw new Error('This series does not support an orientation of ' + orient);
            }

            var filteredData = data.filter(baseBase.defined);

            dataJoin.attr('class', function(d) { return className(d, filteredData) + ' ' + orient; });

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
                .attr('transform', function(d, i) { return containerTranslation(d, filteredData, i); })
                .append('path')
                .attr('d', function(d) { return pathGenerator([d]); });

            // set the bar to its correct height
            valueAxisDimension(pathGenerator)(function(d, i) { return barHeight(d, filteredData, i); });

            g.attr('transform', function(d, i) { return containerTranslation(d, filteredData, i); })
                .select('path')
                .attr('d', function(d) { return pathGenerator([d]); });

            decorate(g, filteredData, index);
        });
    };

    base.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return base;
    };
    base.barWidth = function(x) {
        if (!arguments.length) {
            return barWidth;
        }
        barWidth = d3.functor(x);
        return base;
    };
    base.barHeight = function(x) {
        if (!arguments.length) {
            return barHeight;
        }
        barHeight = d3.functor(x);
        return base;
    };
    base.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return base;
    };
    base.containerTranslation = function(x) {
        if (!arguments.length) {
            return containerTranslation;
        }
        containerTranslation = x;
        return base;
    };
    base.className = function(x) {
        if (!arguments.length) {
            return className;
        }
        className = d3.functor(x);
        return base;
    };

    d3.rebind(base, baseBase, 'xScale', 'xValue', 'x1Value', 'x0Value', 'yScale', 'yValue', 'y1Value', 'y0Value', 'x', 'x1', 'x0', 'y', 'y1', 'y0');
    d3.rebind(base, dataJoin, 'key');

    return base;
}
