describe('fc.indicator.algorithm.calculator.envelope', function() {

    var envelope;

    beforeEach(function() {
        envelope = fc.indicator.algorithm.calculator.envelope();
    });

    it('should have a default factor of 0.1', function() {
        var data = [10, 20, 60];

        expect(envelope(data)).toEqual([
            {lower: 9, upper: 11},
            {lower: 18, upper: 22},
            {lower: 54, upper: 66}
        ]);
    });

    it('should have customisable factor', function() {
        envelope.factor(0.2);
        var data = [10, 20, 60];

        expect(envelope(data)).toEqual([
            {lower: 8, upper: 12},
            {lower: 16, upper: 24},
            {lower: 48, upper: 72}
        ]);
    });

    it('should have customisable midValue', function() {
        envelope.value(function(d) {
            return d.close;
        });
        var data = [
            {close: 10},
            {close: 20},
            {close: 60}
        ];

        expect(envelope(data)).toEqual([
            {lower: 9, upper: 11},
            {lower: 18, upper: 22},
            {lower: 54, upper: 66}
        ]);
    });
});
