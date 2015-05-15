(function(d3, fc) {
    'use strict';

    describe('fc.utilities.pointSnap', function() {

        var xValue, yValue, xScale, yScale, data;

        beforeEach(function() {
            xValue = function(d) { return d[0]; };
            yValue = function(d) { return d[1]; };
            xScale = d3.scale.identity();
            yScale = d3.scale.identity();
            data = [
                [0, 0],
                [5, 5],
                [10, 10]
            ];
        });

        it('should work with no data', function() {
            var pointSnap = fc.utilities.pointSnap(xScale, yScale, xValue, yValue, []);
            expect(pointSnap(5, 5)).toEqual({
                datum: null,
                x: 5,
                scaleX: false,
                y: 5,
                scaleY: false
            });
        });

        it('should work for scales with invert', function() {
            var pointSnap = fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
            expect(pointSnap(5, 5)).toEqual({
                datum: [5, 5],
                x: 5,
                scaleX: true,
                y: 5,
                scaleY: true
            });
        });

        it('should work for scales without invert', function() {
            xScale.invert = null;
            yScale.invert = null;
            var pointSnap = fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
            expect(pointSnap(5, 5)).toEqual({
                datum: [5, 5],
                x: 5,
                scaleX: true,
                y: 5,
                scaleY: true
            });
        });

    });

}(d3, fc));
