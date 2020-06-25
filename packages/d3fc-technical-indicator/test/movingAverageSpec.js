import _movingAverage from '../src/movingAverage';
import readCsv from './helpers/readCsv.js';

describe('movingAverage', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('movingAverage.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const movingAverage = _movingAverage().value(d => d.Open);
            const output = movingAverage(input);
            expect(output)
                .toBeEqualWithTolerance(expectedOutput.map(d => d.MA));
        })
        .then(done, done.fail);
    });
});
