import d3 from 'd3';
import _slidingWindow from './slidingWindow';

export default function() {

    var volumeValue = function(d, i) { return d.volume; },
        closeValue = function(d, i) { return d.close; };

    var slidingWindow = _slidingWindow()
        .windowSize(2)
        .accumulator(function(values) {
            return (values[1].closeValue - values[0].closeValue) * values[1].volumeValue;
        });

    var force = function(data) {
        return slidingWindow(data);
    };

    force.volumeValue = function(x) {
        if (!arguments.length) {
            return volumeValue;
        }
        volumeValue = x;
        return force;
    };
    force.closeValue = function(x) {
        if (!arguments.length) {
            return closeValue;
        }
        closeValue = x;
        return force;
    };

    d3.rebind(force, slidingWindow, 'windowSize');

    return force;
}
