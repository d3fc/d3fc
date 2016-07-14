describe('fc.util.snap', function() {

    var xScale, yScale;

    beforeEach(function() {
        xScale = d3.scale.identity();
        yScale = d3.scale.identity();
    });

    describe('fc.util.noSnap', function() {

        var noSnap;

        beforeEach(function() {
            noSnap = fc.util.noSnap(xScale, yScale);
        });

        it('should not offset the input values', function() {
            expect(noSnap({ x: 4, y: 4 })).toEqual({
                x: 4,
                y: 4
            });
        });
    });

    describe('fc.util.pointSnap', function() {
        var xValue, yValue, data;

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
            var pointSnap = fc.util.pointSnap(xScale, yScale, xValue, yValue, []);
            expect(pointSnap({ x: 4, y: 4 })).toEqual({
                datum: null,
                x: 4,
                y: 4
            });
        });

        it('should work with data', function() {
            var pointSnap = fc.util.pointSnap(xScale, yScale, xValue, yValue, data);
            expect(pointSnap({ x: 4, y: 4 })).toEqual({
                datum: [5, 5],
                x: 5,
                y: 5
            });
        });
    });

});
