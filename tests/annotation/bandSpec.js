describe('band', function() {

    var element;

    beforeEach(function() {
        element = document.createElement('svg');
    });

    it('should cover the entire chart if no coordinates are provided', function() {
        var xScale = d3.scale.linear()
            .range([0, 20]);
        var yScale = d3.scale.linear()
            .range([0, 20]);

        var band = fc.annotation.band()
            .xScale(xScale)
            .yScale(yScale);

        d3.select(element)
            .datum([{}])
            .call(band);

        var path = element.children[0].children[0];
        expect(path.getAttribute('d')).toEqual('M0,0h20v20h-20Z');
    });

    it('should support function properties', function() {
        var xScale = d3.scale.linear()
            .range([0, 20])
            .domain([0, 10]);
        var yScale = d3.scale.linear()
            .range([0, 20])
            .domain([0, 10]);

        var band = fc.annotation.band()
            .xScale(xScale)
            .yScale(yScale)
            .x0(function() { return 2; })
            .x1(function() { return 4; })
            .y0(function() { return 6; })
            .y1(function() { return 8; });

        d3.select(element)
            .datum([{}])
            .call(band);

        var path = element.children[0].children[0];
        expect(path.getAttribute('d')).toEqual('M4,12h4v4h-4Z');
    });

    it('should support literal properties via functors', function() {
        var xScale = d3.scale.linear()
            .range([0, 20])
            .domain([0, 10]);
        var yScale = d3.scale.linear()
            .range([0, 20])
            .domain([0, 10]);

        var band = fc.annotation.band()
            .xScale(xScale)
            .yScale(yScale)
            .x0(2)
            .x1(4)
            .y0(6)
            .y1(8);

        d3.select(element)
            .datum([{}])
            .call(band);

        var path = element.children[0].children[0];
        expect(path.getAttribute('d')).toEqual('M4,12h4v4h-4Z');
    });

    it('should invoke coordinate functions with correct parameters and context', function() {

        function verifyCall(spy, callIndex, contextNode, data, index) {
            var call = spy.calls.all()[callIndex];
            expect(call.args[1]).toEqual(index);
            expect(call.args[0]).toEqual(data);
            expect(call.object.nodeName).toEqual(contextNode);
        }

        var x0Spy = jasmine.createSpy('x0'),
            y0Spy = jasmine.createSpy('y0'),
            x1Spy = jasmine.createSpy('x1'),
            y1Spy = jasmine.createSpy('y1');

        var band = fc.annotation.band()
            .x0(x0Spy)
            .x1(x1Spy)
            .y0(y0Spy)
            .y1(y1Spy);

        d3.select(element)
            .datum(['one', 'two'])
            .call(band);

        // x0 / y0 are called twice for each band
        verifyCall(x0Spy, 0, 'PATH', 'one', 0);
        verifyCall(x0Spy, 1, 'PATH', 'one', 0);
        verifyCall(x0Spy, 2, 'PATH', 'two', 1);
        verifyCall(x0Spy, 3, 'PATH', 'two', 1);

        verifyCall(y0Spy, 0, 'PATH', 'one', 0);
        verifyCall(y0Spy, 1, 'PATH', 'one', 0);
        verifyCall(y0Spy, 2, 'PATH', 'two', 1);
        verifyCall(y0Spy, 3, 'PATH', 'two', 1);

        verifyCall(x1Spy, 0, 'PATH', 'one', 0);
        verifyCall(x1Spy, 1, 'PATH', 'two', 1);

        verifyCall(y1Spy, 0, 'PATH', 'one', 0);
        verifyCall(y1Spy, 1, 'PATH', 'two', 1);
    });
});
