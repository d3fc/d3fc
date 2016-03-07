const Combinatorics = require('js-combinatorics');

const widths  = [null, 20, 60];
const heights = [null, 40, 80];
const horizontalAlignments  = [null, 'left', 'right', 'center'];
const verticalAlignments    = [null, 'bottom', 'top', 'center'];
const orients = [null, 'horizontal', 'vertical'];
const caps = [null, 10, 20];

const results = {
    bar: {
        keys: ['width', 'height', 'horizontalAlign', 'verticalAlign'],
        combinations: Combinatorics.cartesianProduct(
            widths,  // Bar chart needs a width
            heights.slice(1),
            horizontalAlignments,
            verticalAlignments
        ).toArray()
    },

    boxPlot: {
        keys: ['width', 'orient', 'cap'],
        combinations: Combinatorics.cartesianProduct(
            widths,
            orients,
            caps
        ).toArray()
    },

    candlestick: {
        keys: ['width'],
        combinations: Combinatorics.cartesianProduct(
            widths
        ).toArray()
    },

    errorBar: {
        keys: ['width', 'orient'],
        combinations: Combinatorics.cartesianProduct(
            widths,
            orients
        ).toArray()
    },

    ohlc: {
        keys: ['width', 'orient'],
        combinations: Combinatorics.cartesianProduct(
            widths,
            orients
        ).toArray()
    }
};

module.exports = results;
