import d3 from 'd3';

export default function() {

    var scale = d3.scale.identity(),
        tickArguments = [10],
        tickValues = null;

    function tryApply(fn, defaultVal) {
        return scale[fn] ? scale[fn].apply(scale, tickArguments) : defaultVal;
    }

    var ticks = function() {
        return tickValues == null ? tryApply('ticks', scale.domain()) : tickValues;
    };

    ticks.scale = function(x) {
        if (!arguments.length) {
            return scale;
        }
        scale = x;
        return ticks;
    };

    ticks.ticks = function(x) {
        if (!arguments.length) {
            return tickArguments;
        }
        tickArguments = arguments;
        return ticks;
    };

    ticks.tickValues = function(x) {
        if (!arguments.length) {
            return tickValues;
        }
        tickValues = x;
        return ticks;
    };

    return ticks;
}
