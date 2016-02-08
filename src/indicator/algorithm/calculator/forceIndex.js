import d3 from 'd3';
import _slidingWindow from './slidingWindow';
import {identity} from '../../../util/fn';
import exponentialMovingAverage from './exponentialMovingAverage';

export default function() {

    var volumeValue = function(d, i) { return d.volume; },
        closeValue = function(d, i) { return d.close;},
        value = identity;

    var emaComputer = exponentialMovingAverage()
        .windowSize(13);

    var slidingWindow = _slidingWindow()
        .windowSize(2)
        .accumulator(function(values) {
            return (closeValue(values[1]) - closeValue(values[0])) * volumeValue(values[1]);
        });

    var force = function(data) {
        emaComputer.value(value);
        var forceIndex = slidingWindow(data).filter(identity);
        var smoothedForceIndex = emaComputer(forceIndex);
        if (data.length) {
            smoothedForceIndex.unshift(undefined);
        }
        return smoothedForceIndex;
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

    d3.rebind(force, emaComputer, 'windowSize');

    return force;
}
