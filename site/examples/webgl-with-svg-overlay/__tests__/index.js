it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    const element = await page.waitForSelector('.webgl-plot-area');
    const image = await element.screenshot();
    expect(image).toMatchImageSnapshot();
    await d3fc.saveScreenshot(module, image);
});
