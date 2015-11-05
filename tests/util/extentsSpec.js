describe('fc.util.extent', function() {

    function obj(val) {
        return {
            high: val + 5,
            low: val - 5
        };
    }

    it('should compute extents based on the supplied fields', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = fc.util.extent().fields(['high'])(data);
        expect(extents).toEqual([6, 15]);

        extents = fc.util.extent().fields(['high', 'low'])(data);
        expect(extents).toEqual([-4, 15]);
    });

    it('should support a single field name', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = fc.util.extent().fields('high')(data);
        expect(extents).toEqual([6, 15]);
    });

    it('should support arrays of arrays', function() {
        var data = [obj(2), obj(1)];
        var data2 = [obj(4), obj(5)];

        var extents = fc.util.extent().fields('high')([data, data2]);
        expect(extents).toEqual([6, 10]);
    });

    it('should support accessor functions', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = fc.util.extent().fields(function(d) { return d.high + 100; })(data);
        expect(extents).toEqual([106, 115]);
    });

    it('should support mixed field names and accessor functions', function() {
        var data = [obj(1), obj(2), obj(10)];

        var extents = fc.util.extent().fields(['high', function(d) { return d.high + 100; }])(data);
        expect(extents).toEqual([6, 115]);
    });

    it('should support symmetrical domains', function() {
        var data = [obj(1), obj(10)];

        var extents = fc.util.extent().fields('high').symmetricalAbout(0)(data);
        expect(extents).toEqual([-15, 15]);

        extents = fc.util.extent().fields('high').symmetricalAbout(10)(data);
        expect(extents).toEqual([5, 15]);
    });

    it('should support including a max value in the range', function() {
        var data = [obj(1), obj(2)];

        var extents = fc.util.extent()
            .fields('high')
            .include(10)(data);
        expect(extents).toEqual([6, 10]);
    });

    it('should support including a min value in the range', function() {
        var data = [obj(1), obj(2)];

        var extents = fc.util.extent()
            .fields('high')
            .include(0)(data);
        expect(extents).toEqual([0, 7]);
    });

    it('should support including a value within the range', function() {
        var data = [obj(1), obj(3)];

        var extents = fc.util.extent()
            .fields('high')
            .include(7)(data);
        expect(extents).toEqual([6, 8]);
    });

    it('should support increasing the range', function() {
        var data = [obj(5), obj(15)];

        var extents = fc.util.extent()
            .fields('high')
            .pad(1)(data);
        expect(extents).toEqual([5, 25]);
    });

    it('should support padding an empty dataset', function() {
        var data = [];

        var extents = fc.util.extent()
            .fields('high')
            .pad(2)(data);
        expect(isNaN(extents[0])).toBe(true);
        expect(isNaN(extents[1])).toBe(true);
    });

    it('should support padding zero as an identity', function() {
        var data = [obj(1), obj(2)];

        var extents = fc.util.extent()
            .fields('high')
            .pad(0)(data);
        expect(extents).toEqual([6, 7]);
    });

    it('should pad the range, then include the extra point', function() {
        var data = [obj(5), obj(15)];

        var extents = fc.util.extent()
            .include(0)
            .fields('high')
            .pad(1)(data);
        expect(extents).toEqual([0, 25]);

        extents = fc.util.extent()
            .include(30)
            .fields('high')
            .pad(1)(data);
        expect(extents).toEqual([5, 30]);
    });

    it('should pad dates', function() {
        var date1 = new Date(2014, 0, 10);
        var date2 = new Date(2014, 0, 20);
        var data = [{ date: date1 }, { date: date2 }];

        var extents = fc.util.extent()
            .fields('date')
            .pad(1)(data);
        expect(extents).toEqual([new Date(2014, 0, 5), new Date(2014, 0, 25)]);
    });

    it('should calculate symmetry, pad, and then include the extra point in the range', function() {
        var data = [obj(8), obj(13)];

        var extents = fc.util.extent()
            .include(5)
            .fields('high')
            .pad(1)
            .symmetricalAbout(17)(data);
        expect(extents).toEqual([5, 25]);
    });

});
