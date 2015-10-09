describe('fc.data.feed.quandl', function() {

    describe('default column name map', function() {
        var columnNameMap;

        beforeEach(function() {
            columnNameMap = fc.data.feed.quandl().columnNameMap();
        });

        it('should return "date" for "Date"', function() {
            expect(columnNameMap('Date'))
                .toBe('date');
        });
        it('should return "close" for "Close"', function() {
            expect(columnNameMap('Close'))
                .toBe('close');
        });
        it('should not remove spaces and only decapitalise the first letter', function() {
            expect(columnNameMap('Adjusted Close'))
                .toBe('adjusted Close');
        });
    });
});
