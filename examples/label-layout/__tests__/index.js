it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    const element = await page.$('svg');
    const image = await element.screenshot({
        omitBackground: true
    });
    expect(image).toMatchImageSnapshot();
    await d3fc.saveScreenshot(module, image);
});
