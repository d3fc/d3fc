const { join } = require('path');

it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
});

it('should have consistent performance', async () => {
    await expect(async () => {
        await d3fc.loadExample(module);
        await d3fc.waitForEmptyRedrawQueue();
        for (let i = 0; i < 6; i++) {
            await page.click('d3fc-canvas');
            await d3fc.waitForEmptyRedrawQueue();
        }
    }).toHaveConsistentPerformance();

    expect(page).not.toHaveLogs();
});

it('should look good on the website!', async () => {
    await d3fc.loadExample(module);
    await page.screenshot({
        path: join(__dirname, '..', 'screenshot.png'),
        omitBackground: true
    });
});
