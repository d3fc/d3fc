const _percentageChange = require('../build/d3fc-technical-indicator').percentageChange;

describe('percentageChange', function() {

    it('should return the percentage change', function() {
        var data = [1, 2, 3];
        var percentageChange = _percentageChange();

        expect(percentageChange(data))
            .toEqual([0, 1, 2]);
    });

    it('should return the percentage change for an a baseIndex > 0', function() {
        var data = [1, 2, 3];
        var percentageChange = _percentageChange()
            .baseIndex(1);

        expect(percentageChange(data))
            .toEqual([-0.5, 0, 0.5]);
    });
});
