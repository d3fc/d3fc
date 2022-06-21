const { mkdirSync } = require('fs');
const { dirname, join } = require('path');

exports.toHaveConsistentPerformance = async function(received, runs = 3) {
    const tracesDirectory = join(dirname(this.testPath), '__traces__');
    mkdirSync(tracesDirectory, { recursive: true });
    const averages = {};
    for (let run = 0; run < runs; run++) {
        await page.tracing.start({
            path: join(tracesDirectory, `trace-${run}.json`)
        });
        await received(run);
        await page.tracing.stop();
        const entries = await page.evaluate(() => {
            const measures = performance.getEntriesByType('measure');
            performance.clearMeasures();
            return measures.map(({ name, duration }) => ({ name, duration }));
        });
        for (const { name, duration } of entries) {
            let average = averages[name];
            if (average == null) {
                average = { sum: 0, count: 0 };
                averages[name] = average;
            }
            average.sum += duration;
            average.count += 1;
        }
    }
    Object.entries(averages).forEach(([name, { sum, count }]) => {
        expect(sum / count).toMatchPerformanceSnapshot(name);
    });
    return { pass: true, message: () => '' };
};
