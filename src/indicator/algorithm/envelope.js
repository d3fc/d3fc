import calculator from './calculator/envelope';
import d3 from 'd3';
import merge from './merge';

export default function() {

    var envelopeAlgorithm = calculator()
        .midValue(function(d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(envelopeAlgorithm)
            .merge(function(datum, env) { datum.envelope = env; });

    var envelope = function(data) {
        return mergedAlgorithm(data);
    };

    envelope.root = function(d) {
        return d.envelope;
    };

    d3.rebind(envelope, mergedAlgorithm, 'merge');
    d3.rebind(envelope, envelopeAlgorithm, 'midValue', 'channel');

    return envelope;
}
