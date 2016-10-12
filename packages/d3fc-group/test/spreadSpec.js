import spread  from '../src/spread';

describe('spread', () => {

    let spreader;

    beforeEach(() => {
        spreader = spread()
          .key('Make');
    });

    const data = [
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

    const partialData = [
        {
            'Make': 'Porsche',
            'Speed': 254,
            'Size': '55'
        },
        {
            'Make': 'Skoda',
            // 'Speed': 54,
            'Size': '56'
        }
    ];

    describe('vertical spread', () => {

        it('should spread into separate series', () => {
            const series = spreader(data);
            expect(series.length).toEqual(2);
        });

        it('should correctly spread the series data', () => {
            const series = spreader(data);

            const speedSeries = {
                key: 'Speed',
                values: [
                    {
                        'x': 'Porsche',
                        'y': 254
                    },
                    {
                        'x': 'Skoda',
                        'y': 54
                    }
                ]
            };
            expect(series[0]).toEqual(speedSeries);
        });

        it('should convert strings to numbers', () => {
            const series = spreader(data);

            const colourSeries = {
                key: 'Size',
                values: [
                    {
                        'x': 'Porsche',
                        'y': 55
                    },
                    {
                        'x': 'Skoda',
                        'y': 56
                    }
                ]
            };
            expect(series[1]).toEqual(colourSeries);
        });

        it('should handle partial data', () => {
            const series = spreader(partialData);

            const speedSeries = {
                key: 'Speed',
                values: [
                    {
                        'x': 'Porsche',
                        'y': 254
                    }
                ]
            };
            expect(series.length).toEqual(2);
            expect(series[0]).toEqual(speedSeries);
        });

        it('should allow a custom cellValue accessor', () => {
            spreader.cellValue(function(row, key) {
                return row.Size + '-fish';
            });
            const series = spreader(partialData);

            const speedSeries = {
                key: 'Size',
                values: [
                    {
                        'x': 'Porsche',
                        'y': '55-fish'
                    },
                    {
                        'x': 'Skoda',
                        'y': '56-fish'
                    }
                ]
            };
            expect(series[1]).toEqual(speedSeries);
        });
    });

    describe('horizontal spread', () => {

        it('should spread into separate series', () => {
            spreader.orient('horizontal');
            const series = spreader(data);
            expect(series.length).toEqual(2);
        });

        it('should correctly spread the series data', () => {
            spreader.orient('horizontal');
            const series = spreader(data);

            const speedSeries = [
                {
                    key: 'Porsche',
                    values: [
                        { x: 'Speed', y: 254 },
                        { x: 'Size', y: 55 }
                    ]
                },
                {
                    key: 'Skoda',
                    values: [
                        { x: 'Speed', y: 54 },
                        { x: 'Size', y: 56 }
                    ]
                }
            ];
            expect(series).toEqual(speedSeries);
        });

        it('should handle partial data', () => {
            spreader.orient('horizontal');
            const series = spreader(partialData);

            const speedSeries = [
                {
                    key: 'Porsche',
                    values: [
                        { x: 'Speed', y: 254 },
                        { x: 'Size', y: 55 }
                    ]
                },
                {
                    key: 'Skoda',
                    values: [
                        // { x: 'Speed', y: 54 }, <-- missing data
                        { x: 'Size', y: 56 }
                    ]
                }
            ];

            expect(series.length).toEqual(2);
            expect(series).toEqual(speedSeries);
        });

        it('should allow a custom y-value accessor', () => {
            spreader.orient('horizontal')
                .cellValue(function(row, key) {
                    return row.Size + '-fish';
                });
            const series = spreader(data);

            const speedSeries = [
                {
                    key: 'Porsche',
                    values: [
                        { x: 'Speed', y: '55-fish' },
                        { x: 'Size', y: '55-fish' }
                    ]
                },
                {
                    key: 'Skoda',
                    values: [
                        { x: 'Speed', y: '56-fish' },
                        { x: 'Size', y: '56-fish' }
                    ]
                }
            ];
            expect(series).toEqual(speedSeries);
        });

    });
});
