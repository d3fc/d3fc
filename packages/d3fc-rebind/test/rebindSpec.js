import rebind  from '../src/rebind';

describe('rebind', () => {

    let source, target, value;

    beforeEach(() => {
        value = {};
        source = {
            fn: (...args) => {
                if (!args.length) {
                    return value;
                }
                value = args[0];
                return source;
            }
        };
        target = {};
    });

    it('should have the same behaviour as d3.rebind', () => {
        const targetObject = rebind(target, source, 'fn');
        expect(targetObject).toBe(target);

        expect(target.fn())
            .toEqual(value);

        const newValue = {};
        expect(target.fn(newValue))
            .toEqual(target);
        expect(target.fn())
            .toEqual(newValue);
    });
});
