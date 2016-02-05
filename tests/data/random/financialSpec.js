describe('fc.data.random.financial', function() {

    var generator;
    beforeEach(function() {
        generator = fc.data.random.financial()
            .startDate(new Date(2015, 0, 1))
            .granularity(60 * 60 * 24);
    });

    it('should return the correct number of data points', function() {
        var result = generator(10);
        expect(result.length).toBe(10);
    });

    it('should always return an initial date equal to the set startDate', function() {
        var result0 = generator(10);
        var result1 = generator(10);
        expect(result0[0].date).toEqual(new Date(2015, 0, 1));
        expect(result1[0].date).toEqual(new Date(2015, 0, 1));
    });

    it('should always return an initial open value equal to the set startPrice', function() {
        generator.startPrice(50);
        var result0 = generator(10);
        var result1 = generator(10);
        expect(result0[0].open).toEqual(50);
        expect(result1[0].open).toEqual(50);
    });

    it('should exclude points with filtered date from result', function() {
        generator.filter(function(d) {
            return d.date > new Date(2015, 0, 5);
        });
        var stream = generator.stream();
        var result = stream.until(function(datum) { return datum.date > new Date(2015, 0, 10); });
        expect(result.length).toBe(5);
    });

    it('with fc.data.random.filter.skipWeekends filter, should not include weekends', function() {
        generator.filter(fc.data.random.filter.skipWeekends());
        var data = generator(10);
        for (var i = 0, max = data.length; i < max; i += 1) {
            var day = data[i].date.getDay();
            expect(day).not.toBe(0);
            expect(day).not.toBe(6);
        }
    });

    it('stream.next should initially return datum at start date', function() {
        var stream = generator.stream();
        var datum = stream.next();
        expect(datum.date).toEqual(new Date(2015, 0, 1));
    });

    it('stream.next should subsequently return datum with date incremented by set granularity', function() {
        var stream = generator.stream();
        stream.next();
        var datum = stream.next();
        expect(datum.date).toEqual(new Date(2015, 0, 2));
    });

    it('stream.next with filter should skip filtered dates', function() {
        generator.filter(function(d) {
            return d.date > new Date(2015, 0, 4) && d.date.getTime() !== new Date(2015, 0, 6).getTime();
        });
        var stream = generator.stream();
        var first = stream.next();
        var second = stream.next();
        expect(first.date).toEqual(new Date(2015, 0, 5));
        expect(second.date).toEqual(new Date(2015, 0, 7));
    });

    it('stream.take should return the requested number of points', function() {
        generator.filter(function(d) {
            return d.date > new Date(2015, 0, 5);
        });
        var stream = generator.stream();
        var data = stream.take(10);
        expect(data.length).toBe(10);
    });

    it('stream.take with non-positive numeric argument should return empty array', function() {
        var stream = generator.stream();
        var data0 = stream.take(0);
        expect(data0.length).toBe(0);
        var data1 = stream.take(-1);
        expect(data1.length).toBe(0);
    });

    it('stream.until should append generated datums to returned array until datum satisfies specified condition', function() {
        var stream = generator.stream();
        var data = stream.until(function(d) { return d.date > new Date(2015, 0, 10); });
        expect(data.length).toBe(10);
    });
});
