describe('legend', function() {

    var element;

    beforeEach(function() {
        element = document.createElement('div');
    });

    function verifyLegend(tableData) {
        expect(element.children[0].nodeName).toEqual('TABLE');

        var table = element.children[0];
        expect(table.children.length).toEqual(tableData.length);

        for (var i = 0; i < tableData.length; i++) {
            var row = table.children[i];
            expect(row.children[0].innerHTML).toEqual(tableData[i][0]);
            expect(row.children[1].innerHTML).toEqual(tableData[i][1]);
        }
    }

    it('should render the given items', function() {
        var legend = fc.chart.legend()
            .items([
                ['open', function(d) { return d.open; }],
                ['close', function(d) { return d.close; }]
            ]);

        var datum = {
            open: 45.67,
            close: 56.78
        };

        d3.select(element)
            .datum(datum)
            .call(legend);

        verifyLegend([
            ['open', '45.67'],
            ['close', '56.78']
        ]);
    });

    it('should invoke legend item and label functions with correct parameters and context', function() {

        var labelSpy = jasmine.createSpy('label'),
            valueSpy = jasmine.createSpy('value');

        var legend = fc.chart.legend()
            .items([
                [labelSpy, valueSpy],
                [labelSpy, valueSpy]
            ]);

        var datum = {
            open: 45.67
        };

        d3.select(element)
            .datum(datum)
            .call(legend);

        expect(labelSpy.calls.count()).toEqual(2);
        expect(valueSpy.calls.count()).toEqual(2);

        // the first invocation should pass the datum and have an index of zero
        expect(labelSpy.calls.all()[0].args).toEqual([datum, 0]);
        expect(valueSpy.calls.all()[0].args).toEqual([datum, 0]);

        // the second invocation should have an index of one
        expect(labelSpy.calls.all()[1].args).toEqual([datum, 1]);
        expect(valueSpy.calls.all()[1].args).toEqual([datum, 1]);

        // the context should be the DOM element
        expect(labelSpy.calls.all()[1].object.nodeName).toEqual('TH');
        expect(valueSpy.calls.all()[1].object.nodeName).toEqual('TD');
    });

    it('should invoke the decorate function with the correct parameters and context', function() {

        var decorateSpy = jasmine.createSpy('decorate');

        var legend = fc.chart.legend()
            .rowDecorate(decorateSpy)
            .items([
                ['header', 'value']
            ]);

        var datum = {
            open: 45.67
        };

        d3.select(element)
            .datum(datum)
            .call(legend);

        expect(decorateSpy.calls.count()).toEqual(1);

        // obtain the selection passed to the decrate function
        var call = decorateSpy.calls.first();
        var selection = call.args[0];
        // and obtain the data resulting from the data join
        var data = d3.select(selection.node()).datum();

        // verify that the data has the functored header / value
        expect(data.header()).toEqual('header');
        expect(data.value()).toEqual('value');

        // verify it has the original datum
        expect(data.datum).toEqual(datum);

    });
});
