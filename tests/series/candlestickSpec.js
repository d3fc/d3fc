describe('candlestick', function() {

    var element, data;

    beforeEach(function() {
        element = document.createElement('svg');
        data = fc.data.random.financial()(10);
    });

    it('should render a path for each datapoint', function() {
        var ohlc = fc.series.candlestick();

        d3.select(element)
            .datum(data)
            .call(ohlc);

        var paths = d3.select(element)
            .selectAll('path');

        expect(paths.size()).toBe(10);
    });

    it('should filter datapoints that are not defined', function() {
        data[2].date = undefined;

        var ohlc = fc.series.candlestick();

        d3.select(element)
            .datum(data)
            .call(ohlc);

        var paths = d3.select(element)
            .selectAll('path');

        expect(paths.size()).toBe(9);
    });

    it('should invoke data accessors with datum and index', function() {

        var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.util.fn.identity),
            yOpenValueSpy = jasmine.createSpy('yOpenValue').and.callFake(fc.util.fn.identity),
            yHighValueSpy = jasmine.createSpy('yHighValue').and.callFake(fc.util.fn.identity),
            yLowValueSpy = jasmine.createSpy('yLowValue').and.callFake(fc.util.fn.identity),
            yCloseValueSpy = jasmine.createSpy('yCloseValue').and.callFake(fc.util.fn.identity);

        var candlestick = fc.series.candlestick()
            .xValue(xValueSpy)
            .yOpenValue(yOpenValueSpy)
            .yHighValue(yHighValueSpy)
            .yLowValue(yLowValueSpy)
            .yCloseValue(yCloseValueSpy);

        var container = d3.select(element);
        element = document.createElement('svg');
        data = [0.1, 2.2, 4.3, 8.4, 16.5];

        container.datum(data)
            .call(candlestick);

        expect(xValueSpy.calls.count()).toEqual(data.length * 4);
        this.utils.verifyAccessorCalls(xValueSpy, data);

        expect(yOpenValueSpy.calls.count()).toEqual(data.length * 3);
        this.utils.verifyAccessorCalls(yOpenValueSpy, data);

        expect(yHighValueSpy.calls.count()).toEqual(data.length * 3);
        this.utils.verifyAccessorCalls(yHighValueSpy, data);

        expect(yLowValueSpy.calls.count()).toEqual(data.length * 3);
        this.utils.verifyAccessorCalls(yLowValueSpy, data);

        expect(yCloseValueSpy.calls.count()).toEqual(data.length * 3);
        this.utils.verifyAccessorCalls(yCloseValueSpy, data);
    });
});
