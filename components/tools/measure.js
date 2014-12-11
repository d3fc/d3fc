(function(d3, fc) {
    'use strict';

    fc.tools.measure = function() {

        var target = null,
            series = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            active = true,
            padding = 2,
            formatH = function(d) { return d; },
            formatV = function(d) { return d; };

        var circleOrigin = null,
            circleTarget = null,
            lineSource = null,
            lineX = null,
            lineY = null,
            calloutX = null,
            calloutY = null;

        var phase = 1,
            locationOrigin = null,
            locationTarget = null;

        var measure = function() {

            var root = target.append('g')
                .attr('class', 'measure');

            circleOrigin = root.append('circle')
                .attr('class', 'measure origin')
                .attr('r', 6)
                .attr('display', 'none');

            circleTarget = root.append('circle')
                .attr('class', 'measure target')
                .attr('r', 6)
                .attr('display', 'none');

            lineSource = root.append('line')
                .attr('class', 'measure source')
                .attr('display', 'none');

            lineX = root.append('line')
                .attr('class', 'measure x')
                .attr('display', 'none');

            lineY = root.append('line')
                .attr('class', 'measure y')
                .attr('display', 'none');

            calloutX = root.append('text')
                .attr('class', 'measure callout horizontal')
                .attr('style', 'text-anchor: end')
                .attr('display', 'none');

            calloutY = root.append('text')
                .attr('class', 'measure callout vertical')
                .attr('style', 'text-anchor: middle')
                .attr('display', 'none');
        };

        function mousemove() {

            if (!active) {
                return;
            }

            switch (phase) {
                case 1: {
                    locationOrigin = findLocation();
                    if (locationOrigin) {
                        measure.update();
                        circleOrigin.attr('display', 'inherit');
                    }
                    break;
                }
                case 2: {
                    locationTarget = findLocation();
                    if (locationTarget) {
                        measure.update();
                        circleTarget.attr('display', 'inherit');
                        lineSource.attr('display', 'inherit');
                    }
                    break;
                }
                case 3: {
                    break;
                }
            }
        }

        function mouseclick() {

            if (!active) {
                return;
            }

            switch (phase) {
                case 1: {

                    phase = 2;
                    break;
                }
                case 2: {

                    doMeasure();

                    phase = 3;
                    break;
                }
                case 3: {

                    clearAll();

                    phase = 1;
                    break;
                }
            }
        }

        function findLocation() {

            var mouse = [0, 0];
            try {
                mouse = d3.mouse(target[0][0]);
            }
            catch (exception) {
                // Mouse is elsewhere
            }

            var xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                point = findPoint(xMouse);

            if (point !== null) {

                var field = findField(yMouse, point);

                if (field !== null) {

                    return {point: point, field: field};
                }
            }

            return null;
        }

        function findPoint(xTarget) {

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
                if (data.hasOwnProperty(property) && (property !== 'date')) {
                    var dy = Math.abs(yTarget - data[property]);
                    if (dy <= minDiff) {
                        minDiff = dy;
                        field = property;
                    }
                }
            }

            return field;
        }

        function doMeasure() {

            var originX = xScale(locationOrigin.point.date),
                originY = yScale(locationOrigin.point[locationOrigin.field]),
                targetX = xScale(locationTarget.point.date),
                targetY = yScale(locationTarget.point[locationTarget.field]);

            lineX.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', targetX)
                .attr('y2', originY);
            lineY.attr('x1', targetX)
                .attr('y1', originY)
                .attr('x2', targetX)
                .attr('y2', targetY);

            var field = locationTarget.field;

            calloutX.attr('x', targetX - padding)
                .attr('y', originY - (originY - targetY) / 2.0)
                .text(formatV(Math.abs(locationTarget.point[field] - locationOrigin.point[field])));

            calloutY.attr('y', originY - padding)
                .attr('x', originX + (targetX - originX) / 2.0)
                .text(formatH(Math.abs(locationTarget.point.date.getTime() - locationOrigin.point.date.getTime())));

            lineX.attr('display', 'inherit');
            lineY.attr('display', 'inherit');
            calloutX.attr('display', 'inherit');
            calloutY.attr('display', 'inherit');

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
        }

        function clearAll() {

            locationOrigin = null;
            locationTarget = null;

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
            lineSource.attr('display', 'none');
            lineX.attr('display', 'none');
            lineY.attr('display', 'none');
            calloutX.attr('display', 'none');
            calloutY.attr('display', 'none');
        }

        measure.update = function() {

            if (locationOrigin) {

                var originX = xScale(locationOrigin.point.date),
                    originY = yScale(locationOrigin.point[locationOrigin.field]);

                circleOrigin.attr('cx', originX)
                    .attr('cy', originY);
                lineSource.attr('x1', originX)
                    .attr('y1', originY);

                if (locationTarget && (phase !== 1)) {

                    var targetX = xScale(locationTarget.point.date),
                        targetY = yScale(locationTarget.point[locationTarget.field]);

                    circleTarget.attr('cx', targetX)
                        .attr('cy', targetY);
                    lineSource.attr('x2', targetX)
                        .attr('y2', targetY);

                    if (phase === 3) {

                        doMeasure();
                    }
                }
            }
        };

        measure.visible = function(value) {

            if (value) {

                switch (phase) {
                    case 1: {
                        circleOrigin.attr('display', 'inherit');
                        break;
                    }
                    case 2: {
                        circleOrigin.attr('display', 'inherit');
                        circleTarget.attr('display', 'inherit');
                        lineSource.attr('display', 'inherit');
                        break;
                    }
                    case 3: {
                        lineSource.attr('display', 'inherit');
                        lineX.attr('display', 'inherit');
                        lineY.attr('display', 'inherit');
                        calloutX.attr('display', 'inherit');
                        calloutY.attr('display', 'inherit');
                        break;
                    }
                }
            } else {

                circleOrigin.attr('display', 'none');
                circleTarget.attr('display', 'none');
                lineSource.attr('display', 'none');
                lineX.attr('display', 'none');
                lineY.attr('display', 'none');
                calloutX.attr('display', 'none');
                calloutY.attr('display', 'none');
            }
        };

        measure.target = function(value) {
            if (!arguments.length) {
                return target;
            }

            if (target) {

                target.on('mousemove.measure', null);
                target.on('click.measure', null);
            }

            target = value;

            target.on('mousemove.measure', mousemove);
            target.on('click.measure', mouseclick);

            return measure;
        };

        measure.series = function(value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return measure;
        };

        measure.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return measure;
        };

        measure.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return measure;
        };

        measure.active = function(value) {
            if (!arguments.length) {
                return active;
            }
            active = value;
            return measure;
        };

        measure.padding = function(value) {
            if (!arguments.length) {
                return padding;
            }
            padding = value;
            return measure;
        };

        measure.formatH = function(value) {
            if (!arguments.length) {
                return formatH;
            }
            formatH = value;
            return measure;
        };

        measure.formatV = function(value) {
            if (!arguments.length) {
                return formatV;
            }
            formatV = value;
            return measure;
        };

        return measure;
    };

}(d3, fc));