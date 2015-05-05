(function(d3, fc) {
    'use strict';

    fc.tools.fibonacciFan = function() {

        var event = d3.dispatch('fansource', 'fantarget', 'fanclear');

        var fan = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__fan__) {
                    data.__fan__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.fan', mouseenter);

                if (!data.__fan__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__fan__.overlay = true;
                }

                container.select('rect')
                    .attr('x', fan.xScale.value.range()[0])
                    .attr('y', fan.yScale.value.range()[1])
                    .attr('width', fan.xScale.value.range()[1])
                    .attr('height', fan.yScale.value.range()[0]);

                var g = fc.utilities.simpleDataJoin(container, 'fan', data);

                g.each(function(d) {
                    d.x = fan.xScale.value.range()[1];
                    d.ay = d.by = d.cy = d.target.y;

                    if (d.source.x !== d.target.x) {

                        if (d.state === 'DONE' && d.source.x > d.target.x) {
                            var temp = d.source;
                            d.source = d.target;
                            d.target = temp;
                        }

                        var gradient = (d.target.y - d.source.y) /
                            (d.target.x - d.source.x);
                        var deltaX = d.x - d.source.x;
                        var deltaY = gradient * deltaX;
                        d.ay = 0.618 * deltaY + d.source.y;
                        d.by = 0.500 * deltaY + d.source.y;
                        d.cy = 0.382 * deltaY + d.source.y;
                    }
                });

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'trend');
                enter.append('line')
                    .attr('class', 'a');
                enter.append('line')
                    .attr('class', 'b');
                enter.append('line')
                    .attr('class', 'c');
                enter.append('polygon')
                    .attr('class', 'area');

                g.select('line.trend')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                g.select('line.a')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.ay; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.b')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.by; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.c')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.cy; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('polygon.area')
                    .attr('points', function(d) {
                        return d.source.x + ',' + d.source.y + ' ' +
                            d.x + ',' + d.ay + ' ' +
                            d.x + ',' + d.cy;
                    })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                fan.decorate.value(g);
            });
        };

        function updatePositions() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            if (datum.state !== 'DONE') {
                var mouse = d3.mouse(this);
                var snapped = fan.snap.value.apply(this, mouse);
                if (datum.state === 'SELECT_SOURCE') {
                    datum.source = datum.target = snapped;
                } else if (datum.state === 'SELECT_TARGET') {
                    datum.target = snapped;
                } else {
                    throw new Error('Unknown state ' + datum.state);
                }
            }
        }

        function mouseenter() {
            var container = d3.select(this)
                .on('click.fan', mouseclick)
                .on('mousemove.fan', mousemove)
                .on('mouseleave.fan', mouseleave);
            var data = container.datum();
            if (data[0] == null) {
                data.push({
                    state: 'SELECT_SOURCE'
                });
            }
            updatePositions.call(this);
            container.call(fan);
        }

        function mousemove() {
            var container = d3.select(this);
            updatePositions.call(this);
            container.call(fan);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
                data.pop();
            }
            container.on('click.fan', null)
                .on('mousemove.fan', null)
                .on('mouseleave.fan', null);
        }

        function mouseclick() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            switch (datum.state) {
                case 'SELECT_SOURCE':
                    updatePositions.call(this);
                    event.fansource.apply(this, arguments);
                    datum.state = 'SELECT_TARGET';
                    break;
                case 'SELECT_TARGET':
                    updatePositions.call(this);
                    event.fantarget.apply(this, arguments);
                    datum.state = 'DONE';
                    break;
                case 'DONE':
                    event.fanclear.apply(this, arguments);
                    datum.state = 'SELECT_SOURCE';
                    updatePositions.call(this);
                    break;
                default:
                    throw new Error('Unknown state ' + datum.state);
            }
            container.call(fan);
        }

        fan.xScale = fc.utilities.property(d3.time.scale());
        fan.yScale = fc.utilities.property(d3.scale.linear());
        fan.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        fan.decorate = fc.utilities.property(fc.utilities.fn.noop);

        d3.rebind(fan, event, 'on');

        return fan;
    };

}(d3, fc));