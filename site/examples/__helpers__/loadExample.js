const { dirname, sep } = require('path');

module.exports.loadExample = async module => {
    // disable setInterval
    await page.evaluateOnNewDocument(() => {
        // eslint-disable-next-line no-global-assign
        setInterval = () => -1;
    });

    const modulePathParts = dirname(module.filename).split(sep);
    const exampleName = modulePathParts[modulePathParts.length - 2];
    const examplePath = `/examples/${exampleName}/`;
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    await page.goto(new URL(examplePath, baseUrl));

    const hideOverlayLink = await page.waitForSelector('#hide-overlay');
    await hideOverlayLink.click();

    // skip d3 transitions to completion
    await page.evaluate(() => {
        performance.now = () => Infinity;
        d3.timerFlush();
    });
};
