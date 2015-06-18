(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend'),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            snap = function(x, y) {
                return fc.utilities.noSnap(xScale, yScale)(x, y);
            },
            decorate = fc.utilities.fn.noop;

        var x = function(d) { return d.xInDomainUnits ? xScale(d.x) : d.x; },
            y = function(d) { return d.yInDomainUnits ? yScale(d.y) : d.y; };

        var dataJoin = fc.utilities.dataJoin()
            .children(true)
            .selector('g.crosshair')
            .element('g')
            .attrs({'class': 'crosshair'});

        var horizontalLine = fc.tools.line()
            .value(y)
            .label(function(d) { return d.y; });

        var verticalLine = fc.tools.line()
            .orient('vertical')
            .value(x)
            .label(function(d) { return d.x; });

        // the line annotations used to render the crosshair are positioned using
        // screen coordinates. This function constructs a suitable scale for rendering
        // these annotations.
        function identityScale(scale) {
            return d3.scale.linear()
                // the default range is [0, 1]
                .range(scale.range())
                .domain(scale.range());
        }


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

                var crosshair = dataJoin(container, data);

                var trackballTranslate = function(d) {
                    return 'translate(' + x(d) + ', ' + y(d) + ')';
                };
                crosshair.enter()
                    .style('pointer-events', 'none')
                    .append('g')
                    .classed('trackball', true)
                    .attr('transform', trackballTranslate)
                    .append('circle')
                    .attr('r', 5);

                crosshair.select('g.trackball')
                    .attr('transform', trackballTranslate);

                var multi = fc.series.multi()
                    .series([horizontalLine, verticalLine])
                    .xScale(identityScale(xScale))
                    .yScale(identityScale(yScale))
                    .mapping(function(data) {
                        return [data];
                    });

                crosshair.call(multi);

                decorate(crosshair);
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

        d3.rebind(crosshairs, event, 'on');

        fc.utilities.rebind(crosshairs, horizontalLine, {
            yLabel: 'label'
        });

        fc.utilities.rebind(crosshairs, verticalLine, {
            xLabel: 'label'
        });

        return crosshairs;
    };

}(d3, fc));
