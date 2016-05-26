const relativeStrengthIndex = require('../build/d3fc-technical-indicator').relativeStrengthIndex;
const readCsv = require('./readcsv.js');

describe('relativeStrengthIndex', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('./test/data/input.csv'),
            readCsv('./test/data/rsi.csv')
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
});
