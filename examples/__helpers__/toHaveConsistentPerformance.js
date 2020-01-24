exports.toHaveConsistentPerformance = async function(received, runs = 3) {
    const averages = {};
    for (let run = 0; run < runs; run++) {
        await received(run);
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
