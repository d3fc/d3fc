(function(d3, fc) {
    'use strict';

    describe('bar', function() {

        it('should invoke data accessors with datum and index', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.utilities.fn.identity),
                y0ValueSpy = jasmine.createSpy('y0Value').and.callFake(fc.utilities.fn.identity),
                y1ValueSpy = jasmine.createSpy('y1Value').and.callFake(fc.utilities.fn.identity);

            var bar = fc.series.bar()
                .xValue(xValueSpy)
                .y0Value(y0ValueSpy)
                .y1Value(y1ValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0, 2, 4, 8, 16];

            container.datum(data)
                .call(bar);

            // the data join and the bar width calculations also invoke
            // the x value accessor, therefore it is invoked three times
            // for each data point

            expect(xValueSpy.calls.count()).toEqual(data.length * 4);
            xValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i % data.length]);
                    expect(call.args[1]).toEqual(i % data.length);
                });

            expect(y0ValueSpy.calls.count()).toEqual(data.length * 4);
            expect(y0ValueSpy.calls.argsFor(0)).toEqual([0, 0]);
            expect(y0ValueSpy.calls.argsFor(1)).toEqual([2, 1]);
            expect(y0ValueSpy.calls.argsFor(2)).toEqual([4, 2]);
            expect(y0ValueSpy.calls.argsFor(3)).toEqual([8, 3]);
            expect(y0ValueSpy.calls.argsFor(4)).toEqual([16, 4]);

            expect(y1ValueSpy.calls.count()).toEqual(data.length * 2);
            expect(y1ValueSpy.calls.argsFor(0)).toEqual([0, 0]);
            expect(y1ValueSpy.calls.argsFor(2)).toEqual([2, 1]);
            expect(y1ValueSpy.calls.argsFor(4)).toEqual([4, 2]);
            expect(y1ValueSpy.calls.argsFor(6)).toEqual([8, 3]);
            expect(y1ValueSpy.calls.argsFor(8)).toEqual([16, 4]);
        });
    });


}(d3, fc));
