import _macd from '../src/macd';
import readCsv from './helpers/readCsv.js';

describe('macd', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('macd.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const macd = _macd().slowPeriod(29);
            const output = macd(input.map(d => d.Open));

            expect(output.map(d => d.macd))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.MACD));
            expect(output.map(d => d.signal))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.SIGNAL));
            expect(output.map(d => d.divergence))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.HISTOGRAM));
        })
        .then(done, done.fail);
    });
});
