(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend'),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            snap = function(x, y) {
                return fc.utilities.noSnap(xScale, yScale)(x, y);
            },
            decorate = fc.utilities.fn.noop,
            xLabel = d3.functor(''),
            yLabel = d3.functor(''),
            padding = d3.functor(2);

        var x = function(d) { return d.xInDomainUnits ? xScale(d.x) : d.x; },
            y = function(d) { return d.yInDomainUnits ? yScale(d.y) : d.y; };

        var crosshairs = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.crosshairs', mouseenter);

                var overlay = container.selectAll('rect')
                    .data([data]);

                overlay.enter()
                    .append('rect')
                    .style('visibility', 'hidden');

                // ordinal axes have a rangeExtent function, this adds any padding that
                // was applied to the range. This functions returns the rangeExtent
                // if present, or range otherwise
                function range(scale) {
                    return scale.rangeExtent ? scale.rangeExtent() : scale.range();
                }

                container.select('rect')
                    .attr('x', range(xScale)[0])
                    .attr('y', range(yScale)[1])
                    .attr('width', range(xScale)[1])
                    .attr('height', range(yScale)[0]);

                var g = fc.utilities.simpleDataJoin(container, 'crosshairs', data);

                var enter = g.enter()
                    .style('pointer-events', 'none');
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.horizontal')
                    .attr('x1', range(xScale)[0])
                    .attr('x2', range(xScale)[1])
                    .attr('y1', y)
                    .attr('y2', y);

                g.select('line.vertical')
                    .attr('y1', range(yScale)[0])
                    .attr('y2', range(yScale)[1])
                    .attr('x1', x)
                    .attr('x2', x);

                var paddingValue = padding.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', range(xScale)[1] - paddingValue)
                    .attr('y', function(d) {
                        return y(d) - paddingValue;
                    })
                    .text(yLabel);

                g.select('text.vertical')
                    .attr('x', function(d) {
                        return x(d) - paddingValue;
                    })
                    .attr('y', paddingValue)
                    .text(xLabel);

                decorate(g);
            });
        };

        function mouseenter() {
            var mouse = d3.mouse(this);
            var container = d3.select(this)
                .on('mousemove.crosshairs', mousemove)
                .on('mouseleave.crosshairs', mouseleave);
            var snapped = snap.apply(this, mouse);
            var data = container.datum();
            data.push(snapped);
            container.call(crosshairs);
            event.trackingstart.apply(this, arguments);
        }

        function mousemove() {
            var mouse = d3.mouse(this);
            var container = d3.select(this);
            var snapped = snap.apply(this, mouse);
            var data = container.datum();
            data[data.length - 1] = snapped;
            container.call(crosshairs);
            event.trackingmove.apply(this, arguments);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            data.pop();
            container.call(crosshairs)
                .on('mousemove.crosshairs', null)
                .on('mouseleave.crosshairs', null);
            event.trackingend.apply(this, arguments);
        }

        crosshairs.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return crosshairs;
        };
        crosshairs.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return crosshairs;
        };
        crosshairs.snap = function(x) {
            if (!arguments.length) {
                return snap;
            }
            snap = x;
            return crosshairs;
        };
        crosshairs.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return crosshairs;
        };
        crosshairs.xLabel = function(x) {
            if (!arguments.length) {
                return xLabel;
            }
            xLabel = d3.functor(x);
            return crosshairs;
        };
        crosshairs.yLabel = function(x) {
            if (!arguments.length) {
                return yLabel;
            }
            yLabel = d3.functor(x);
            return crosshairs;
        };
        crosshairs.padding = function(x) {
            if (!arguments.length) {
                return padding;
            }
            padding = d3.functor(x);
            return crosshairs;
        };

        d3.rebind(crosshairs, event, 'on');

        return crosshairs;
    };

}(d3, fc));
