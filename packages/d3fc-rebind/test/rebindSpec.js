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

    it('should error if specified names are not functions', () => {
        const error = new Error('Attempt to rebind fn2 which isn\'t a function on the source object');
        expect(() => rebind(target, source, 'fn2')).toThrow(error);
    });

    it('should work with properties found on the prototype', () => {
        class Component {
            fn(...args) {
                if (!args.length) {
                    return value;
                }
                value = args[0];
                return this;
            }
        }

        const targetObject = rebind(target, new Component(), 'fn');
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
