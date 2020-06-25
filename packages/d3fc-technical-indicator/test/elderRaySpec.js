import _elderRay from '../src/elderRay';
import readCsv from './helpers/readCsv.js';

describe('elderRay', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('elderRay.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const elderRay = _elderRay()
                .closeValue(d => d.Close)
                .highValue(d => d.High)
                .lowValue(d => d.Low);
            const output = elderRay(input);

            expect(output.map(d => d.bullPower))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.BULL));
            expect(output.map(d => d.bearPower))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.BEAR));
        })
        .then(done, done.fail);
    });
});
