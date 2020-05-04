const { dirname, sep } = require('path');

module.exports.loadExample = async module => {
    const modulePathParts = dirname(module.filename).split(sep);
    const exampleName = modulePathParts[modulePathParts.length - 2];
    const examplePath = `/examples/${exampleName}/`;
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    await page.goto(new URL(examplePath, baseUrl));
    const hideOverlayLink = await page.waitForSelector('#hide-overlay');
    await hideOverlayLink.click();
};
