const csvParse = require('d3-dsv').csvParse;
const fsp = require('fs-promise');

const readCsv = (file) =>
    fsp.readFile(file, 'utf8')
        .then(csvParse)
        .then(data => {
            // coerce all values to numbers
            data.forEach(datum => {
                Object.keys(datum).forEach(key => {
                    if (datum[key]) {
                        datum[key] = Number(datum[key]);
                    }
                });
            });
            return data;
        });

module.exports = readCsv;
