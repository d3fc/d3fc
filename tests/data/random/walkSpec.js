describe('walk', function() {

    beforeEach(function() {
        // create a random number generator that produces a predictable sequence
        // 0.2, 0.8, 0.2, 0.8 ...
        var index = 0;
        spyOn(d3.random, 'normal').and.returnValue(function() {
            return index++ % 2 ? 0.2 : 0.8;
        });
    });

    it('should output the correct number sequence', function() {
        var walk = fc.data.random.walk()
            .steps(5);

        var walkData = walk(10);

        // this test data was generted from the random walk at the following point:
        // b0ee0a397a6ecc4cf60663d5b51af15de3534ef1
        // and is assumed correct for the purposes of further refactor.
        expect(walkData)
            .toEqual([10, 10.563051249613967, 10.862390962256633, 11.473999242766038, 11.799153741691457]);
    });

    it('should accomodate boundary values', function() {
        expect(fc.data.random.walk().steps(1)(10)).toEqual([10]);
        expect(fc.data.random.walk().steps(0)(10)).toEqual([]);
    });
});
