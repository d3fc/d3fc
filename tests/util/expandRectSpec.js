describe('fc.util.expandRect', function() {

    it('should expand integers', function() {
        var margin = fc.util.expandRect(10);

        expect(margin).toEqual({
            top: 10,
            bottom: 10,
            right: 10,
            left: 10
        });
    });

    it('should fill missing properties', function() {
        var margin = fc.util.expandRect({
            top: 10
        });

        expect(margin).toEqual({
            top: 10,
            bottom: 0,
            right: 0,
            left: 0
        });
    });

    it('should not alter already complete rectangle', function() {
        var margin = fc.util.expandRect({
            top: 1,
            bottom: 2,
            right: 3,
            left: 4
        });

        expect(margin).toEqual({
            top: 1,
            bottom: 2,
            right: 3,
            left: 4
        });
    });
});
