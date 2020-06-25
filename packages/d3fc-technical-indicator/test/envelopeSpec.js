import _envelope from '../src/envelope';
import readCsv from './helpers/readCsv.js';

describe('envelope', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('envelope.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const envelope = _envelope();
            const output = envelope(input.map(d => d.Open));

            expect(output.map(d => d.upper))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.UPPER));
            expect(output.map(d => d.lower))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.LOWER));
        })
        .then(done, done.fail);
    });
});
