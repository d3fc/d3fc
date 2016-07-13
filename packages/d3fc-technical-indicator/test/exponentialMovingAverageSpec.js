import _ema from '../src/exponentialMovingAverage';
import readCsv from './readcsv.js';

describe('exponentialMovingAverage', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('./test/data/input.csv'),
            readCsv('./test/data/exponentialMovingAverage.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const ema = _ema().value(d => d.Open);
            const output = ema(input);

            expect(output)
                .toBeEqualWithTolerance(expectedOutput.map(d => d.EMA));
        })
        .then(done, done.fail);
    });
});
