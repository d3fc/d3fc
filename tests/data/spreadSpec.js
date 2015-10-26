describe('fc.data.spread', function () {

    var spread;

    beforeEach(function () {
        spread = fc.data.spread()
          .xValueKey('Make');
    });

    var data = [
        {
            'Make': 'Porsche',
            'Speed': 254,
            'Size': '55'
        },
        {
            'Make': 'Skoda',
            'Speed': 54,
            'Size': '56'
        }
    ];

    var partialData = [
        {
            'Make': 'Porsche',
            'Speed': 254,
            'Size': '55'
        },
        {
            'Make': 'Skoda',
            //'Speed': 54,
            'Size': '56'
        }
    ];

    it('should spread into separate series', function () {
        var series = spread(data);
        expect(series.length).toEqual(2);
    });

    it('should correctly spread the series data', function () {
        var series = spread(data);

        var speedSeries = [
            {
                'x': 'Porsche',
                'y': 254
            },
            {
                'x': 'Skoda',
                'y': 54
            }
        ];
        speedSeries.key = 'Speed';
        expect(series[0]).toEqual(speedSeries);
    });

    it('should convert strings to numbers', function () {
        var series = spread(data);

        var colourSeries = [
            {
                'x': 'Porsche',
                'y': 55
            },
            {
                'x': 'Skoda',
                'y': 56
            }
        ];
        colourSeries.key = 'Size';
        expect(series[1]).toEqual(colourSeries);
    });

    it('should handle partial data', function () {
        var series = spread(partialData);

        var speedSeries = [
            {
                'x': 'Porsche',
                'y': 254
            },
            {
                'x': 'Skoda',
                'y': 0 // <-- the missing value becomes a zero
            }
        ];
        speedSeries.key = 'Speed';
        expect(series.length).toEqual(2);
        expect(series[0]).toEqual(speedSeries);
    });

    it('should allow a custom yValue accessor', function () {
        spread.yValue(function (row, key) {
            return row.Size + '-fish';
        });
        var series = spread(partialData);

        var speedSeries = [
            {
                'x': 'Porsche',
                'y': '55-fish'
            },
            {
                'x': 'Skoda',
                'y': '56-fish'
            }
        ];
        speedSeries.key = 'Size';
        expect(series[1]).toEqual(speedSeries);
    });
});
