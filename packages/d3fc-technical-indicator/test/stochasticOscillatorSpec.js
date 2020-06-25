import stochasticOscillator from '../src/stochasticOscillator';
import readCsv from './helpers/readCsv.js';

describe('stochasticOscillator', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('stochastic.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const rsi = stochasticOscillator()
                .closeValue(d => d.Close)
                .lowValue(d => d.Low)
                .highValue(d => d.High);
            const output = rsi(input);
            expect(output.map(d => d.k))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.K));
            expect(output.map(d => d.d))
                .toBeEqualWithTolerance(expectedOutput.map(d => d.D));
        })
        .then(done, done.fail);
    });
});
