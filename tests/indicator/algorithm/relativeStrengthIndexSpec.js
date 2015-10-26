describe('fc.indicator.algorithm.calculator.relativeStrengthIndex', function () {

    var rsi;

    beforeEach(function () {
        rsi = fc.indicator.algorithm.calculator.relativeStrengthIndex()
            .windowSize(3);
    });

    it('should calculate a constant down period', function () {
        var data = [
            {open: 1, close: 0},
            {open: 2, close: 1},
            {open: 3, close: 2}
        ];

        expect(rsi(data)).toEqual([undefined, undefined, 0]);
    });

    it('should calculate a constant up period', function () {
        var data = [
            {open: 0, close: 1},
            {open: 1, close: 2},
            {open: 2, close: 3}
        ];

        expect(rsi(data)).toEqual([undefined, undefined, 100]);
    });

    describe('with a constant mixed period [+1,-1,+1]', function () {

        var data;

        beforeEach(function () {
            data = [
                {open: 0, close: 1},
                {open: 2, close: 1},
                {open: 2, close: 3}
            ];
        });

        it('should calculate correctly with a windowSize of 1', function () {
            rsi.windowSize(1);
            expect(rsi(data)).toEqual([100, 0, 100]);
        });

        it('should calculate correctly with a windowSize of 2', function () {
            rsi.windowSize(2);
            expect(rsi(data)).toEqual([undefined, 50, 50]);
        });

        it('should calculate correctly with a windowSize of 3', function () {
            rsi.windowSize(3);
            expect(rsi(data)).toEqual([undefined, undefined, 77.77777777777777]);
        });
    });

    describe('with an inverted constant mixed period [-2,+2,-2]', function () {

        var data;

        beforeEach(function () {
            data = [
                {open: 2, close: 0},
                {open: 1, close: 3},
                {open: 2, close: 0}
            ];
        });

        it('should calculate correctly with a windowSize of 1', function () {
            rsi.windowSize(1);
            expect(rsi(data)).toEqual([0, 100, 0]);
        });

        it('should calculate correctly with a windowSize of 2', function () {
            rsi.windowSize(2);
            expect(rsi(data)).toEqual([undefined, 50, 50]);
        });

        it('should calculate correctly with a windowSize of 3', function () {
            rsi.windowSize(3);
            expect(rsi(data)).toEqual([undefined, undefined, 22.222222222222214]);
        });
    });
});

