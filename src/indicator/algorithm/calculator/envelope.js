import d3 from 'd3';

export default function() {

    var channel = 0.1;
    var midValue = function(d) {
        return d.value;
    };
    var envelope = function(data) {
        data.forEach(function(s) {
            if (midValue(s) !== undefined) {
                s.lowerEnvelope = midValue(s) * (1.0 - channel);
                s.upperEnvelope = midValue(s) * (1.0 + channel);
            }
        });
        return data;
    };

    envelope.channel = function(x) {
        if (!arguments.length) {
            return channel;
        }
        channel = x;
        return envelope;
    };

    envelope.midValue = function(x) {
        if (!arguments.length) {
            return midValue;
        }
        midValue = d3.functor(x);
        return envelope;
    };

    return envelope;
}
