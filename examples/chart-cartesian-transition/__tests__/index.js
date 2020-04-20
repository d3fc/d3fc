const { join } = require('path');

it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
        failureThreshold: 1,
        failureThresholdType: 'percent'
    });
});

it('should look good on the website!', async () => {
    await d3fc.loadExample(module);
    await page.screenshot({
        path: join(__dirname, '..', 'screenshot.png'),
        omitBackground: true
    });
});
