(function(d3, fc) {
    'use strict';

    describe('candlestick', function() {

        it('should invoke data accessors appropriately', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.utilities.fn.identity),
                yOpenValueSpy = jasmine.createSpy('yOpenValue').and.callFake(fc.utilities.fn.identity),
                yHighValueSpy = jasmine.createSpy('yHighValue').and.callFake(fc.utilities.fn.identity),
                yLowValueSpy = jasmine.createSpy('yLowValue').and.callFake(fc.utilities.fn.identity),
                yCloseValueSpy = jasmine.createSpy('yCloseValue').and.callFake(fc.utilities.fn.identity);

            var candlestick = fc.series.candlestick()
                .xValue(xValueSpy)
                .yOpenValue(yOpenValueSpy)
                .yHighValue(yHighValueSpy)
                .yLowValue(yLowValueSpy)
                .yCloseValue(yCloseValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0, 2, 4, 8, 16];

            container.datum(data)
                .call(candlestick);

            // the data join and the bar width calculations also invoke
            // the x value accessor, therefore it is invoked three times
            // for each data point

            expect(xValueSpy.calls.count()).toEqual(data.length * 3);
            xValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i % data.length]);
                    expect(call.args[1]).toEqual(i % data.length);
                });

            expect(yOpenValueSpy.calls.count()).toEqual(data.length);
            yOpenValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });

            expect(yHighValueSpy.calls.count()).toEqual(data.length);
            yHighValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });

            expect(yLowValueSpy.calls.count()).toEqual(data.length);
            yLowValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });

            expect(yCloseValueSpy.calls.count()).toEqual(data.length);
            yCloseValueSpy.calls.all()
                .forEach(function(call, i) {
                    expect(call.args[0]).toEqual(data[i]);
                    expect(call.args[1]).toEqual(i);
                });
        });
    });

}(d3, fc));
