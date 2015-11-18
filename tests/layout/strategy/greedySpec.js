describe('fc.layout.strategy.greedy', function() {

    var containerWidth = 100,
        containerHeight = 100;
    var elementWidth = 10,
        elementHeight = 10;

    var data = [
        {x: 50, y: 50, width: elementWidth, height: elementHeight}
    ];

    var strategiser = fc.layout.strategy.greedy()
        .containerWidth(containerWidth)
        .containerHeight(containerHeight);

    describe('initial 4-placements', function() {

        it('should not change the data when there\'s only one datapoint', function() {
            var result = strategiser(data);
            expect(result[0].x).toEqual(50);
            expect(result[0].y).toEqual(50);
        });

        it('moves a label left if there is an overlap', function() {
            data.push({x: 45, y: 50, width: elementWidth, height: elementHeight});
            var result = strategiser(data);
            expect(result[1].x).toEqual(35);
            expect(result[1].y).toEqual(50);
        });

        it('moves a label up, left if there is an overlap to left', function() {
            data.push({x: 45, y: 45, width: elementWidth, height: elementHeight});
            var result = strategiser(data);
            expect(result[2].x).toEqual(35);
            expect(result[2].y).toEqual(35);
        });

        it('moves a label up if there is an overlap to up, left', function() {
            data.push({x: 50, y: 45, width: elementWidth, height: elementHeight});
            var result = strategiser(data);
            expect(result[3].x).toEqual(50);
            expect(result[3].y).toEqual(35);
        });
    });

    describe('final 4 placements', function() {

        beforeEach(function() {
            data = [
                {x: 0, y: 0, width: elementWidth, height: elementHeight},
                {x: 19, y: 0, width: elementWidth, height: elementHeight},
                {x: 0, y: 19, width: elementWidth, height: elementHeight},
                {x: 19, y: 19, width: elementWidth, height: elementHeight}
            ];
        });

        it('moves a label up by half width if there is no prior fit', function() {
            var sampledData = [data[0], data[2]];
            sampledData.push({x: 8, y: 15, width: 6, height: 6});
            var result = strategiser(sampledData);
            expect(result[2].x).toEqual(8);
            expect(result[2].y).toEqual(12);
        });

        it('moves a label half left if there is no prior fit', function() {
            var sampledData = [data[0], data[1]];
            sampledData.push({x: 15, y: 8, width: 6, height: 6});
            var result = strategiser(sampledData);
            expect(result[2].x).toEqual(12);
            expect(result[2].y).toEqual(8);
        });

        it('moves a label half up, left if there is no prior fit', function() {
            var sampledData = [data[1], data[3]];
            // Box colliding with the next box to move it left
            sampledData.push({x: 25, y: 13, width: 1, height: 1});

            sampledData.push({x: 21, y: 14, width: 6, height: 6});
            var result = strategiser(sampledData);
            expect(result[3].x).toEqual(15);
            expect(result[3].y).toEqual(11);
        });

        it('moves a label up, half left if there is no prior fit', function() {
            var sampledData = [data[2], data[3]];
            // Box colliding with the next box to move it left
            sampledData.push({x: 13, y: 25, width: 1, height: 1});

            sampledData.push({x: 14, y: 21, width: 6, height: 6});
            var result = strategiser(sampledData);
            expect(result[3].x).toEqual(11);
            expect(result[3].y).toEqual(15);
        });
    });

});
