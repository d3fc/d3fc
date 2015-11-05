describe('fc.data.random.financial', function() {

    describe('without filter', function() {
        var dataGenerator;

        beforeEach(function() {
            dataGenerator = fc.data.random.financial();
        });

        it('should return data for the requested number of days', function() {
            expect(dataGenerator(10).length)
                .toEqual(10);
        });
        it('should return an initial open value equal to the set startPrice', function() {
            dataGenerator.startPrice(50);
            expect(dataGenerator(10)[0].open)
                .toEqual(50);
        });
        it('should return an initial volume equal to the set startVolume', function() {
            dataGenerator.startVolume(100);
            expect(dataGenerator(10)[0].volume)
                .toEqual(100);
        });
    });

    describe('with filter', function() {
        var dataGenerator;

        beforeEach(function() {
            dataGenerator = fc.data.random.financial().skipWeekends();
        });

        it('should not include weekends', function() {
            var data = dataGenerator(10);

            for (var i = 0, max = data.length; i < max; i += 1) {
                var day = data[i].date.getDay();
                expect(day).not.toBe(0);
                expect(day).not.toBe(6);
            }
        });

        it('should return data for the requested number of days', function() {
            expect(dataGenerator(10).length)
                .toEqual(10);
        });
    });
});
