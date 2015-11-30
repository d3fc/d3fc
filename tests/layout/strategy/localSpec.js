describe('fc.layout.strategy.local', function() {

    var containerWidth = 100,
        containerHeight = 100;
    var elementWidth = 10,
        elementHeight = 10;

    var data = [
        {x: 50, y: 50, width: elementWidth, height: elementHeight},
        {x: 45, y: 50, width: elementWidth, height: elementHeight},
        {x: 50, y: 45, width: elementWidth, height: elementHeight},
        {x: 45, y: 45, width: elementWidth, height: elementHeight},
        {x: 40, y: 45, width: elementWidth, height: elementHeight},
        {x: 40, y: 50, width: elementWidth, height: elementHeight},
        {x: 50, y: 40, width: elementWidth, height: elementHeight},
        {x: 40, y: 40, width: elementWidth, height: elementHeight}
    ];

    var strategiser = fc.layout.strategy.local()
        .containerWidth(containerWidth)
        .containerHeight(containerHeight);

    var firstIteration = strategiser.iterations(1)(data);
    var secondIteration = strategiser.iterations(2)(data);
    var thirdIteration = strategiser.iterations(3)(data);

    describe('iteration one', function() {

        it('should alter the data', function() {
            expect(firstIteration).not.toEqual(data);
        });

        it('should alter almost every point in the first iteration', function() {
            expect(firstIteration[1].x).toEqual(data[1].x - 10);
            expect(firstIteration[1].y).toEqual(data[1].y);

            expect(firstIteration[2].x).toEqual(data[2].x - 10);
            expect(firstIteration[2].y).toEqual(data[2].y - 10);

            // There are many valid placements for 3. It should move left
            expect(firstIteration[3].x).toEqual(data[3].x - 10);

            // 4 should move left as there's space
            expect(firstIteration[4].x).toEqual(data[4].x - 10);
            expect(firstIteration[4].y).toEqual(data[4].y);

            // 7 should move up,left as it can expand there
            expect(firstIteration[7].x).toEqual(data[7].x - 10);
            expect(firstIteration[7].y).toEqual(data[7].y - 10);
        });

    });

    describe('iteration two', function() {

        it('should alter fewer data points in the second iteration', function() {
            expect(secondIteration[2].x).toEqual(firstIteration[2].x);
            expect(secondIteration[2].y).toEqual(firstIteration[2].y + 5);

            expect(secondIteration[5].x).toEqual(firstIteration[5].x);
            expect(secondIteration[5].y).toEqual(firstIteration[5].y);

            // The rest should be the same
            expect(secondIteration[0]).toEqual(firstIteration[0]);
            expect(secondIteration[1]).toEqual(firstIteration[1]);
            expect(secondIteration[3]).toEqual(firstIteration[3]);
            expect(secondIteration[4]).toEqual(firstIteration[4]);
            expect(secondIteration[6]).toEqual(firstIteration[6]);
            expect(secondIteration[7]).toEqual(firstIteration[7]);
        });

    });

    describe('iteration three', function() {

        it('should be the same as iteration two', function() {
            expect(thirdIteration).toEqual(secondIteration);
        });

    });

});
