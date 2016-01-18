import d3 from 'd3';
import _dataJoin from '../util/dataJoin';
import line from '../annotation/line';
import _multi from '../series/multi';
import {noop} from '../util/fn';
import {noSnap} from '../util/snap';
import point from '../series/point';
import {range} from '../util/scale';
import {rebind} from '../util/rebind';

export default function() {

    var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend'),
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        snap = function(_x, _y) {
            return noSnap(xScale, yScale)(_x, _y);
        },
        decorate = noop;

    var x = function(d) { return d.x; },
        y = function(d) { return d.y; };

    var dataJoin = _dataJoin()
        .children(true)
        .selector('g.crosshair')
        .element('g')
        .attr('class', 'crosshair');

    var pointSeries = point()
        .xValue(x)
        .yValue(y);

    var horizontalLine = line()
        .value(y)
        .label(function(d) { return d.y; });

    var verticalLine = line()
        .orient('vertical')
        .value(x)
        .label(function(d) { return d.x; });

    // the line annotations used to render the crosshair are positioned using
    // screen coordinates. This function constructs a suitable scale for rendering
    // these annotations.
    function identityScale(scale) {
        return d3.scale.identity()
            .range(range(scale));
    }

    var crosshair = function(selection) {

        selection.each(function(data, index) {

            var container = d3.select(this)
                .style('pointer-events', 'all')
                .on('mouseenter.crosshair', mouseenter)
                .on('mousemove.crosshair', mousemove)
                .on('wheel.crosshair', mousemove)
                .on('mouseleave.crosshair', mouseleave);

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

            var crosshairElement = dataJoin(container, data);

            crosshairElement.enter()
                .style('pointer-events', 'none');

            var multi = _multi()
                .series([horizontalLine, verticalLine, pointSeries])
                .xScale(identityScale(xScale))
                .yScale(identityScale(yScale))
                .mapping(function() {
                    return [this];
                });

            crosshairElement.call(multi);

            decorate(crosshairElement, data, index);
        });
    };

    function mouseenter() {
        var mouse = d3.mouse(this);
        var container = d3.select(this);
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
        container.call(crosshair);
        event.trackingend.apply(this, arguments);
    }

    crosshair.xScale = function(_x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = _x;
        return crosshair;
    };
    crosshair.yScale = function(_x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = _x;
        return crosshair;
    };
    crosshair.snap = function(_x) {
        if (!arguments.length) {
            return snap;
        }
        snap = _x;
        return crosshair;
    };
    crosshair.decorate = function(_x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = _x;
        return crosshair;
    };

    d3.rebind(crosshair, event, 'on');

    rebind(crosshair, horizontalLine, {
        yLabel: 'label'
    });

    rebind(crosshair, verticalLine, {
        xLabel: 'label'
    });

    return crosshair;
}
