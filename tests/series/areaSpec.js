(function(d3, fc) {
    'use strict';

    describe('area', function() {

        it('should invoke data accessors with datum and index', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.utilities.fn.identity),
                y0ValueSpy = jasmine.createSpy('y0Value').and.callFake(fc.utilities.fn.identity),
                y1ValueSpy = jasmine.createSpy('y1Value').and.callFake(fc.utilities.fn.identity);

            var area = fc.series.area()
                .xValue(xValueSpy)
                .y0Value(y0ValueSpy)
                .y1Value(y1ValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0, 2, 4, 8, 16];

            container.datum(data)
                .call(area);

            expect(xValueSpy.calls.count()).toEqual(data.length);
            xValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });

            // the defined call also invokes the y value accessors,
            // therefore they are invoked twice for each data point

            expect(y0ValueSpy.calls.count()).toEqual(data.length * 2);
            y0ValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[Math.floor(i / 2)]);
                    expect(call.args[1]).toEqual(Math.floor(i / 2));
                });

            expect(y1ValueSpy.calls.count()).toEqual(data.length * 2);
            y1ValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[Math.floor(i / 2)]);
                    expect(call.args[1]).toEqual(Math.floor(i / 2));
                });
        });
    });

}(d3, fc));
