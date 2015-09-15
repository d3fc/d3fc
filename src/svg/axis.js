import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import {identity, noop} from '../util/fn';
import {range as scaleRange, isOrdinal} from '../util/scale';

// A drop-in replacement for the D3 axis, supporting the decorate pattern.
export default function() {

    var scale = d3.scale.identity(),
          decorate = noop,
          orient = 'bottom',
          tickArguments = [10],
          tickValues = null,
          tickFormat = null,
          outerTickSize = 6,
          innerTickSize = 6,
          tickPadding = 3,
          svgDomainLine = d3.svg.line();

    var dataJoin = _dataJoin()
        .selector('g.tick')
        .element('g')
        .key(identity)
        .attr('class', 'tick');

    var domainPathDataJoin = _dataJoin()
        .selector('path.domain')
        .element('path')
        .attr('class', 'domain');

    // returns a function that creates a translation based on
    // the bound data
    function containerTranslate(s, trans) {
        return function(d) {
            return trans(s(d), 0);
        };
    }

    function translate(x, y) {
        if (isVertical()) {
            return 'translate(' + y + ', ' + x + ')';
        } else {
            return 'translate(' + x + ', ' + y + ')';
        }
    }

    function pathTranspose(arr) {
        if (isVertical()) {
            return arr.map(function(d) {
                return [d[1], d[0]];
            });
        } else {
            return arr;
        }
    }

    function isVertical() {
        return orient === 'left' || orient === 'right';
    }

    function tryApply(fn, defaultVal) {
        return scale[fn] ? scale[fn].apply(scale, tickArguments) : defaultVal;
    }

    var axis = function(selection) {

        selection.each(function(data, index) {

            // Stash a snapshot of the new scale, and retrieve the old snapshot.
            var scaleOld = this.__chart__ || scale;
            this.__chart__ = scale.copy();

            var ticksArray = tickValues == null ? tryApply('ticks', scale.domain()) : tickValues;
            var tickFormatter = tickFormat == null ? tryApply('tickFormat', identity) : tickFormat;
            var sign = orient === 'bottom' || orient === 'right' ? 1 : -1;
            var container = d3.select(this);

            // add the domain line
            var range = scaleRange(scale);
            var domainPathData = pathTranspose([
                  [range[0], sign * outerTickSize],
                  [range[0], 0],
                  [range[1], 0],
                  [range[1], sign * outerTickSize]
                ]);

            var domainLine = domainPathDataJoin(container, [data]);
            domainLine
                .attr('d', svgDomainLine(domainPathData));

            // datajoin and construct the ticks / label
            dataJoin.attr({
                // set the initial tick position based on the previous scale
                // in order to get the correct enter transition - however, for ordinal
                // scales the tick will not exist on the old scale, so use the current position
                'transform': containerTranslate(isOrdinal(scale) ? scale : scaleOld, translate)
            });

            var g = dataJoin(container, ticksArray);

            // enter
            g.enter().append('path');

            var labelOffset = sign * (innerTickSize + tickPadding);
            g.enter()
                .append('text')
                .attr('transform', translate(0, labelOffset));

            // update
            g.attr('class', 'tick orient-' + orient);

            g.attr('transform', containerTranslate(scale, translate));

            g.selectAll('path')
                .attr('d', function(d) {
                    return svgDomainLine(pathTranspose([
                        [0, 0], [0, sign * innerTickSize]
                    ]));
                });

            g.selectAll('text')
               .attr('transform', translate(0, labelOffset))
               .text(tickFormatter);

            // exit - for non ordinal scales, exit by animating the tick to its new location
            if (!isOrdinal(scale)) {
                g.exit()
                    .attr('transform', containerTranslate(scale, translate));
            }

            decorate(g, data, index);
        });
    };

    axis.scale = function(x) {
        if (!arguments.length) {
            return scale;
        }
        scale = x;
        return axis;
    };

    axis.ticks = function(x) {
        if (!arguments.length) {
            return tickArguments;
        }
        tickArguments = arguments;
        return axis;
    };

    axis.tickValues = function(x) {
        if (!arguments.length) {
            return tickValues;
        }
        tickValues = x;
        return axis;
    };

    axis.tickFormat = function(x) {
        if (!arguments.length) {
            return tickFormat;
        }
        tickFormat = x;
        return axis;
    };

    axis.tickSize = function(x) {
        var n = arguments.length;
        if (!n) {
            return innerTickSize;
        }
        innerTickSize = Number(x);
        outerTickSize = Number(arguments[n - 1]);
        return axis;
    };

    axis.innerTickSize = function(x) {
        if (!arguments.length) {
            return innerTickSize;
        }
        innerTickSize = Number(x);
        return axis;
    };

    axis.outerTickSize = function(x) {
        if (!arguments.length) {
            return outerTickSize;
        }
        outerTickSize = Number(x);
        return axis;
    };

    axis.tickPadding = function(x) {
        if (!arguments.length) {
            return tickPadding;
        }
        tickPadding = x;
        return axis;
    };

    axis.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return axis;
    };

    axis.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return axis;
    };

    return axis;
}
