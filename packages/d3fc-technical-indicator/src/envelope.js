import { identity, convertNaN } from './fn';

export default function() {

    let factor = 0.1;
    let value = identity;

    const envelope = data => data.map(d => {
        const lower = convertNaN(value(d) * (1.0 - factor));
        const upper = convertNaN(value(d) * (1.0 + factor));
        return { lower, upper };
    });

    envelope.factor = (...args) => {
        if (!args.length) {
            return factor;
        }
        factor = args[0];
        return envelope;
    };

    envelope.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return envelope;
    };

    return envelope;
}
