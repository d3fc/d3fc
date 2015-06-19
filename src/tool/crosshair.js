(function(d3, fc) {
    'use strict';

    fc.tool.crosshair = function() {

        var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend'),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            snap = function(x, y) {
                return fc.util.noSnap(xScale, yScale)(x, y);
            },
            decorate = fc.util.fn.noop;

        var x = function(d) { return d.xInDomainUnits ? xScale(d.x) : d.x; },
            y = function(d) { return d.yInDomainUnits ? yScale(d.y) : d.y; };

        var dataJoin = fc.util.dataJoin()
            .children(true)
            .selector('g.crosshair')
            .element('g')
            .attrs({'class': 'crosshair'});

        var horizontalLine = fc.tool.line()
            .value(y)
            .label(function(d) { return d.y; });

        var verticalLine = fc.tool.line()
            .orient('vertical')
            .value(x)
            .label(function(d) { return d.x; });

        // ordinal axes have a rangeExtent function, this adds any padding that
        // was applied to the range. This functions returns the rangeExtent
        // if present, or range otherwise
        function range(scale) {
            return scale.rangeExtent ? scale.rangeExtent() : scale.range();
        }

        // the line annotations used to render the crosshair are positioned using
        // screen coordinates. This function constructs a suitable scale for rendering
        // these annotations.
        function identityScale(scale) {
            return d3.scale.identity()
                .range(range(scale));
        }


        var crosshair = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.crosshair', mouseenter);

                var overlay = container.selectAll('rect')
                    .data([data]);

                overlay.enter()
                    .append('rect')
                    .style('visibility', 'hidden');

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
                    .mapping(function() {
                        return [this];
                    });

                crosshair.call(multi);

                decorate(crosshair);
            });
        };

        function mouseenter() {
            var mouse = d3.mouse(this);
            var container = d3.select(this)
                .on('mousemove.crosshair', mousemove)
                .on('mouseleave.crosshair', mouseleave);
            var snapped = snap.apply(this, mouse);
            var data = container.datum();
            data.push(snapped);
            container.call(crosshair);
            event.trackingstart.apply(this, arguments);
        }

        function mousemove() {
            var mouse = d3.mouse(this);
            var container = d3.select(this);
            var snapped = snap.apply(this, mouse);
            var data = container.datum();
            data[data.length - 1] = snapped;
            container.call(crosshair);
            event.trackingmove.apply(this, arguments);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            data.pop();
            container.call(crosshair)
                .on('mousemove.crosshair', null)
                .on('mouseleave.crosshair', null);
            event.trackingend.apply(this, arguments);
        }

        crosshair.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return crosshair;
        };
        crosshair.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return crosshair;
        };
        crosshair.snap = function(x) {
            if (!arguments.length) {
                return snap;
            }
            snap = x;
            return crosshair;
        };
        crosshair.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return crosshair;
        };

        d3.rebind(crosshair, event, 'on');

        fc.util.rebind(crosshair, horizontalLine, {
            yLabel: 'label'
        });

        fc.util.rebind(crosshair, verticalLine, {
            xLabel: 'label'
        });

        return crosshair;
    };

}(d3, fc));
