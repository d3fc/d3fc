define ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

sl.series.crosshairs = function () {

    var target = null,
        series = null,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yValue = 'y',
        yNearestValue = '',
        formatH = null,
        formatV = null,
        onSnap = null,
        lastSnap = { x: null, y: null }

    var lineH = null,
        lineV = null,
        circle = null,
        calloutH = null,
        calloutV = null;

    var highlight = null;
    var root = null;

    var crosshairs = function (selection) {

        root = target.append('g')
            .attr('class', 'crosshairs');

        lineH = root.append("line")
            .attr('class', 'crosshairs horizontal')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1])
            .attr('display', 'none');

        lineV = root.append("line")
            .attr('class', 'crosshairs vertical')
            .attr('y1', yScale.range()[0])
            .attr('y2', yScale.range()[1])
            .attr('display', 'none');

        circle = root.append("circle")
            .attr('class', 'crosshairs circle')
            .attr('r', 6)
            .attr('display', 'none');

        calloutH = root.append("text")
            .attr('class', 'crosshairs callout horizontal')
            .attr('x', xScale.range()[1])
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');

        calloutV = root.append("text")
            .attr('class', 'crosshairs callout vertical')
            .attr('y', '1em')
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');
    };

    function update()
    {
        var x = xScale(highlight.date),
            y = yScale(highlight[yNearestValue]);

        lineH.attr('y1', y)
            .attr('y2', y);
        lineV.attr('x1', x)
            .attr('x2', x);
        circle.attr('cx', x)
            .attr('cy', y);
        calloutH.attr('y', y)
            .text(yNearestValue + ": " + formatH(highlight[yNearestValue]));
        calloutV.attr('x', x)
            .text(formatV(highlight.date));

        lineH.attr('display', 'inherit');
        lineV.attr('display', 'inherit');
        circle.attr('display', 'inherit');
        calloutH.attr('display', 'inherit');
        calloutV.attr('display', 'inherit');
    };

    function mousemove() {

        var xMouse = xScale.invert(d3.mouse(this)[0]),
            yMouse = yScale.invert(d3.mouse(this)[1]),
            nearest = findNearest(xMouse, yMouse);

        if ((nearest !== null) /*&& (nearest !== highlight) && (yNearestValue !== yLastNearestValue)*/) {
            highlight = nearest;
            update();

            if(onSnap) {
                var snap = { x: highlight.date, y: highlight[yNearestValue] };
                if( lastSnap.x != snap.x && lastSnap.y != snap.y ) {
                    onSnap(snap);
                    lastSnap = snap;
                }
            }
        }
    };

    function mouseout() {

        highlight = null;

        lineH.attr('display', 'none');
        lineV.attr('display', 'none');
        circle.attr('display', 'none');
        calloutH.attr('display', 'none');
        calloutV.attr('display', 'none');
    };

    function findNearest(xTarget, yTarget) {

        var nearest = null,
            dx = Number.MAX_VALUE;

        if(!series) return null;

        series.forEach(function(data) {

            console.log("X:" + xTarget + ", Y:" + data.date);

            var xDiff = Math.abs(xTarget.getTime() - data.date.getTime());

            if (xDiff < dx) {
                dx = xDiff;
                nearest = data;
            }
        });
                
        if(yValue.length <= 0) {
            var yDiff = Number.MAX_VALUE;
            if(Math.abs(yTarget - nearest.high) <= yDiff) { yDiff = Math.abs(yTarget - nearest.high); yNearestValue = 'high'; }
            if(Math.abs(yTarget - nearest.low) <= yDiff) { yDiff = Math.abs(yTarget - nearest.low); yNearestValue = 'low'; }
            if(Math.abs(yTarget - nearest.open) <= yDiff) { yDiff = Math.abs(yTarget - nearest.open); yNearestValue = 'open'; }
            if(Math.abs(yTarget - nearest.close) <= yDiff) { yDiff = Math.abs(yTarget - nearest.close); yNearestValue = 'close'; }
        } 
        else yNearestValue = yValue;

        return nearest;
    }

    crosshairs.target = function (value) {
        if (!arguments.length) {
            return target;
        }

        if (target) {

            target.on('mousemove.crosshairs', null);
            target.on('mouseout.crosshairs', null);
        }

        target = value;

        target.on('mousemove.crosshairs', mousemove);
        target.on('mouseout.crosshairs', mouseout);

        return crosshairs;
    };

    crosshairs.series = function (value) {
        if (!arguments.length) {
            return series;
        }
        series = value;
        return crosshairs;
    };

    crosshairs.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return crosshairs;
    };

    crosshairs.yScale = function (value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return crosshairs;
    };

    crosshairs.yValue = function (value) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = value;
        return crosshairs;
    };

    crosshairs.formatH = function (value) {
        if (!arguments.length) {
            return formatH;
        }
        formatH = value;
        return crosshairs;
    };

    crosshairs.formatV = function (value) {
        if (!arguments.length) {
            return formatV;
        }
        formatV = value;
        return crosshairs;
    };

    crosshairs.onSnap = function (value) {
        if (!arguments.length) {
            return onSnap;
        }
        onSnap = value;
        return crosshairs;
    };

    return crosshairs;
};

});