(function(d3, fc) {
    'use strict';

    // A drop-in replacement for the D3 axis, supporting the decorate pattern.
    fc.svg.axis = function() {

        var scale = d3.scale.identity(),
              decorate = fc.util.fn.noop,
              orient = 'bottom',
              tickArguments = [10],
              tickValues = null,
              tickFormat = null,
              outerTickSize = 6,
              innerTickSize = 6,
              tickPadding = 3,
              svgDomainLine = d3.svg.line();

        var dataJoin = fc.util.dataJoin()
            .selector('g.tick')
            .element('g')
            .key(fc.util.fn.identity)
            .attrs({'class': 'tick'});

        // returns a function that creates a translation based on
        // the bound data
        function containerTranslate(s, trans) {
            return function(d) {
                return trans(s(d), 0);
            };
        }

        function translate(x, y) {
            return 'translate(' + x + ', ' + y + ')';
        }

        function translateTransposed(x, y) {
            return 'translate(' + y + ', ' + x + ')';
        }

        function transposeArray(arr) {
            return arr.map(function(d) {
                return [d[1], d[0]];
            });
        }

        function isVertical() {
            return orient === 'left' || orient === 'right';
        }

        var axis = function(selection) {

            selection.each(function(data, index) {

                // Stash a snapshot of the new scale, and retrieve the old snapshot.
                var scaleOld = this.__chart__ || scale;
                this.__chart__ = scale.copy();

                function tryApply(fn, defaultVal) {
                    return scale[fn] ? scale[fn].apply(scale, tickArguments) : defaultVal;
                }

                var ticksArray = tickValues == null ? tryApply('ticks', scale.domain()) : tickValues;
                var tickFormatter = tickFormat == null ? tryApply('tickFormat', fc.util.fn.identity) : tickFormat;

                // orientation logic
                var sign = orient === 'bottom' || orient === 'right' ? 1 : -1;
                var pathTranspose = isVertical() ? transposeArray : fc.util.fn.identity;
                var transform = isVertical() ? translateTransposed : translate;

                var container = d3.select(this);

                // add the domain line
                var range = fc.util.scale.range(scale);
                var domainPathData = pathTranspose([
                      [range[0], sign * outerTickSize],
                      [range[0], 0],
                      [range[1], 0],
                      [range[1], sign * outerTickSize]
                    ]);

                var domainLine = container.selectAll('path.domain')
                    .data([data]);

                domainLine.enter()
                    .append('path')
                    .classed('domain', true);

                d3.transition(domainLine)
                    .attr('d', svgDomainLine(domainPathData));

                // datajoin and construct the ticks / label
                dataJoin.attrs({
                    'class': 'tick',
                    // set the initial tick position based on the previous scale
                    // in order to get the correct enter transition - however, for ordinal
                    // scales the tick will not exist on the old scale, so use the current position
                    'transform': containerTranslate(fc.util.scale.isOrdinal(scale) ? scale : scaleOld, transform)
                });

                var g = dataJoin(container, ticksArray);

                // enter
                var labelOffset = sign * (innerTickSize + tickPadding);
                g.enter().classed('orient-' + orient, true);
                g.enter().append('path');
                g.enter()
                    .append('text')
                    .attr('transform', transform(0, labelOffset));

                // update
                g.attr('transform', containerTranslate(scale, transform));

                g.selectAll('path')
                    .attr('d', function(d) {
                        return svgDomainLine(pathTranspose([
                            [0, 0], [0, sign * innerTickSize]
                        ]));
                    });

                g.selectAll('text')
                   .attr('transform', transform(0, labelOffset))
                   .text(tickFormatter);

                // for non ordinal scales, exit by animating the tick to its new location
                if (!fc.util.scale.isOrdinal(scale)) {
                    g.exit()
                        .attr('transform', containerTranslate(scale, transform));
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

        return axis;

    };
}(d3, fc));
