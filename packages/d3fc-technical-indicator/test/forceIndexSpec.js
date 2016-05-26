const _forceIndex = require('../build/d3fc-technical-indicator').forceIndex;
const readCsv = require('./readcsv.js');

describe('forceIndex', () => {
    it('should match the expected output', done => {
        Promise.all([
            readCsv('./test/data/input.csv'),
            readCsv('./test/data/forceIndex.csv')
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
