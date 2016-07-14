export default function() {

    var xValueKey = '',
        yValue = function(d) { return d.y; },
        startsWithTotal = false,
        totals = function(d, i, data) {
            return (i === data.length - 1) ? 'Final' : null;
        },
        directions = {
            up: 'up',
            down: 'down',
            unchanged: 'unchanged'
        };

    var waterfall = function(data) {
        var length = data.length,
            i = 0,
            previousEnd = 0,
            start,
            end,
            total,
            result = [];

        if (startsWithTotal) {
            // First value is a total
            previousEnd = yValue(data[0]);
            result.push({
                x: data[0][xValueKey],
                y0: 0,
                y1: previousEnd,
                direction: directions.unchanged
            });
            i = 1;
        }

        for (i; i < length; i += 1) {
            start = previousEnd;
            end = yValue(data[i]) + previousEnd;

            result.push({
                x: data[i][xValueKey],
                y0: start,
                y1: end,
                direction: end - start > 0 ? directions.up : directions.down
            });

            total = totals(data[i], i, data);
            if (total) {
                // Insert a total value here
                result.push({
                    x: total,
                    y0: 0,
                    y1: end,
                    direction: directions.unchanged
                });
            }

            previousEnd = end;
        }

        return result;
    };

    waterfall.xValueKey = function(x) {
        if (!arguments.length) {
            return xValueKey;
        }
        xValueKey = x;
        return waterfall;
    };

    waterfall.yValue = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = x;
        return waterfall;
    };

    waterfall.total = function(x) {
        if (!arguments.length) {
            return totals;
        }
        totals = x;
        return waterfall;
    };

    waterfall.startsWithTotal = function(x) {
        if (!arguments.length) {
            return startsWithTotal;
        }
        startsWithTotal = x;
        return waterfall;
    };

    return waterfall;
}
