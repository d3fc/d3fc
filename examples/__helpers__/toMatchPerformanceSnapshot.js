const { toMatchSnapshot } = require('jest-snapshot');

const getSnapshot = (snapshotState, currentTestName, hint) => {
    if (snapshotState._updateSnapshot === 'all') {
        return null;
    }
    const key = `${currentTestName}: ${hint} 1`;
    const snapshot = snapshotState._snapshotData[key];
    if (snapshot == null) {
        return null;
    }
    return JSON.parse(snapshot);
};

exports.toMatchPerformanceSnapshot = function(
    received,
    hint,
    { absoluteTolerance = 5, relativeTolerance = 0.05 } = {}
) {
    const { snapshotState, currentTestName } = this;
    const expected = getSnapshot(snapshotState, currentTestName, hint);
    const tolerance = relativeTolerance * expected + absoluteTolerance;
    const pass = expected == null || Math.abs(received - expected) <= tolerance;
    const result = toMatchSnapshot.call(
        this,
        pass && expected != null ? expected : received,
        hint
    );
    if (result.pass !== pass) {
        throw new Error(`Internal inconsistency ${result.pass} !== ${pass}`);
    }
    return {
        pass,
        message: () => {
            return `Expected ${expected} +/- ${tolerance} for "${hint}" but got ${received}`;
        }
    };
};
