import d3 from 'd3';

export default function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        y0Value = d3.functor(0),
        x0Value = d3.functor(0),
        xValue = function (d, i) { return d.date; },
        yValue = function (d, i) { return d.close; };

    function base() { }

    base.x0 = function (d, i) {
        return xScale(x0Value(d, i));
    };
    base.y0 = function (d, i) {
        return yScale(y0Value(d, i));
    };
    base.x = base.x1 = function (d, i) {
        return xScale(xValue(d, i));
    };
    base.y = base.y1 = function (d, i) {
        return yScale(yValue(d, i));
    };
    base.defined = function (d, i) {
        return x0Value(d, i) != null && y0Value(d, i) != null &&
            xValue(d, i) != null && yValue(d, i) != null;
    };

    base.xScale = function (x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return base;
    };
    base.yScale = function (x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return base;
    };
    base.x0Value = function (x) {
        if (!arguments.length) {
            return x0Value;
        }
        x0Value = d3.functor(x);
        return base;
    };
    base.y0Value = function (x) {
        if (!arguments.length) {
            return y0Value;
        }
        y0Value = d3.functor(x);
        return base;
    };
    base.xValue = base.x1Value = function (x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = d3.functor(x);
        return base;
    };
    base.yValue = base.y1Value = function (x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = d3.functor(x);
        return base;
    };

    return base;
}
