describe('waterfall algorithm', function() {
    var algorithm, data, directions;

    beforeEach(function() {
        data = [
            { month: 'January', profit: 4000 },
            { month: 'February', profit: 2000 },
            { month: 'March', profit: -1000 },
            { month: 'April', profit: 1500 },
            { month: 'May', profit: 100 },
            { month: 'June', profit: 500 },
            { month: 'July', profit: -100 },
            { month: 'August', profit: 800 },
            { month: 'September', profit: 1200 },
            { month: 'October', profit: 1500 },
            { month: 'November', profit: 1400 },
            { month: 'December', profit: 2000 }
        ];
        algorithm = fc.series.algorithm.waterfall()
            .xValueKey('month')
            .yValue(function(d) { return d.profit; });
        directions = {
            up: 'up',
            down: 'down',
            unchanged: 'unchanged'
        };

    });

    function checkResults(outputData, expectedData) {
        var length = expectedData.length;
        expect(outputData.length).toEqual(length);

        // By making assertions in the loop a more specific error message is
        // generated for debugging.
        for (var i = 0; i < length; i += 1) {
            expect(outputData[i]).toEqual(expectedData[i]);
        }
    }

    it('should shape simple input data', function() {
        var waterfallData = algorithm(data);

        var expectedData = [
            { x: 'January', y0: 0, y1: 4000, direction: directions.up },
            { x: 'February', y0: 4000, y1: 6000, direction: directions.up },
            { x: 'March', y0: 6000, y1: 5000, direction: directions.down },
            { x: 'April', y0: 5000, y1: 6500, direction: directions.up },
            { x: 'May', y0: 6500, y1: 6600, direction: directions.up },
            { x: 'June', y0: 6600, y1: 7100, direction: directions.up },
            { x: 'July', y0: 7100, y1: 7000, direction: directions.down },
            { x: 'August', y0: 7000, y1: 7800, direction: directions.up },
            { x: 'September', y0: 7800, y1: 9000, direction: directions.up },
            { x: 'October', y0: 9000, y1: 10500, direction: directions.up },
            { x: 'November', y0: 10500, y1: 11900, direction: directions.up },
            { x: 'December', y0: 11900, y1: 13900, direction: directions.up },
            { x: 'Final', y0: 0, y1: 13900, direction: directions.unchanged }
        ];

        checkResults(waterfallData, expectedData);
    });

    it('should insert a start total', function() {
        var waterfallData = algorithm.startsWithTotal(true)(data);

        var expectedData = [
            { x: 'January', y0: 0, y1: 4000, direction: directions.unchanged },
            { x: 'February', y0: 4000, y1: 6000, direction: directions.up },
            { x: 'March', y0: 6000, y1: 5000, direction: directions.down },
            { x: 'April', y0: 5000, y1: 6500, direction: directions.up },
            { x: 'May', y0: 6500, y1: 6600, direction: directions.up },
            { x: 'June', y0: 6600, y1: 7100, direction: directions.up },
            { x: 'July', y0: 7100, y1: 7000, direction: directions.down },
            { x: 'August', y0: 7000, y1: 7800, direction: directions.up },
            { x: 'September', y0: 7800, y1: 9000, direction: directions.up },
            { x: 'October', y0: 9000, y1: 10500, direction: directions.up },
            { x: 'November', y0: 10500, y1: 11900, direction: directions.up },
            { x: 'December', y0: 11900, y1: 13900, direction: directions.up },
            { x: 'Final', y0: 0, y1: 13900, direction: directions.unchanged }
        ];

        checkResults(waterfallData, expectedData);
    });

    it('should provide a sensible default y value', function() {
        data = [{ date: 'Today', y: 20 }];
        var waterfallData = fc.series.algorithm.waterfall()
            .xValueKey('date')(data);

        var expectedData = [
            { x: 'Today', y0: 0, y1: 20, direction: directions.up },
            { x: 'Final', y0: 0, y1: 20, direction: directions.unchanged }
        ];

        checkResults(waterfallData, expectedData);
    });

    it('should insert totals', function() {
        var waterfallData = algorithm
            .total(function(d, i, inputData) {
                if ((i + 1) % 3 === 0) {
                    return 'Q' + ((i + 1) / 3) + ' total';
                }
            })(data);

        var expectedData = [
            { x: 'January', y0: 0, y1: 4000, direction: directions.up },
            { x: 'February', y0: 4000, y1: 6000, direction: directions.up },
            { x: 'March', y0: 6000, y1: 5000, direction: directions.down },
            { x: 'Q1 total', y0: 0, y1: 5000, direction: directions.unchanged },
            { x: 'April', y0: 5000, y1: 6500, direction: directions.up },
            { x: 'May', y0: 6500, y1: 6600, direction: directions.up },
            { x: 'June', y0: 6600, y1: 7100, direction: directions.up },
            { x: 'Q2 total', y0: 0, y1: 7100, direction: directions.unchanged },
            { x: 'July', y0: 7100, y1: 7000, direction: directions.down },
            { x: 'August', y0: 7000, y1: 7800, direction: directions.up },
            { x: 'September', y0: 7800, y1: 9000, direction: directions.up },
            { x: 'Q3 total', y0: 0, y1: 9000, direction: directions.unchanged },
            { x: 'October', y0: 9000, y1: 10500, direction: directions.up },
            { x: 'November', y0: 10500, y1: 11900, direction: directions.up },
            { x: 'December', y0: 11900, y1: 13900, direction: directions.up },
            { x: 'Q4 total', y0: 0, y1: 13900, direction: directions.unchanged }
        ];

        checkResults(waterfallData, expectedData);
    });
});
