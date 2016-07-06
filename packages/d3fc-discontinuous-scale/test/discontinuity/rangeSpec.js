import discontinuityRange from '../../src/discontinuity/range';

describe('discontinuityRange', () => {

    describe('clampUp', () => {
        it('should do nothing if no ranges are provided', () => {
            expect(discontinuityRange().clampUp(10)).toEqual(10);
        });

        it('should clamp up if the number falls within a discontinuity', () => {
            expect(discontinuityRange([0, 10]).clampUp(5)).toEqual(10);
            expect(discontinuityRange([0, 10], [20, 30]).clampUp(25)).toEqual(30);
            expect(discontinuityRange([-10, 10], [20, 30]).clampUp(0)).toEqual(10);
        });

        it('should not clamp up at the boundary of a discontinuity', () => {
            expect(discontinuityRange([0, 10]).clampUp(0)).toEqual(0);
        });
    });

    describe('clampDown', () => {
        it('should do nothing if no ranges are provided', () => {
            expect(discontinuityRange().clampDown(10)).toEqual(10);
        });

        it('should clamp down if the number falls within a discontinuity', () => {
            expect(discontinuityRange([0, 10]).clampDown(5)).toEqual(0);
            expect(discontinuityRange([0, 10], [20, 30]).clampDown(25)).toEqual(20);
            expect(discontinuityRange([-10, 10], [20, 30]).clampDown(0)).toEqual(-10);
        });

        it('should not clamp down at the boundary of a discontinuity', () => {
            expect(discontinuityRange([0, 10]).clampDown(10)).toEqual(10);
        });
    });

    describe('distance', () => {
        it('should do nothing if no ranges are provided', () => {
            expect(discontinuityRange().distance(10, 20)).toEqual(10);
        });

        it('should remove discontinuities', () => {
            expect(discontinuityRange([0, 10]).distance(0, 20)).toEqual(10);
            expect(discontinuityRange([0, 10]).distance(5, 20)).toEqual(10);
            expect(discontinuityRange([0, 10], [10, 20]).distance(0, 30)).toEqual(10);
            expect(discontinuityRange([0, 10], [20, 30]).distance(0, 30)).toEqual(10);
        });
    });

    it('should support copy operations', () => {
        const original = discontinuityRange([5, 10], [20, 30]);
        expect(original.offset(0, 40)).toEqual(55);

        const copy = original.copy();
        expect(copy.offset(0, 40)).toEqual(55);
    });

    const millisPerDay = 24 * 3600 * 1000;

    it('should support dates', () => {
        var start = new Date(2015, 0, 9);
        var end = new Date(2015, 0, 10);
        const range = discontinuityRange([start, end]);

        expect(range.distance(new Date(2015, 0, 8), new Date(2015, 0, 11))).toEqual(millisPerDay * 2);
        expect(range.offset(new Date(2015, 0, 8), millisPerDay * 2)).toEqual(new Date(2015, 0, 11));
    });

    describe('offset', () => {
        it('should simply offset if no ranges are provided', () => {
            expect(discontinuityRange().offset(10, 5)).toEqual(15);
            expect(discontinuityRange().offset(-10, 50)).toEqual(40);
            expect(discontinuityRange().offset(10, -5)).toEqual(5);
        });

        it('should offset with discontinuities', () => {
            // before discontinuity
            expect(discontinuityRange([5, 10]).offset(4, 2)).toEqual(11);
            // within discontinuity
            expect(discontinuityRange([5, 10]).offset(7, 2)).toEqual(12);
            // after discontinuity
            expect(discontinuityRange([5, 10]).offset(17, 2)).toEqual(19);
            // multiple discontinuities
            expect(discontinuityRange([5, 10], [20, 30]).offset(0, 40)).toEqual(55);
        });

        it('should allow negative offsets with discontinuities', () => {
            // before discontinuity
            expect(discontinuityRange([5, 10]).offset(11, -2)).toEqual(4);
            // within discontinuity
            expect(discontinuityRange([5, 10]).offset(7, -2)).toEqual(3);
            // after discontinuity
            expect(discontinuityRange([5, 10]).offset(2, -2)).toEqual(0);
            // multiple discontinuities
            expect(discontinuityRange([5, 10], [20, 30]).offset(55, -40)).toEqual(0);
        });
    });
});
