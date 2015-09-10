describe('column', function() {

    it('should invoke data accessors with datum and index', function() {

        var yValueSpy = jasmine.createSpy('yValue').and.callFake(fc.util.fn.identity),
            x0ValueSpy = jasmine.createSpy('x0Value').and.callFake(fc.util.fn.identity),
            x1ValueSpy = jasmine.createSpy('x1Value').and.callFake(fc.util.fn.identity);

        var column = fc.series.column()
            .yValue(yValueSpy)
            .x0Value(x0ValueSpy)
            .x1Value(x1ValueSpy);

        var element = document.createElement('svg'),
            container = d3.select(element),
            data = [0.1, 2.2, 4.3, 8.4, 16.5];

        container.datum(data)
            .call(column);

        expect(yValueSpy.calls.count()).toEqual(data.length * 4,
            'the yValue accessor was not called the correct number of times');
        this.utils.verifyAccessorCalls(yValueSpy, data);


        expect(x0ValueSpy.calls.count()).toEqual(data.length * 4,
            'the x0Value accessor was not called the correct number of times');
        this.utils.verifyAccessorCalls(x0ValueSpy, data);

        expect(x1ValueSpy.calls.count()).toEqual(data.length * 2,
            'the x1Value accessor was not called the correct number of times');
        this.utils.verifyAccessorCalls(x1ValueSpy, data);
    });
});
