(function(d3, fc) {
    'use strict';

    describe('fc.utilities.snap', function() {

        var xScale, yScale;

        beforeEach(function() {
            xScale = d3.scale.identity();
            yScale = d3.scale.identity();
        });

        describe('fc.utilities.noSnap', function() {

            var noSnap;

            beforeEach(function() {
                noSnap = fc.utilities.noSnap(xScale, yScale);
            });

            it('should work for scales with invert', function() {
                expect(noSnap(4, 4)).toEqual({
                    x: 4,
                    xInDomainUnits: true,
                    y: 4,
                    yInDomainUnits: true
                });
            });

            it('should work for scales without invert', function() {
                xScale.invert = null;
                yScale.invert = null;
                expect(noSnap(4, 4)).toEqual({
                    x: 4,
                    xInDomainUnits: false,
                    y: 4,
                    yInDomainUnits: false
                });
            });
        });


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
                expect(pointSnap(4, 4)).toEqual({
                    datum: null,
                    x: 4,
                    xInDomainUnits: false,
                    y: 4,
                    yInDomainUnits: false
                });
            });

            it('should work for scales with invert', function() {
                var pointSnap = fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
                expect(pointSnap(4, 4)).toEqual({
                    datum: [5, 5],
                    x: 5,
                    xInDomainUnits: true,
                    y: 5,
                    yInDomainUnits: true
                });
            });

            it('should work for scales without invert', function() {
                xScale.invert = null;
                yScale.invert = null;
                var pointSnap = fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
                expect(pointSnap(4, 4)).toEqual({
                    datum: [5, 5],
                    x: 5,
                    xInDomainUnits: true,
                    y: 5,
                    yInDomainUnits: true
                });
            });
        });

    });

}(d3, fc));
