(function (d3, fc) {
    'use strict';

fc.tools.crosshairs = function () {

    var target = null,
        series = null,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yValue = null,
        formatH = null,
        formatV = null,
        active = true,
        freezable = true,
        padding = 2,
        onSnap = null;

    var lineH = null,
        lineV = null,
        circle = null,
        calloutH = null,
        calloutV = null;

    var highlight = null,
        highlightedField = null;

    var crosshairs = function () {

        var root = target.append('g')
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
            .attr('x', xScale.range()[1] - padding)
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');

        calloutV = root.append("text")
            .attr('class', 'crosshairs callout vertical')
            .attr('y', '1em')
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');
    };

    function mousemove() {

        if (active) {
            crosshairs.update();
        }
    }

    function mouseout() {

        if (active) {
            crosshairs.clear();
        }
    }

    function mouseclick() {

        if (freezable) {
            crosshairs.active(!active);
        }
    }

    function findNearest(xTarget) {

        var nearest = null,
            dx = Number.MAX_VALUE;

        series.forEach(function(data) {

            var xDiff = Math.abs(xTarget.getTime() - data.date.getTime());

            if (xDiff < dx) {
                dx = xDiff;
                nearest = data;
            }
        });

        return nearest;
    }

    function findField(yTarget, data) {

        var field = null;

        var minDiff = Number.MAX_VALUE;
        for (var property in data) {

            if (!data.hasOwnProperty(property) || (property === 'date')) {
                continue;
            }

            var dy = Math.abs(yTarget - data[property]);
            if (dy <= minDiff) {
                minDiff = dy;
                field = property;
            }
        }

        return field;
    }

    function redraw() {

        var x = xScale(highlight.date),
            y = yScale(highlight[highlightedField]);

        lineH.attr('y1', y)
            .attr('y2', y);
        lineV.attr('x1', x)
            .attr('x2', x);
        circle.attr('cx', x)
            .attr('cy', y);
        calloutH.attr('y', y - padding)
            .text(formatH(highlight[highlightedField], highlightedField));
        calloutV.attr('x', x - padding)
            .text(formatV(highlight.date));

        lineH.attr('display', 'inherit');
        lineV.attr('display', 'inherit');
        circle.attr('display', 'inherit');
        calloutH.attr('display', 'inherit');
        calloutV.attr('display', 'inherit');
    }

    crosshairs.update = function() {

        if (!active) {

            redraw();

        } else {

            var mouse = [0, 0];
            try {
                mouse = d3.mouse(target[0][0]);
            }
            catch (exception) {
                // Mouse is elsewhere
            }

            var xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                nearest = findNearest(xMouse);

            if (nearest !== null) {

                var field = null;
                if (nearest[yValue]) {
                    field = yValue;
                } else {
                    field = findField(yMouse, nearest);
                }

                if ((nearest !== highlight) || (field !== highlightedField)) {

                    highlight = nearest;
                    highlightedField = field;

                    redraw();
                    if( onSnap )
                    	onSnap(highlight);
                }
            }
        }
    };

    crosshairs.clear = function() {

        highlight = null;
        highlightedField = null;

        lineH.attr('display', 'none');
        lineV.attr('display', 'none');
        circle.attr('display', 'none');
        calloutH.attr('display', 'none');
        calloutV.attr('display', 'none');
    };

    crosshairs.target = function (value) {
        if (!arguments.length) {
            return target;
        }

        if (target) {

            target.on('mousemove.crosshairs', null);
            target.on('mouseout.crosshairs', null);
            target.on('click.crosshairs', null);
        }

        target = value;

        target.on('mousemove.crosshairs', mousemove);
        target.on('mouseout.crosshairs', mouseout);
        target.on('click.crosshairs', mouseclick);

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

    crosshairs.active = function (value) {
        if (!arguments.length) {
            return active;
        }
        active = value;

        lineH.classed('frozen', !active);
        lineV.classed('frozen', !active);
        circle.classed('frozen', !active);

        return crosshairs;
    };

    crosshairs.freezable = function (value) {
        if (!arguments.length) {
            return freezable;
        }
        freezable = value;
        return crosshairs;
    };

    crosshairs.padding = function (value) {
        if (!arguments.length) {
            return padding;
        }
        padding = value;
        return crosshairs;
    };

    crosshairs.onSnap = function (value) {
        if (!arguments.length) {
            return onSnap;
        }
        onSnap = value;
        return crosshairs;
    };

    crosshairs.highlightedPoint = function() {
        return highlight;
    };

    crosshairs.highlightedField = function() {
        return highlightedField;
    };

    return crosshairs;
};

}(d3, fc));