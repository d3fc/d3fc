import _bollingerBands from '../src/bollingerBands';
import readCsv from './helpers/readCsv.js';

describe('bollingerBands', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('bollingerBands.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const bollingerBands = _bollingerBands();
            const output = bollingerBands(input.map(d => d.Open));

            expect(output.map(d => d.upper))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.UPPER));
            expect(output.map(d => d.lower))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.LOWER));
            expect(output.map(d => d.average))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.SMA));
        })
        .then(done, done.fail);
    });
});
