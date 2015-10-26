describe('fc.indicator.algorithm.calculator.forceIndex', function () {

    var force;

    beforeEach(function () {
        force = fc.indicator.algorithm.calculator.forceIndex();
    });

    it('should calculate a positive force', function () {
        var data = [
            {close: 0, volume: 10},
            {close: 1, volume: 20},
            {close: 4, volume: 20}
        ];

        expect(force(data)).toEqual([undefined, 20, 60]);
    });

    it('should calculate a negative force', function () {
        var data = [
            {close: 7, volume: 10},
            {close: 4, volume: 20},
            {close: 1, volume: 15}
        ];

        expect(force(data)).toEqual([undefined, -60, -45]);
    });

    it('should calculate a zero force', function () {
        var data = [
            {close: 4, volume: 10},
            {close: 4, volume: 20},
            {close: 4, volume: 15}
        ];

        expect(force(data)).toEqual([undefined, 0, 0]);
    });

    it('should calculate force in a longer sequence', function () {
        var data = [
            {close: 0, volume: 10},
            {close: 4, volume: 20},
            {close: 4, volume: 15},
            {close: 2, volume: 15},
            {close: 6, volume: 15}
        ];

        expect(force(data)).toEqual([undefined, 80, 0, -30, 60]);
    });

});
