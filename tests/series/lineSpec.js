(function(d3, fc) {
    'use strict';

    describe('line', function() {

        it('should invoke data accessors with datum and index', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.util.fn.identity),
                yValueSpy = jasmine.createSpy('yValue').and.callFake(fc.util.fn.identity);

            var line = fc.series.line()
                .xValue(xValueSpy)
                .yValue(yValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0.2, 2.4, 4.5, 8.6, 16.7];

            container.datum(data)
                .call(line);

            expect(xValueSpy.calls.count()).toEqual(data.length);
            this.utils.verifyAccessorCalls(xValueSpy, data);

            // the defined call also invokes the y value accessor,
            // therefore it is invoked twice for each data point

            expect(yValueSpy.calls.count()).toEqual(data.length * 2);
            this.utils.verifyAccessorCalls(yValueSpy, data);
        });
    });

}(d3, fc));
