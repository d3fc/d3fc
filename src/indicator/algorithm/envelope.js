import envelopeCalculator from './calculator/envelope';
import undefinedInputAdapter from './calculator/undefinedInputAdapter';
import d3 from 'd3';
import merge from './merge';

export default function() {

    var envelopeAlgorithm = envelopeCalculator();

    var adaptedEnvelope = undefinedInputAdapter()
        .undefinedValue({
            lower: undefined,
            upper: undefined
        })
        .algorithm(envelopeAlgorithm);

    var mergedAlgorithm = merge()
            .algorithm(adaptedEnvelope)
            .merge(function(datum, env) { datum.envelope = env; });

    var envelope = function(data) {
        return mergedAlgorithm(data);
    };

    envelope.root = function(d) {
        return d.envelope;
    };

    d3.rebind(envelope, mergedAlgorithm, 'merge');
    d3.rebind(envelope, envelopeAlgorithm, 'value', 'factor');

    return envelope;
}
