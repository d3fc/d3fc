import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import {noop} from '../util/fn';
import {noSnap} from '../util/snap';

export default function() {

    var event = d3.dispatch('fansource', 'fantarget', 'fanclear'),
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        snap = function(x, y) {
            return noSnap(xScale, yScale)(x, y);
        },
        decorate = noop;

    var x = function(d) { return d.xInDomainUnits ? xScale(d.x) : d.x; },
        y = function(d) { return d.yInDomainUnits ? yScale(d.y) : d.y; };

    var dataJoin = _dataJoin()
        .selector('g.fan')
        .element('g')
        .attr('class', 'fan');

    var fan = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this)
                .style('pointer-events', 'all')
                .on('mouseenter.fan', mouseenter);

            var overlay = container.selectAll('rect')
                .data([data]);

            overlay.enter()
                .append('rect')
                .style('visibility', 'hidden');

            container.select('rect')
                .attr('x', xScale.range()[0])
                .attr('y', yScale.range()[1])
                .attr('width', xScale.range()[1])
                .attr('height', yScale.range()[0]);

            var g = dataJoin(container, data);

            g.each(function(d) {
                d.x = xScale.range()[1];
                d.ay = d.by = d.cy = y(d.target);

                if (x(d.source) !== x(d.target)) {

                    if (d.state === 'DONE' && x(d.source) > x(d.target)) {
                        var temp = d.source;
                        d.source = d.target;
                        d.target = temp;
                    }

                    var gradient = (y(d.target) - y(d.source)) /
                        (x(d.target) - x(d.source));
                    var deltaX = d.x - x(d.source);
                    var deltaY = gradient * deltaX;
                    d.ay = 0.618 * deltaY + y(d.source);
                    d.by = 0.500 * deltaY + y(d.source);
                    d.cy = 0.382 * deltaY + y(d.source);
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
                .attr('x1', function(d) { return x(d.source); })
                .attr('y1', function(d) { return y(d.source); })
                .attr('x2', function(d) { return x(d.target); })
                .attr('y2', function(d) { return y(d.target); });

            g.select('line.a')
                .attr('x1', function(d) { return x(d.source); })
                .attr('y1', function(d) { return y(d.source); })
                .attr('x2', function(d) { return d.x; })
                .attr('y2', function(d) { return d.ay; })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

            g.select('line.b')
                .attr('x1', function(d) { return x(d.source); })
                .attr('y1', function(d) { return y(d.source); })
                .attr('x2', function(d) { return d.x; })
                .attr('y2', function(d) { return d.by; })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

            g.select('line.c')
                .attr('x1', function(d) { return x(d.source); })
                .attr('y1', function(d) { return y(d.source); })
                .attr('x2', function(d) { return d.x; })
                .attr('y2', function(d) { return d.cy; })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

            g.select('polygon.area')
                .attr('points', function(d) {
                    return x(d.source) + ',' + y(d.source) + ' ' +
                        d.x + ',' + d.ay + ' ' +
                        d.x + ',' + d.cy;
                })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

            decorate(g, data, index);
        });
    };

    function updatePositions() {
        var container = d3.select(this);
        var datum = container.datum()[0];
        if (datum.state !== 'DONE') {
            var mouse = d3.mouse(this);
            var snapped = snap.apply(this, mouse);
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
        if (data[0] === null) {
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
        if (data[0] !== null && data[0].state === 'SELECT_SOURCE') {
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

    fan.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return fan;
    };
    fan.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return fan;
    };
    fan.snap = function(x) {
        if (!arguments.length) {
            return snap;
        }
        snap = x;
        return fan;
    };
    fan.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return fan;
    };

    d3.rebind(fan, event, 'on');

    return fan;
}
