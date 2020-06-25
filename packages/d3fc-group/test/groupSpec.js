import { default as _group }  from '../src/group';

describe('group', () => {

    let group;

    beforeEach(() => {
        group = _group()
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

    describe('vertical group', () => {

        it('should group into separate series', () => {
            const series = group(data);
            expect(series).toHaveLength(2);
        });

        it('should correctly group the series data', () => {
            const series = group(data);

            const speedSeries = [
                ['Porsche', 254],
                ['Skoda', 54]
            ];
            expect(series[0]).toEqualArray(speedSeries);
            expect(series[0].key).toEqual('Speed');
        });

        it('should add the datum to each cell value', () => {
            const series = group(data);

            expect(series[0][0].data).toEqual(data[0]);
            expect(series[0][1].data).toEqual(data[1]);
            expect(series[1][0].data).toEqual(data[0]);
            expect(series[1][1].data).toEqual(data[1]);
        });

        it('should convert strings to numbers', () => {
            const series = group(data);

            const colourSeries = [
                ['Porsche', 55],
                ['Skoda', 56]
            ];
            expect(series[1]).toEqualArray(colourSeries);
            expect(series[1].key).toEqual('Size');
        });

        it('should handle partial data', () => {
            const series = group(partialData);

            const speedSeries = [
                ['Porsche', 254]
            ];
            expect(series).toHaveLength(2);
            expect(series[0]).toEqualArray(speedSeries);
        });

        it('should allow a custom value accessor', () => {
            group.value(function(row, key) {
                return row.Size + '-fish';
            });
            const series = group(partialData);

            const sizeSeries = [
                ['Porsche', '55-fish'],
                ['Skoda', '56-fish']
            ];
            expect(series[1]).toEqualArray(sizeSeries);
        });
    });

    describe('horizontal group', () => {

        it('should group into separate series', () => {
            group.orient('horizontal');
            const series = group(data);
            expect(series).toHaveLength(2);
        });

        it('should correctly group the series data', () => {
            group.orient('horizontal');
            const series = group(data);

            const speedSeries = [
                [
                    [ 'Speed', 254 ],
                    [ 'Size', 55 ]
                ],
                [
                    [ 'Speed', 54 ],
                    [ 'Size', 56 ]
                ]
            ];
            expect(series[0]).toEqualArray(speedSeries[0]);
            expect(series[1]).toEqualArray(speedSeries[1]);
            expect(series[0].key).toEqual('Porsche');
            expect(series[1].key).toEqual('Skoda');
        });

        it('should add the datum to each cell value', () => {
            const series = group.orient('horizontal')(data);

            expect(series[0][0].data).toEqual(data[0]);
            expect(series[0][1].data).toEqual(data[0]);
            expect(series[1][0].data).toEqual(data[1]);
            expect(series[1][1].data).toEqual(data[1]);
        });

        it('should handle partial data', () => {
            group.orient('horizontal');
            const series = group(partialData);

            const speedSeries =  [
                [
                    [ 'Speed', 254 ],
                    [ 'Size', 55 ]
                ],
                [
                    // [ 'Speed', 54 ],
                    [ 'Size', 56 ]
                ]
            ];
            expect(series).toHaveLength(2);
            expect(series[0]).toEqualArray(speedSeries[0]);
            expect(series[1]).toEqualArray(speedSeries[1]);
        });

        it('should allow a custom y-value accessor', () => {
            group.orient('horizontal')
                .value(function(row, key) {
                    return row.Size + '-fish';
                });
            const series = group(data);

            const speedSeries = [
                [
                    ['Speed', '55-fish'],
                    ['Size', '55-fish']
                ],
                [
                    ['Speed', '56-fish'],
                    ['Size', '56-fish']
                ]
            ];
            expect(series[0]).toEqualArray(speedSeries[0]);
            expect(series[1]).toEqualArray(speedSeries[1]);
        });

    });
});
