import d3 from 'd3';
import barBase from './barBase';

export default function() {

    var base = barBase()
        .className(function(d, data) {
            var index = data.indexOf(d),
                name = 'waterfall';
            if (index === 0) {
                return name + ' up';
            } else {
                var value = function(d1, i) {
                        return base.orient() === 'vertical' ?
                          base.yValue()(d1, i) : base.xValue()(d1, i);
                    },
                    isIncrease = value(d) > value(data[index - 1]);
                return name + ' ' + (isIncrease ? 'up' : 'down');
            }
        })
        .containerTranslation(containerTranslation)
        .barHeight(waterfallHeight);

    function containerTranslation(d, data, i) {
        // The first bar will be full
        var index = data.indexOf(d),
            translation;

        if (base.orient() === 'vertical') {
            translation = base.y0(d, i);
        } else {
            translation = base.x0(d, i);
        }

        if (index !== 0) {
            // Subsequent bars will float
            var originalHeight = -barHeight(d, data, i),
                previousHeight = -barHeight(data[index - 1], data, i),
                newHeight = -waterfallHeight(d, data, i);

            // Shift the bar up/across
            translation -= originalHeight;

            if (originalHeight > previousHeight) {
                // This is an increase
                translation += newHeight;
            } else {
                // Case for decrease is the same as no change
            }
        }

        if (base.orient() === 'vertical') {
            return 'translate(' + base.x1(d, i) + ', ' + translation + ')';
        } else {
            return 'translate(' + translation + ', ' + base.y1(d, i) + ')';
        }
    }

    function barHeight(d, data, i) {
        if (base.orient() === 'vertical') {
            return base.y1(d, i) - base.y0(d, i);
        } else {
            return base.x1(d, i) - base.x0(d, i);
        }
    }

    function waterfallHeight(d, data, i) {
        var index = data.indexOf(d);
        if (index === 0) {
            return barHeight(d, data, i);
        } else {
            var difference;
            if (base.orient() === 'vertical') {
                difference = base.y(d, i) - base.y(data[index - 1], i);
            } else {
                difference = base.x(d, i) - base.x(data[index - 1], i);
            }

            return -Math.abs(difference);
        }
    }

    var waterfall = function(selection) {
        base(selection);
    };

    d3.rebind(waterfall, base, 'xScale', 'xValue', 'x1Value', 'x0Value', 'yScale', 'yValue', 'y1Value', 'y0Value', 'decorate', 'barWidth', 'orient', 'key');

    return waterfall;
}
