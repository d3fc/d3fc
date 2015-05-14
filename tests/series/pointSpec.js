(function(d3, fc) {
    'use strict';

    describe('point', function() {

        it('should invoke data accessors appropriately', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.utilities.fn.identity),
                yValueSpy = jasmine.createSpy('yValue').and.callFake(fc.utilities.fn.identity);

            var point = fc.series.point()
                .xValue(xValueSpy)
                .yValue(yValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0, 2, 4, 8, 16];

            container.datum(data)
                .call(point);

            // the data join also invokes the x value accessor,
            // therefore it is invoked twice for each data point
            expect(xValueSpy.calls.count()).toEqual(data.length * 2);
            xValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i % data.length]);
                    expect(call.args[1]).toEqual(i % data.length);
                });

            expect(yValueSpy.calls.count()).toEqual(data.length);
            yValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });
        });
    });

}(d3, fc));
