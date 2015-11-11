import d3 from 'd3';

export default function() {

    var containerWidth = 1,
        containerHeight = 1;

    var strategy = function(data) {
        return data;
    };

    strategy.containerWidth = function(value) {
        if (!arguments.length) {
            return containerWidth;
        }
        containerWidth = value;
        return strategy;
    };

    strategy.containerHeight = function(value) {
        if (!arguments.length) {
            return containerHeight;
        }
        containerHeight = value;
        return strategy;
    };

    return strategy;
}
