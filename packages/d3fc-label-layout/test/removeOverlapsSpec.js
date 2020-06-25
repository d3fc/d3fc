import removeOverlaps from '../src/removeOverlaps';

describe('removeOverlaps', () => {

    const strategy = removeOverlaps();

    it('should not affect a layout with no overlaps', () => {
        const data = [
            {x: 0, y: 0, width: 10, height: 10},
            {x: 20, y: 20, width: 10, height: 10}
        ];
        const result = strategy(data);
        expect(result.filter(r => r.hidden)).toHaveLength(0);
    });

    it('should hide overlaps', () => {
        const data = [
            {x: 15, y: 15, width: 10, height: 10},
            {x: 20, y: 20, width: 10, height: 10}
        ];
        const result = strategy(data);
        expect(result.filter(r => r.hidden)).toHaveLength(1);
    });

    it('should favour hiding rectangles with the greatest overlap', () => {
        const data = [
            {x: 0, y: 0, width: 10, height: 10},
            // all three rectangles overlap, however removing this one is the most efficient move
            {x: 8, y: 8, width: 10, height: 10},
            {x: 11, y: 11, width: 10, height: 10}
        ];
        const result = strategy(data);
        expect(result.filter(r => r.hidden)).toHaveLength(1);
        expect(data[1].hidden).toEqual(true);
    });

});
