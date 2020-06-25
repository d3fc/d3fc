import _forceIndex from '../src/forceIndex';
import readCsv from './helpers/readCsv.js';

describe('forceIndex', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('forceIndex.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const forceIndex = _forceIndex()
                .closeValue(d => d.Close)
                .volumeValue(d => d.Volume);
            const output = forceIndex(input);
            expect(output)
                .toBeEqualWithTolerance(expectedOutput.map(d => d.FIEMA), 4);
        })
        .then(done, done.fail);
    });
});
