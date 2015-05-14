(function(d3, fc) {
    'use strict';

    describe('line', function() {

        it('should invoke data accessors appropriately', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.utilities.fn.identity),
                yValueSpy = jasmine.createSpy('yValue').and.callFake(fc.utilities.fn.identity);

            var line = fc.series.line()
                .xValue(xValueSpy)
                .yValue(yValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0, 2, 4, 8, 16];

            container.datum(data)
                .call(line);

            expect(xValueSpy.calls.count()).toEqual(data.length);
            xValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });

            // the defined call also invokes the y value accessor,
            // therefore it is invoked twice for each data point

            expect(yValueSpy.calls.count()).toEqual(data.length * 2);
            yValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[Math.floor(i / 2)]);
                    expect(call.args[1]).toEqual(Math.floor(i / 2));
                });
        });
    });

}(d3, fc));
