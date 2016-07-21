import greedy from '../src/greedy';

describe('greedy', () => {

    var width = 100;
    var height = 100;
    var elementWidth = 10;
    var elementHeight = 10;

    var data = [
        {x: 50, y: 50, width: elementWidth, height: elementHeight}
    ];

    var strategiser = greedy()
        .bounds({x: 0, y: 0, width, height});

    describe('out of bounds data', () => {
        it('should not change the data when there\'s only one datapoint', () => {
            var outOfBounds = [{x: 5000, y: 5000, width: elementWidth, height: elementHeight}];
            var result = strategiser(outOfBounds);
            expect(result[0].x).toEqual(5000);
            expect(result[0].y).toEqual(5000);
        });
    });

    describe('initial 4-placements', () => {

        it('should not change the data when there\'s only one datapoint', () => {
            var result = strategiser(data);
            expect(result[0].x).toEqual(50);
            expect(result[0].y).toEqual(50);
        });

        it('moves a label left if there is an overlap', () => {
            data.push({x: 50, y: 50, width: elementWidth, height: elementHeight});
            var result = strategiser(data);
            expect(result[0].x).toEqual(40);
            expect(result[0].y).toEqual(50);
        });

        it('moves a label up, left if there is an overlap to left', () => {
            data.push({x: 50, y: 50, width: elementWidth, height: elementHeight});
            var result = strategiser(data);
            expect(result[1].x).toEqual(40);
            expect(result[1].y).toEqual(40);
        });

        it('moves a label up if there is an overlap to up, left', () => {
            data.push({x: 50, y: 50, width: elementWidth, height: elementHeight});
            var result = strategiser(data);
            expect(result[2].x).toEqual(50);
            expect(result[2].y).toEqual(40);
        });
    });

    describe('final 4 placements', () => {

        beforeEach(() => {
            data = [
                {x: 0, y: 0, width: elementWidth, height: elementHeight},
                {x: 19, y: 0, width: elementWidth, height: elementHeight},
                {x: 0, y: 19, width: elementWidth, height: elementHeight},
                {x: 19, y: 19, width: elementWidth, height: elementHeight}
            ];
        });

        it('moves a label up by half width if there is no prior fit', () => {
            var sampledData = [data[0], data[2]];
            sampledData.push({x: 8, y: 15, width: 6, height: 6});
            var result = strategiser(sampledData);
            expect(result[2].x).toEqual(8);
            expect(result[2].y).toEqual(12);
        });

        it('moves a label half left if there is no prior fit', () => {
            var sampledData = [data[0], data[1]];
            sampledData.push({x: 15, y: 8, width: 6, height: 6});
            var result = strategiser(sampledData);
            expect(result[2].x).toEqual(12);
            expect(result[2].y).toEqual(8);
        });

        it('moves a label half up, left if there is no prior fit', () => {
            var sampledData = [
                {x: 25, y: 13, width: 1, height: 1},
                {x: 21, y: 14, width: 6, height: 6},
                data[1], data[3]];
            // Box colliding with the next box to move it left
            var result = strategiser(sampledData);
            expect(result[1].x).toEqual(15);
            expect(result[1].y).toEqual(11);
        });

        it('moves a label up, half left if there is no prior fit', () => {
            var sampledData = [
                {x: 13, y: 25, width: 1, height: 1},
                {x: 14, y: 21, width: 6, height: 6},
                data[2], data[3]];
            // Box colliding with the next box to move it left
            var result = strategiser(sampledData);
            expect(result[1].x).toEqual(11);
            expect(result[1].y).toEqual(15);
        });
    });

});
