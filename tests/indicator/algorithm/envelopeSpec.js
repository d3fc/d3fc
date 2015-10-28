describe('fc.indicator.algorithm.calculator.envelope', function() {

    var envelope;

    beforeEach(function() {
        envelope = fc.indicator.algorithm.calculator.envelope();
    });

    it('should have a defaule channel of 0.1', function() {
        var data = [
            {value: 10},
            {value: 20},
            {value: 60}
        ];

        expect(envelope(data)).toEqual([
            {value: 10, lowerEnvelope: 9, upperEnvelope: 11},
            {value: 20, lowerEnvelope: 18, upperEnvelope: 22},
            {value: 60, lowerEnvelope: 54, upperEnvelope: 66}
        ]);
    });

    it('should handle undefined well', function() {
        var data = [
            {value: undefined},
            {value: undefined},
            {value: 60}
        ];

        expect(envelope(data)).toEqual([
            {value: undefined},
            {value: undefined},
            {value: 60, lowerEnvelope: 54, upperEnvelope: 66}
        ]);
    });

    it('should have customisable channel', function() {
        envelope.channel(0.2);
        var data = [
            {value: 10},
            {value: 20},
            {value: 60}
        ];

        expect(envelope(data)).toEqual([
            {value: 10, lowerEnvelope: 8, upperEnvelope: 12},
            {value: 20, lowerEnvelope: 16, upperEnvelope: 24},
            {value: 60, lowerEnvelope: 48, upperEnvelope: 72}
        ]);
    });

    it('should have customisable midValue', function() {
        envelope.midValue(function(d) {
            return d.close;
        });
        var data = [
            {close: 10},
            {close: 20},
            {close: 60}
        ];

        expect(envelope(data)).toEqual([
            {close: 10, lowerEnvelope: 9, upperEnvelope: 11},
            {close: 20, lowerEnvelope: 18, upperEnvelope: 22},
            {close: 60, lowerEnvelope: 54, upperEnvelope: 66}
        ]);
    });
});
