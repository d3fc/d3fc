import d3 from 'd3';
import {identity} from '../../../util/fn';


export default function() {

    var factor = 0.1,
        value = identity;

    var envelope = function(data) {
        return data.map(function(s) {
            return {
                lower: value(s) * (1.0 - factor),
                upper: value(s) * (1.0 + factor)
            };
        });
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
