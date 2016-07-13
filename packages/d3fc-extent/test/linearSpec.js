import linearExtent from '../src/linear';

describe('linear', () => {
    const obj = (val) => ({ high: val + 5, low: val - 5 });

    it('should use default identity accessor function', function() {
        var data = [1, 2, 10];

        var extents = linearExtent()(data);
        expect(extents).toEqual([1, 10]);
    });

    it('should support accessor functions', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = linearExtent().accessors([d => d.high + 100])(data);
        expect(extents).toEqual([106, 115]);
    });

    it('should supply index to accessor functions', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = linearExtent().accessors([(d, i) => i])(data);
        expect(extents).toEqual([0, 2]);
    });

    it('should support accessor functions which return arrays', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = linearExtent().accessors([(d, i) => [i, i + 1]])(data);
        expect(extents).toEqual([0, 3]);
    });

    it('should support symmetrical domains', function() {
        var data = [obj(1), obj(10)];

        var extents = linearExtent().accessors([d => d.high]).symmetricalAbout(0)(data);
        expect(extents).toEqual([-15, 15]);

        extents = linearExtent().accessors([d => d.high]).symmetricalAbout(10)(data);
        expect(extents).toEqual([5, 15]);
    });

    it('should support including a max value in the range', function() {
        var data = [obj(1), obj(2)];

        var extents = linearExtent().accessors([d => d.high, d => 10])(data);
        expect(extents).toEqual([6, 10]);
    });

    it('should support including a min value in the range', function() {
        var data = [obj(1), obj(2)];

        var extents = linearExtent().accessors([d => d.high, d => 0])(data);
        expect(extents).toEqual([0, 7]);
    });

    it('should support including a value within the range', function() {
        var data = [obj(1), obj(3)];

        var extents = linearExtent().accessors([d => d.high, d => 7])(data);
        expect(extents).toEqual([6, 8]);
    });

    it('should support including a max and min value in the range', function() {
        var data = [obj(1), obj(2)];

        var extents = linearExtent().accessors([d => d.high, d => 0, d => 8])(data);
        expect(extents).toEqual([0, 8]);
    });

    it('should support including values within the range', function() {
        var data = [obj(1), obj(4)];

        var extents = linearExtent().accessors([d => d.high, d => 7, d => 8])(data);
        expect(extents).toEqual([6, 9]);
    });

    it('should support increasing the range with domain padding', function() {
        var data = [obj(5), obj(15)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([5, 10])(data);
        expect(extents).toEqual([5, 30]);
    });

    it('should support decreasing the range with domain padding', function() {
        var data = [obj(5), obj(15)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([-5, -2])(data);
        expect(extents).toEqual([15, 18]);
    });

    it('should support increasing the range with percentage padding', function() {
        var data = [obj(5), obj(15)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0.5, 1])(data);
        expect(extents).toEqual([5, 30]);
    });

    it('should support decreasing the range with percentage padding', function() {
        var data = [obj(5), obj(15)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([-0.5, -0.2])(data);
        expect(extents).toEqual([15, 18]);
    });

    it('should support padding an empty dataset with domain padding', function() {
        var data = [];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([2, 2])(data);
        expect(isNaN(extents[0])).toBe(true);
        expect(isNaN(extents[1])).toBe(true);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([1, 2])(data);
        expect(isNaN(extents[0])).toBe(true);
        expect(isNaN(extents[1])).toBe(true);
    });

    it('should support padding an empty dataset with percentage padding', function() {
        var data = [];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([2, 2])(data);
        expect(isNaN(extents[0])).toBe(true);
        expect(isNaN(extents[1])).toBe(true);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([1, 2])(data);
        expect(isNaN(extents[0])).toBe(true);
        expect(isNaN(extents[1])).toBe(true);
    });

    it('should support padding zero as an identity with domain padding', function() {
        var data = [obj(1), obj(2)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([0, 0])(data);
        expect(extents).toEqual([6, 7]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([0, 0])(data);
        expect(extents).toEqual([6, 7]);
    });

    it('should support padding zero as an identity with percentage padding', function() {
        var data = [obj(1), obj(2)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0, 0])(data);
        expect(extents).toEqual([6, 7]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0, 0])(data);
        expect(extents).toEqual([6, 7]);
    });

    it('should include the extra point, then pad the range with domain padding', function() {
        var data = [obj(5), obj(15)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([5, 5])
            .include([0])(data);
        expect(extents).toEqual([-5, 25]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([5, 10])
            .include([0])(data);
        expect(extents).toEqual([-5, 30]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([5, 5])
            .include([30])(data);
        expect(extents).toEqual([5, 35]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([10, 5])
            .include([30])(data);
        expect(extents).toEqual([0, 35]);
    });

    it('should include the extra point, then pad the range percentagely', function() {
        var data = [obj(5), obj(15)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0.5, 0.5])
            .include([0])(data);
        expect(extents).toEqual([-10, 30]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0.5, 1])
            .include([0])(data);
        expect(extents).toEqual([-10, 40]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0.5, 0.5])
            .include([30])(data);
        expect(extents).toEqual([0, 40]);

        extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([1, 0.5])
            .include([30])(data);
        expect(extents).toEqual([-10, 40]);
    });

    it('should include the extra point, calculate symmetry and then pad the domain', function() {
        var data = [obj(8), obj(12)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('domain')
            .pad([4, 4])
            .symmetricalAbout(17)
            .include([0])(data);
        expect(extents).toEqual([-4, 38]);
    });

    it('should include the extra point, calculate symmetry and then pad percentagely', function() {
        var data = [obj(8), obj(12)];

        var extents = linearExtent()
            .accessors([d => d.high])
            .padUnit('percent')
            .pad([0.5, 0.5])
            .symmetricalAbout(17)
            .include([0])(data);
        expect(extents).toEqual([-17, 51]);
    });

    it('should return the include extent if no data specified', function() {
        var data = [];

        var extents = linearExtent()
            .include([0, 10])(data);
        expect(extents).toEqual([0, 10]);
    });

});
