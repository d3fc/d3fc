import { envelope as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var envelopeAlgorithm = calculator();

    var mergedAlgorithm = merge()
        .algorithm(envelopeAlgorithm)
        .merge(function(datum, env) {
            datum.envelope = env;
            return datum;
        });

    var envelope = function(data) {
        return mergedAlgorithm(data);
    };

    envelope.root = function(d) {
        return d.envelope;
    };

    rebind(envelope, mergedAlgorithm, 'merge');
    rebind(envelope, envelopeAlgorithm, 'value', 'factor');

    return envelope;
}
