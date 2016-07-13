import {csvParse} from 'd3-dsv';
import fsp from 'fs-promise';

const readCsv = (file) =>
    fsp.readFile(file, 'utf8')
        .then(csvParse)
        .then(data => {
            // coerce all defined values to numbers
            data.forEach(row => {
                Object.keys(row).forEach(column => {
                    const value = row[column];
                    if (value) {
                        row[column] = Number(row[column]);
                    } else {
                        row[column] = undefined;
                    }
                });
            });
            return data;
        });

module.exports = readCsv;
