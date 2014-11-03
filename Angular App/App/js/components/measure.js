define ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

sl.series.measure = function () {

    var target = null,
        series = null,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        startPoint = null,
        endPoint = null,
        formatH = null,
        formatV = null;

    var lineH = null,
        lineV = null,
        gradient = null,
        calloutH = null,
        calloutV = null;

    var drawing = false;

    var measure = function (selection) {

       var root = target.append('g')
            .attr('class', 'measure');

        lineH = root.append("line")
            .attr('class', 'measure horizontal')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1])
            .attr('display', 'none');

        lineV = root.append("line")
            .attr('class', 'measure vertical')
            .attr('y1', yScale.range()[0])
            .attr('y2', yScale.range()[1])
            .attr('display', 'none');

        gradient = root.append("line")
            .attr('class', 'measure gradient')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0)
            .attr('display', 'none');

        calloutH = root.append("text")
            .attr('class', 'measure callout horizontal')
            .attr('x', xScale.range()[1])
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');

        calloutV = root.append("text")
            .attr('class', 'measure callout vertical')
            .attr('y', '1em')
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');
    };

    function mouseclick() {
        if(!drawing) {
            startPoint = { x: d3.mouse(this)[0], y: d3.mouse(this)[1] };
            endPoint = startPoint;
        }
        drawing = !drawing;
    };

    function mousemove() {

        if(!drawing) return;

        endPoint = { x: d3.mouse(this)[0], y: d3.mouse(this)[1] };
        update();
    };

    function update()
    {
        if(!drawing) return;

        lineH.attr('x1', startPoint.x)
            .attr('y1', startPoint.y)
            .attr('x2', endPoint.x)
            .attr('y2', startPoint.y);
        lineV.attr('x1', endPoint.x)
            .attr('y1', startPoint.y)
            .attr('x2', endPoint.x)
            .attr('y2', endPoint.y);
        gradient.attr('x1', startPoint.x)
            .attr('y1', startPoint.y)
            .attr('x2', endPoint.x)
            .attr('y2', endPoint.y);
        calloutH.attr('x', endPoint.x)
            .attr('y', startPoint.y - (startPoint.y - endPoint.y) / 2.0)
            .text(formatV(Math.abs(yScale.invert(endPoint.y) - yScale.invert(startPoint.y))));
        calloutV.attr('y', startPoint.y)
            .attr('x', startPoint.x + (endPoint.x - startPoint.x) / 2.0)
            .text(formatH(Math.abs(xScale.invert(endPoint.x).getTime() - xScale.invert(startPoint.x).getTime())));


        lineH.attr('display', 'inherit');
        lineV.attr('display', 'inherit');
        gradient.attr('display', 'inherit');
        calloutH.attr('display', 'inherit');
        calloutV.attr('display', 'inherit');
    };

    function mouseout() {

        if(drawing == false) return;

        lineH.attr('display', 'none');
        lineV.attr('display', 'none');
        gradient.attr('display', 'none');
        calloutH.attr('display', 'none');
        calloutV.attr('display', 'none');
    };

    measure.target = function (value) {
        if (!arguments.length) {
            return target;
        }

        if (target) {

            target.on('click.measure', null);
            target.on('mousemove.measure', null);
            target.on('mouseout.measure', null);
        }

        target = value;

        target.on('click.measure', mouseclick);
        target.on('mousemove.measure', mousemove);
        target.on('mouseout.measure', mouseout);

        return measure;
    };

    measure.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return measure;
    };

    measure.yScale = function (value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return measure;
    };

    measure.formatH = function (value) {
        if (!arguments.length) {
            return formatH;
        }
        formatH = value;
        return measure;
    };

    measure.formatV = function (value) {
        if (!arguments.length) {
            return formatV;
        }
        formatV = value;
        return measure;
    };

    return measure;
};

});