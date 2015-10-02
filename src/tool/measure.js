import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import {noop} from '../util/fn';
import {noSnap} from '../util/snap';

export default function() {

    var event = d3.dispatch('measuresource', 'measuretarget', 'measureclear'),
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        snap = function(x, y) {
            return noSnap(xScale, yScale)(x, y);
        },
        decorate = noop,
        xLabel = d3.functor(''),
        yLabel = d3.functor(''),
        padding = d3.functor(2);

    var x = function(d) { return d.xInDomainUnits ? xScale(d.x) : d.x; },
        y = function(d) { return d.yInDomainUnits ? yScale(d.y) : d.y; };

    var dataJoin = _dataJoin()
        .selector('g.measure')
        .element('g')
        .attr('class', 'measure');

    var measure = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this)
                .style('pointer-events', 'all')
                .on('mouseenter.measure', mouseenter);

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

            var enter = g.enter();
            enter.append('line')
                .attr('class', 'tangent');
            enter.append('line')
                .attr('class', 'horizontal');
            enter.append('line')
                .attr('class', 'vertical');
            enter.append('text')
                .attr('class', 'horizontal');
            enter.append('text')
                .attr('class', 'vertical');

            g.select('line.tangent')
                .attr('x1', function(d) { return x(d.source); })
                .attr('y1', function(d) { return y(d.source); })
                .attr('x2', function(d) { return x(d.target); })
                .attr('y2', function(d) { return y(d.target); });

            g.select('line.horizontal')
                .attr('x1', function(d) { return x(d.source); })
                .attr('y1', function(d) { return y(d.source); })
                .attr('x2', function(d) { return x(d.target); })
                .attr('y2', function(d) { return y(d.source); })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

            g.select('line.vertical')
                .attr('x1', function(d) { return x(d.target); })
                .attr('y1', function(d) { return y(d.target); })
                .attr('x2', function(d) { return x(d.target); })
                .attr('y2', function(d) { return y(d.source); })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

            var paddingValue = padding.apply(this, arguments);

            g.select('text.horizontal')
                .attr('x', function(d) { return x(d.source) + (x(d.target) - x(d.source)) / 2; })
                .attr('y', function(d) { return y(d.source) - paddingValue; })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                .text(xLabel);

            g.select('text.vertical')
                .attr('x', function(d) { return x(d.target) + paddingValue; })
                .attr('y', function(d) { return y(d.source) + (y(d.target) - y(d.source)) / 2; })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                .text(yLabel);

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
            .on('click.measure', mouseclick)
            .on('mousemove.measure', mousemove)
            .on('mouseleave.measure', mouseleave);
        var data = container.datum();
        if (data[0] === null) {
            data.push({
                state: 'SELECT_SOURCE'
            });
        }
        updatePositions.call(this);
        container.call(measure);
    }

    function mousemove() {
        var container = d3.select(this);
        updatePositions.call(this);
        container.call(measure);
    }

    function mouseleave() {
        var container = d3.select(this);
        var data = container.datum();
        if (data[0] !== null && data[0].state === 'SELECT_SOURCE') {
            data.pop();
        }
        container.on('click.measure', null)
            .on('mousemove.measure', null)
            .on('mouseleave.measure', null);
    }

    function mouseclick() {
        var container = d3.select(this);
        var datum = container.datum()[0];
        switch (datum.state) {
        case 'SELECT_SOURCE':
            updatePositions.call(this);
            event.measuresource.apply(this, arguments);
            datum.state = 'SELECT_TARGET';
            break;
        case 'SELECT_TARGET':
            updatePositions.call(this);
            event.measuretarget.apply(this, arguments);
            datum.state = 'DONE';
            break;
        case 'DONE':
            event.measureclear.apply(this, arguments);
            datum.state = 'SELECT_SOURCE';
            updatePositions.call(this);
            break;
        default:
            throw new Error('Unknown state ' + datum.state);
        }
        container.call(measure);
    }

    measure.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return measure;
    };
    measure.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return measure;
    };
    measure.snap = function(x) {
        if (!arguments.length) {
            return snap;
        }
        snap = x;
        return measure;
    };
    measure.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return measure;
    };
    measure.xLabel = function(x) {
        if (!arguments.length) {
            return xLabel;
        }
        xLabel = d3.functor(x);
        return measure;
    };
    measure.yLabel = function(x) {
        if (!arguments.length) {
            return yLabel;
        }
        yLabel = d3.functor(x);
        return measure;
    };
    measure.padding = function(x) {
        if (!arguments.length) {
            return padding;
        }
        padding = d3.functor(x);
        return measure;
    };

    d3.rebind(measure, event, 'on');

    return measure;
}
