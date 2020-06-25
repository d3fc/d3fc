import relativeStrengthIndex from '../src/relativeStrengthIndex';
import readCsv from './helpers/readCsv.js';

describe('relativeStrengthIndex', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('input.csv'),
            readCsv('rsi.csv')
        ])
        .then(result => {
            const input = result[0];
            const expectedOutput = result[1];

            const rsi = relativeStrengthIndex().value(d => d.Close);
            const output = rsi(input);
            expect(output)
                .toBeEqualWithTolerance(expectedOutput.map(d => d.RSI));
        })
        .then(done, done.fail);
    });

    it('should return undefined for defined input following non-leading undefined input', () => {
        const rsi = relativeStrengthIndex().period(2);
        const input = [1, 2, 3, 4, 3, undefined, 2, 3, 4];
        const expectedOutput = [undefined, undefined, 100, 100, 50, undefined, undefined, undefined, undefined];
        expect(rsi(input)).toEqual(expectedOutput);
    });

    it('should return correct output with 0 as an input value', () => {
        const rsi = relativeStrengthIndex().period(2);
        const input = [0, 16, 0, 0, 0, 0, 8, 8];
        const expectedOutput = [undefined, undefined, 50, 50, 50, 50, 90, 90];
        expect(rsi(input)).toEqual(expectedOutput);
    });
});
