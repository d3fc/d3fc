it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    await page.waitForSelector('.webgl-plot-area');
    const image = await page.screenshot({
        omitBackground: true
    });
    expect(image).toMatchImageSnapshot();
    await d3fc.saveScreenshot(module, image);
});
