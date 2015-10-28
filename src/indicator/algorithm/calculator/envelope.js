import d3 from 'd3';
import undefinedInputAdapter from './undefinedInputAdapter';

export default function() {

    var factor = 0.1;
    var value = function(d) {
        return d;
    };
    var envelopeFactor = function(valueData) {
        return valueData.map(function(s) {
            return {
                lowerEnvelope: s * (1.0 - factor),
                upperEnvelope: s * (1.0 + factor)
            };
        });
    };
    var envelope = function(data) {
        return undefinedInputAdapter().undefinedValue({}).algorithm(envelopeFactor)(
            data.map(function(d) {return value(d);}));
    };

    envelope.factor = function(x) {
        if (!arguments.length) {
            return factor;
        }
        factor = x;
        return envelope;
    };

    envelope.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = d3.functor(x);
        return envelope;
    };

    return envelope;
}
