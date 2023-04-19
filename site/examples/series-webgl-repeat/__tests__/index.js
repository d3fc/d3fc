it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    const image = await page.screenshot({
        omitBackground: true
    });
    expect(image).toMatchImageSnapshot();
    await d3fc.saveScreenshot(module, image);
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
});
