import annealing from '../src/annealing';

describe('annealing', () => {

    var width = 100;
    var height = 100;
    var elementWidth = 10;
    var elementHeight = 10;

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

    var strategiser = annealing()
        .bounds({x: 0, y: 0, width, height});

    var mathRandom = Math.random;

    // Mock Random due to the
    // algorithm relying on random
    // (therefore the test won't be great, but it will be repeatable)

    // Make this more predictable (i % 10 / 10); i is the count of invocations of random
    var i = 0;
    Math.random = () => { return ++i % 10 / 10; };
    var firstResults = strategiser(data);
    var secondResults = strategiser(data);
    Math.random = mathRandom;

    describe('mocked random', () => {

        it('should alter the data', () => {
            expect(firstResults).not.toEqual(data);
        });

        it('should output the same results each time', () => {
            expect(secondResults).toEqual(firstResults);

            expect(firstResults[0].x).toEqual(50);
            expect(firstResults[0].y).toEqual(50);

            expect(firstResults[1].x).toEqual(35);
            expect(firstResults[1].x).toEqual(35);

            expect(firstResults[2].x).toEqual(50);
            expect(firstResults[2].y).toEqual(35);

            expect(firstResults[3].x).toEqual(45);
            expect(firstResults[3].y).toEqual(40);

            expect(firstResults[4].x).toEqual(35);
            expect(firstResults[4].y).toEqual(45);

            expect(firstResults[5].x).toEqual(30);
            expect(firstResults[5].y).toEqual(45);

            expect(firstResults[6].x).toEqual(45);
            expect(firstResults[6].y).toEqual(30);

            expect(firstResults[7].x).toEqual(data[7].x);
            expect(firstResults[7].y).toEqual(data[7].y);
        });

    });

});
