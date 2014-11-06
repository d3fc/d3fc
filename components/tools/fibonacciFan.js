define ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

    sl.tools.fibonacciFan = function () {

        var target = null,
            series = null,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            active = true;

        var circleOrigin = null,
            circleTarget = null,
            lineSource = null,
            lineA = null,
            lineB = null,
            lineC = null,
            fanArea = null;

        var phase = 1,
            locationOrigin = null,
            locationTarget = null;

        var fibonacciFan = function () {

            var root = target.append('g')
                .attr('class', 'fibonacci-fan');

            circleOrigin = root.append("circle")
                .attr('class', 'fibonacci-fan origin')
                .attr('r', 6)
                .attr('display', 'none');

            circleTarget = root.append("circle")
                .attr('class', 'fibonacci-fan target')
                .attr('r', 6)
                .attr('display', 'none');

            lineSource = root.append("line")
                .attr('class', 'fibonacci-fan source')
                .attr('display', 'none');

            lineA = root.append("line")
                .attr('class', 'fibonacci-fan a')
                .attr('display', 'none');

            lineB = root.append("line")
                .attr('class', 'fibonacci-fan b')
                .attr('display', 'none');

            lineC = root.append("line")
                .attr('class', 'fibonacci-fan c')
                .attr('display', 'none');

            fanArea = root.append("polygon")
                .attr('class', 'fibonacci-fan area')
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
                        fibonacciFan.update();
                        circleOrigin.attr('display', 'inherit');
                    }
                    break;
                }
                case 2: {
                    locationTarget = findLocation();
                    if (locationTarget) {
                        fibonacciFan.update();
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

                    setFan();

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

            var mouse = d3.mouse(target[0][0]),
                xMouse = xScale.invert(mouse[0]),
                yMouse = yScale.invert(mouse[1]),
                point = findPoint(xMouse);

            if (point !== null) {

                var field = findField(yMouse, point);

                if (field !== null) {

                    return { point: point, field: field }
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

        function setFan() {

            if (xScale(locationOrigin.point.date) > xScale(locationTarget.point.date)) {
                var tmp = locationOrigin;
                locationOrigin = locationTarget;
                locationTarget = tmp;
            }

            var originX = xScale(locationOrigin.point.date),
                originY = yScale(locationOrigin.point[locationOrigin.field]),
                targetX = xScale(locationTarget.point.date),
                targetY = yScale(locationTarget.point[locationTarget.field]),
                finalX = xScale.range()[1],
                finalY = calculateY(originX, originY, targetX, targetY, finalX);

            setFanLines(originX, originY, finalX, finalY.source, finalY.source, finalY.source);

            lineA.attr('display', 'inherit');
            lineB.attr('display', 'inherit');
            lineC.attr('display', 'inherit');
            fanArea.attr('display', 'inherit');

            var pointsFinal = originX + ',' + originY
                + ' ' + finalX + ',' + finalY.a
                + ' ' + finalX + ',' + finalY.c;

            lineA.transition()
                .attr('y2', finalY.a);
            lineB.transition()
                .attr('y2', finalY.b);
            lineC.transition()
                .attr('y2', finalY.c);
            fanArea.transition()
                .attr('points', pointsFinal);

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
        }

        function clearAll() {

            locationOrigin = null;
            locationTarget = null;

            circleOrigin.attr('display', 'none');
            circleTarget.attr('display', 'none');
            lineSource.attr('display', 'none');
            lineA.attr('display', 'none');
            lineB.attr('display', 'none');
            lineC.attr('display', 'none');
            fanArea.attr('display', 'none');
        }

        function calculateY(originX, originY, targetX, targetY, finalX) {

            var gradient = (targetY - originY) / (targetX - originX),
                ySource = (gradient * (finalX - originX)) + originY,
                yA = ((gradient * 0.618) * (finalX - originX)) + originY,
                yB = ((gradient * 0.500) * (finalX - originX)) + originY,
                yC = ((gradient * 0.382) * (finalX - originX)) + originY;

            return {source: ySource, a: yA, b: yB, c: yC};
        }

        function setFanLines(originX, originY, finalX, finalYa, finalYb, finalYc) {

            var points = originX + ',' + originY
                + ' ' + finalX + ',' + finalYa
                + ' ' + finalX + ',' + finalYc;

            lineA.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', finalX)
                .attr('y2', finalYa);
            lineB.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', finalX)
                .attr('y2', finalYb);
            lineC.attr('x1', originX)
                .attr('y1', originY)
                .attr('x2', finalX)
                .attr('y2', finalYc);
            fanArea.attr('points', points);
        }

        fibonacciFan.update = function () {

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

                        var finalX = xScale.range()[1],
                            finalY = calculateY(originX, originY, targetX, targetY, finalX);

                        setFanLines(originX, originY, finalX, finalY.a, finalY.b, finalY.c);
                    }
                }
            }
        };

        fibonacciFan.visible = function (value) {

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
                        lineA.attr('display', 'inherit');
                        lineB.attr('display', 'inherit');
                        lineC.attr('display', 'inherit');
                        fanArea.attr('display', 'inherit');
                        break;
                    }
                }
            } else {

                circleOrigin.attr('display', 'none');
                circleTarget.attr('display', 'none');
                lineSource.attr('display', 'none');
                lineA.attr('display', 'none');
                lineB.attr('display', 'none');
                lineC.attr('display', 'none');
                fanArea.attr('display', 'none');
            }
        };

        fibonacciFan.target = function (value) {
            if (!arguments.length) {
                return target;
            }

            if (target) {

                target.on('mousemove.fibonacci-fan', null);
                target.on('click.fibonacci-fan', null);
            }

            target = value;

            target.on('mousemove.fibonacci-fan', mousemove);
            target.on('click.fibonacci-fan', mouseclick);

            return fibonacciFan;
        };

        fibonacciFan.series = function (value) {
            if (!arguments.length) {
                return series;
            }
            series = value;
            return fibonacciFan;
        };

        fibonacciFan.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return fibonacciFan;
        };

        fibonacciFan.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return fibonacciFan;
        };

        fibonacciFan.active = function (value) {
            if (!arguments.length) {
                return active;
            }
            active = value;
            return fibonacciFan;
        };

        return fibonacciFan;
    };

});