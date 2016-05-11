import { identity, functor } from './fn';

export default function() {

    let baseIndex = () => 0;
    let value = identity;

    var percentageChange = data => {
        if (data.length === 0) {
            return [];
        }
        const baseValue = value(data[baseIndex(data)]);
        return data.map((d, i) => (value(d, i) - baseValue) / baseValue);
    };

    percentageChange.baseIndex = (...args) => {
        if (!args.length) {
            return baseIndex;
        }
        baseIndex = functor(args[0]);
        return percentageChange;
    };
    percentageChange.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return percentageChange;
    };

    return percentageChange;
}
