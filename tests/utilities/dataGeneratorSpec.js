(function(d3, fc) {
    'use strict';

    describe('fc.utilities.dataGenerator', function() {

        describe('without filter', function() {
            var dataGenerator;

            beforeEach(function() {
                dataGenerator = fc.utilities.dataGenerator().filter(null);
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
    });

}(d3, fc));