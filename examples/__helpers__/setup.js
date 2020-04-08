const expect = require('expect');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const { toMatchPerformanceSnapshot } = require('./toMatchPerformanceSnapshot');
const { toHaveLogs } = require('./toHaveLogs');
const {
    toHaveConsistentPerformance
} = require('./toHaveConsistentPerformance');
const { loadExample } = require('./loadExample');
const { waitForEmptyRedrawQueue } = require('./waitForEmptyRedrawQueue');

expect.extend({
    toHaveConsistentPerformance,
    toHaveLogs,
    toMatchImageSnapshot,
    toMatchPerformanceSnapshot
});

global.d3fc = {
    loadExample,
    waitForEmptyRedrawQueue
};
